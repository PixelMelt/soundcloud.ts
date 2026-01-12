import type { SoundcloudTrack, SoundcloudTranscoding } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { ID3Writer } from 'browser-id3-writer';
import { API } from '../API';
import { Tracks, Users, Playlists } from './index';
import { Readable } from 'stream';
import { spawnSync } from 'child_process';
import { sanitize } from 'sanitize-filename-ts';
import axios from 'axios';

let temp = 0;
const FFMPEG = { checked: false, path: '' };
const SOURCES: (() => string)[] = [
	() => {
		const ffmpeg = require('ffmpeg-static');
		return ffmpeg?.path ?? ffmpeg;
	},
	() => 'ffmpeg',
	() => './ffmpeg',
];

// Max filename length in bytes (most filesystems limit to 255 bytes)
const MAX_FILENAME_BYTES = 200; // Leave room for extension and safety margin

/**
 * Truncates a string to fit within a maximum byte length.
 * Handles multi-byte unicode characters properly.
 */
const truncateToByteLength = (str: string, maxBytes: number): string => {
	const encoder = new TextEncoder();
	const encoded = encoder.encode(str);
	if (encoded.length <= maxBytes) return str;
	
	// Binary search for the right character cutoff
	let low = 0;
	let high = str.length;
	while (low < high) {
		const mid = Math.ceil((low + high) / 2);
		if (encoder.encode(str.slice(0, mid)).length <= maxBytes) {
			low = mid;
		} else {
			high = mid - 1;
		}
	}
	return str.slice(0, low);
};

/**
 * Safely sanitizes and truncates a title for use as a filename.
 */
const safeTitle = (title: string): string => {
	let safe = sanitize(title);
	safe = truncateToByteLength(safe, MAX_FILENAME_BYTES);
	// Trim trailing dots/spaces which can cause issues on Windows
	safe = safe.replace(/[\s.]+$/, '');
	return safe || 'untitled';
};

export class Util {
	private readonly tracks = new Tracks(this.api);
	private readonly users = new Users(this.api);
	private readonly playlists = new Playlists(this.api);
	public constructor(private readonly api: API) {}

	private readonly resolveTrack = async (trackResolvable: string | SoundcloudTrack) => {
		return typeof trackResolvable === 'string'
			? await this.tracks.get(trackResolvable)
			: trackResolvable;
	};

	private readonly sortTranscodings = async (
		trackResolvable: string | SoundcloudTrack,
		protocol?: 'progressive' | 'hls',
	) => {
		const track = await this.resolveTrack(trackResolvable);
		const transcodings = track.media.transcodings.sort((t) => (t.quality === 'hq' ? -1 : 1));
		if (!protocol) return transcodings;
		return transcodings.filter((t) => t.format.protocol === protocol);
	};

	private readonly getStreamLink = async (transcoding: SoundcloudTranscoding) => {
		if (!transcoding?.url) return null;
		const url = transcoding.url;
		let client_id = await this.api.getClientId();
		const headers = this.api.headers;
		let connect = url.includes('?') ? `&client_id=${client_id}` : `?client_id=${client_id}`;
		try {
			const response = await axios.get(url + connect, { headers });
			return response.data.url;
		} catch (error) {
			console.error('Error fetching stream link (attempt 1):', error);
			client_id = await this.api.getClientId(true);
			connect = url.includes('?') ? `&client_id=${client_id}` : `?client_id=${client_id}`;
			try {
				const response = await axios.get(url + connect, { headers });
				return response.data.url;
			} catch (error2) {
				console.error('Error fetching stream link (attempt 2):', error2);
				return null;
			}
		}
	};

	/**
	 * Gets the direct streaming link of a track.
	 */
	public streamLink = async (
		trackResolvable: string | SoundcloudTrack,
		protocol?: 'progressive' | 'hls',
	) => {
		const track = await this.resolveTrack(trackResolvable);
		const transcodings = await this.sortTranscodings(track, protocol);
		if (!transcodings.length) return null;
		return this.getStreamLink(transcodings[0]);
	};

	private readonly mergeFiles = async (files: string[], outputFile: string): Promise<void> => {
		const outStream = fs.createWriteStream(outputFile);
		const ret = new Promise<void>((resolve, reject) => {
			outStream.on('finish', resolve);
			outStream.on('error', reject);
		});
		for (const file of files) {
			await new Promise((resolve, reject) => {
				fs.createReadStream(file)
					.on('error', reject)
					.on('end', resolve)
					.pipe(outStream, { end: false });
			});
		}
		outStream.end();
		return ret;
	};

	private readonly checkFFmpeg = () => {
		if (FFMPEG.checked) return true;
		for (const fn of SOURCES) {
			try {
				const command = fn();
				const result = spawnSync(command, ['-h'], {
					windowsHide: true,
					shell: true,
					encoding: 'utf-8',
				});
				if (result.error) throw result.error;
				if (result.stderr && !result.stdout) throw new Error(result.stderr);

				const output = result.output.filter(Boolean).join('\n');
				const version = /version (.+) Copyright/im.exec(output)?.[1];
				if (!version) throw new Error(`Malformed FFmpeg command using ${command}`);
				FFMPEG.path = command;
			} catch {}
		}
		FFMPEG.checked = true;
		if (!FFMPEG.path) {
			console.warn(
				'FFmpeg not found, please install ffmpeg-static or add ffmpeg to your PATH.',
			);
			console.warn('Download m4a (hq) is disabled, use mp3 (sq) instead.');
		}
		return true;
	};

	private readonly spawnFFmpeg = (argss: string[]) => {
		try {
			spawnSync(FFMPEG.path, argss, { windowsHide: true, shell: false });
		} catch (e) {
			console.error(e);
			throw 'FFmpeg error';
		}
	};

	/**
	 * Readable stream of m3u playlists.
	 */
	private readonly m3uReadableStream = async (
		trackResolvable: string | SoundcloudTrack,
	): Promise<{ stream: NodeJS.ReadableStream; type: 'm4a' | 'mp3' }> => {
		const track = await this.resolveTrack(trackResolvable);
		const transcodings = await this.sortTranscodings(track, 'hls');
		if (!transcodings.length) throw 'No transcodings found';
		let transcoding: { url: string; type: 'm4a' | 'mp3' };
		for (const t of transcodings) {
			if (t.format.mime_type.startsWith('audio/mp4; codecs="mp4a') && this.checkFFmpeg()) {
				transcoding = { url: t.url, type: 'm4a' };
				break;
			}
			if (t.format.mime_type.startsWith('audio/mpeg')) {
				transcoding = { url: t.url, type: 'mp3' };
				break;
			}
		}
		if (!transcoding) {
			console.log(`Support for this track is not yet implemented, please open an issue on GitHub.\n
            URL: ${track.permalink_url}.\n
            Type: ${track.media.transcodings.map((t) => t.format.mime_type).join(' | ')}`);
			throw 'No supported transcodings found';
		}
		const headers = this.api.headers;
		const client_id = await this.api.getClientId();
		const connect = transcoding.url.includes('?')
			? `&client_id=${client_id}`
			: `?client_id=${client_id}`;
		let m3uLink: string;
		try {
			const response = await axios.get(transcoding.url + connect, { headers });
			m3uLink = response.data.url;
		} catch (error) {
			console.error('Error fetching M3U link:', error);
			throw 'Failed to fetch M3U link';
		}
		const destDir = path.join(__dirname, `tmp_${temp++}`);
		if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
		const output = path.join(destDir, `out.${transcoding.type}`);

		if (transcoding.type === 'm4a') {
			try {
				this.spawnFFmpeg([
					'-y',
					'-loglevel',
					'warning',
					'-i',
					m3uLink,
					'-bsf:a',
					'aac_adtstoasc',
					'-vcodec',
					'copy',
					'-c',
					'copy',
					'-crf',
					'50',
					output,
				]);
			} catch {
				console.warn('Failed to transmux to m4a (hq), download as mp3 (hq) instead.');
				FFMPEG.path = null;
				return this.m3uReadableStream(trackResolvable);
			}
		} else {
			let m3u: string;
			try {
				const response = await axios.get(m3uLink, {
					headers,
					responseType: 'text',
				});
				m3u = response.data;
			} catch (error) {
				console.error('Error fetching M3U content:', error);
				Util.removeDirectory(destDir);
				throw 'Failed to fetch M3U content';
			}
			const urls = m3u.match(/(http).*?(?=\s)/gm);
			if (!urls) {
				Util.removeDirectory(destDir);
				throw 'Could not parse URLs from M3U';
			}
			const chunks: string[] = [];
			for (let i = 0; i < urls.length; i++) {
				try {
					const response = await axios.get(urls[i], {
						headers,
						responseType: 'arraybuffer',
					});
					const chunkPath = path.join(destDir, `${i}.${transcoding.type}`);
					fs.writeFileSync(chunkPath, Buffer.from(response.data));
					chunks.push(chunkPath);
				} catch (error) {
					console.error(`Error downloading chunk ${i} (${urls[i]}):`, error);
					continue;
				}
			}
			await this.mergeFiles(chunks, output);
		}
		const stream: NodeJS.ReadableStream = Readable.from(fs.readFileSync(output));
		Util.removeDirectory(destDir);
		return { stream, type: transcoding.type };
	};

	/**
	 * Downloads the mp3 stream of a track.
	 */
	private readonly downloadTrackStream = async (
		trackResolvable: string | SoundcloudTrack,
		title: string,
		dest: string,
	) => {
		let result: { stream: NodeJS.ReadableStream; type: string };
		const track = await this.resolveTrack(trackResolvable);

		title = safeTitle(title);

		const transcodings = await this.sortTranscodings(track, 'progressive');
		if (!transcodings.length) {
			result = await this.m3uReadableStream(trackResolvable);
		} else {
			const transcoding = transcodings[0];
			const url = await this.getStreamLink(transcoding);
			if (!url) {
				console.log(transcodings, url);
				throw new Error('Could not get stream link for progressive download');
			}
			const headers = this.api.headers;
			let stream: NodeJS.ReadableStream;
			try {
				const response = await axios.get(url, {
					headers,
					responseType: 'stream',
				});
				stream = response.data;
			} catch (error) {
				console.error('Error fetching progressive stream:', error);
				result = await this.m3uReadableStream(trackResolvable);
				stream = result.stream;
				const typeFromM3u = result.type;
				result = { stream, type: typeFromM3u };
				const fileName = path.extname(dest)
					? dest
					: path.join(dest, `${title}.${result.type}`);
				const writeStream = fs.createWriteStream(fileName);
				stream.pipe(writeStream);
				await new Promise<void>((resolve, reject) => {
					stream.on('end', resolve);
					stream.on('error', reject);
				});
				return fileName;
			}

			const type = transcoding.format.mime_type.startsWith('audio/mp4; codecs="mp4a')
				? 'm4a'
				: 'mp3';
			result = { stream, type };
		}

		const stream = result.stream;
		const fileName = path.extname(dest) ? dest : path.join(dest, `${title}.${result.type}`);
		const writeStream = fs.createWriteStream(fileName);
		stream.pipe(writeStream);

		await new Promise<void>((resolve) => stream.on('end', () => resolve()));
		return fileName;
	};

	/**
	 * Downloads a track on Soundcloud.
	 */
	public downloadTrack = async (trackResolvable: string | SoundcloudTrack, dest?: string, metadata: boolean = true) => {
		if (!dest) dest = './';
		const folder = path.extname(dest) ? path.dirname(dest) : dest;
		if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
		const track = await this.resolveTrack(trackResolvable);
		let output = '';

		const safeTitleStr = safeTitle(track.title);

		if (track.downloadable === true && track.has_downloads_left === true) {
			try {
				const downloadObj = (await this.api.getV2(`/tracks/${track.id}/download`)) as any;
				let result;
				try {
					result = await axios.get(downloadObj.redirectUri, {
						responseType: 'arraybuffer',
						maxRedirects: 0,
						validateStatus: (status) => status >= 200 && status < 400,
					});
				} catch (error: any) {
					if (
						error.response &&
						error.response.status === 302 &&
						error.response.headers.location
					) {
						result = await axios.get(error.response.headers.location, {
							responseType: 'arraybuffer',
						});
					} else {
						console.error(
							'Error fetching downloadable track (initial/redirect):',
							error,
						);
						output = await this.downloadTrackStream(track, safeTitleStr, dest);
						if (metadata) await this.writeMetadata(track, output);
						return output;
					}
				}

				dest = path.extname(dest)
					? dest
					: path.join(
							dest,
							`${safeTitleStr}.${result.headers['x-amz-meta-file-type'] || 'mp3'}`,
					  );
				const arrayBuffer = result.data;
				fs.writeFileSync(dest, Buffer.from(arrayBuffer));
				output = dest;
			} catch (e) {
				console.error('Error processing direct download:', e);
				output = await this.downloadTrackStream(track, safeTitleStr, dest);
			}
		} else {
			output = await this.downloadTrackStream(track, safeTitleStr, dest);
		}

		if (metadata) await this.writeMetadata(track, output);
		return output;
	};

	/**
	 * Writes ID3 metadata to a downloaded track.
	 */
	private readonly writeMetadata = async (track: SoundcloudTrack, outputPath: string) => {
		try {
			const coverLink = await this.downloadSongCover(track, '', true);
			const imageResponse = await axios.get(coverLink, { responseType: 'arraybuffer' });
			const imageBuffer = imageResponse.data;
			const buffer = new Uint8Array(fs.readFileSync(outputPath)).buffer;
			const writer = new ID3Writer(buffer);
			writer.setFrame('TIT2', track.title)
				.setFrame('TPE1', [track.user.username])
				.setFrame('TLEN', track.duration)
				.setFrame('TYER', new Date(track.created_at).getFullYear())
				.setFrame('TCON', [track.genre])
				.setFrame('COMM', {
					description: 'Description',
					text: track.description ?? '',
					language: 'eng'
				})
				.setFrame('APIC', {
					type: 3,
					data: imageBuffer,
					description: track.title,
					useUnicodeEncoding: false
				});
			writer.addTag();
			const taggedBuffer = await writer.getBlob().arrayBuffer();
			fs.writeFileSync(outputPath, new Uint8Array(taggedBuffer));
		} catch (error) {
			console.error('Error writing metadata:', error);
		}
	};

	/**
	 * Downloads an array of tracks.
	 */
	public downloadTracks = async (
		tracks: SoundcloudTrack[] | string[],
		dest?: string,
		limit?: number,
	) => {
		if (!limit) limit = tracks.length;
		const resultArray: string[] = [];
		for (let i = 0; i < limit; i++) {
			try {
				const result = await this.downloadTrack(tracks[i], dest);
				resultArray.push(result);
			} catch {
				continue;
			}
		}
		return resultArray;
	};

	/**
	 * Downloads all the tracks from the search query.
	 */
	public downloadSearch = async (query: string, dest?: string, limit?: number) => {
		const tracks = await this.tracks.search({ q: query });
		return this.downloadTracks(tracks.collection, dest, limit);
	};

	/**
	 * Download all liked tracks by a user.
	 */
	public downloadLikes = async (
		userResolvable: string | number,
		dest?: string,
		limit?: number,
	) => {
		const tracks = await this.users.likes(userResolvable, limit);
		return this.downloadTracks(tracks, dest, limit);
	};

	/**
	 * Downloads all the tracks in a playlist.
	 */
	public downloadPlaylist = async (playlistResolvable: string, dest?: string, limit?: number) => {
		const playlist = await this.playlists.get(playlistResolvable);
		return this.downloadTracks(playlist.tracks, dest, limit);
	};

	/**
	 * Returns a readable stream to the track.
	 */
	public streamTrack = async (
		trackResolvable: string | SoundcloudTrack,
	): Promise<NodeJS.ReadableStream> => {
		const url = await this.streamLink(trackResolvable, 'progressive');
		if (!url) {
			const { stream } = await this.m3uReadableStream(trackResolvable);
			return stream;
		}
		try {
			const response = await axios.get(url, {
				headers: this.api.headers,
				responseType: 'stream',
			});
			return response.data as NodeJS.ReadableStream;
		} catch (error) {
			console.error('Error fetching progressive stream for streamTrack:', error);
			const { stream } = await this.m3uReadableStream(trackResolvable);
			return stream;
		}
	};

	/**
	 * Downloads a track's song cover.
	 */
	public downloadSongCover = async (
		trackResolvable: string | SoundcloudTrack,
		dest?: string,
		noDL?: boolean,
	) => {
		if (!dest) dest = './';
		const folder = dest;
		if (folder !== './' && !fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
		const track = await this.resolveTrack(trackResolvable);
		const artwork = (track.artwork_url ? track.artwork_url : track.user.avatar_url)
			.replace('.jpg', '.png')
			.replace('-large', '-t500x500');
		const title = safeTitle(track.title);
		dest = path.extname(dest) ? dest : path.join(folder, `${title}.png`);
		const client_id = await this.api.getClientId();
		const url = `${artwork}?client_id=${client_id}`;
		if (noDL) return url;
		try {
			const response = await axios.get(url, { responseType: 'arraybuffer' });
			fs.writeFileSync(dest, Buffer.from(response.data));
			return dest;
		} catch (error) {
			console.error('Error downloading song cover:', error);
			throw new Error(`Failed to download song cover from ${url}`);
		}
	};

	private static readonly removeDirectory = (dir: string) => {
		if (!fs.existsSync(dir)) return;
		fs.readdirSync(dir).forEach((file) => {
			const current = path.join(dir, file);
			if (fs.lstatSync(current).isDirectory()) {
				Util.removeDirectory(current);
			} else {
				fs.unlinkSync(current);
			}
		});
		try {
			fs.rmdirSync(dir);
		} catch (error) {
			console.error(error);
		}
	};
}
