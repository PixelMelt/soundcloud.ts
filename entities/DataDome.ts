import { execFileSync } from 'child_process';
import * as path from 'path';
import { createSession } from 'wreq-js';

// __dirname is dist/entities/ at runtime, go up two levels to package root
const SOLVER_BIN = path.join(__dirname, '..', '..', 'bin', 'datadome-solver');
const DDK = '7FC6D561817844F25B65CDD97F28A1';
const DD_ENDPOINT = 'https://dwt.soundcloud.com/js/';
const DDV = '5.5.1';
const UA =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36';
const CH_UA = '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"';

interface SolverOutput {
	jspl: string;
	eventCounters: string;
	jsType: string;
	signalCount: number;
}

function generatePayload(cid: string, bpc: number): SolverOutput {
	const args = [DDK, cid, String(bpc)];
	if (bpc >= 2) args.push('--interaction');
	const result = execFileSync(SOLVER_BIN, args, { encoding: 'utf-8', timeout: 5000 });
	return JSON.parse(result.trim());
}

/**
 * TLS-fingerprinted session singleton shared between DD solve and API requests.
 */
let _session: any = null;
export async function getTlsSession(): Promise<any> {
	if (!_session) {
		_session = await createSession({ browser: 'chrome_145' });
	}
	return _session;
}

export function closeTlsSession(): void {
	if (_session) {
		try { _session.close(); } catch {}
		_session = null;
	}
}

/**
 * POST to the DD endpoint with Chrome TLS fingerprint.
 */
async function ddPost(session: any, cid: string, bpc: number): Promise<string> {
	const payload = generatePayload(cid, bpc);

	const body = new URLSearchParams({
		jspl: payload.jspl,
		eventCounters: payload.eventCounters,
		jsType: payload.jsType,
		cid,
		ddk: DDK,
		Referer: encodeURIComponent('https://soundcloud.com/discover'),
		request: encodeURIComponent('/discover'),
		responsePage: 'origin',
		ddv: DDV,
	});

	const res = await session.fetch(DD_ENDPOINT, {
		method: 'POST',
		headers: {
			'sec-ch-ua-platform': '"Linux"',
			'User-Agent': UA,
			'sec-ch-ua': CH_UA,
			'Content-Type': 'application/x-www-form-urlencoded',
			'sec-ch-ua-mobile': '?0',
			Accept: '*/*',
			Origin: 'https://soundcloud.com',
			'Sec-Fetch-Site': 'same-site',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Dest': 'empty',
			Referer: 'https://soundcloud.com/',
			'Accept-Encoding': 'gzip, deflate, br, zstd',
			'Accept-Language': 'en-US,en;q=0.9',
		},
		body: body.toString(),
	});

	const dd = await res.json();
	const newCid = (dd.cookie || '').match(/datadome=([^;]+)/)?.[1] || '';
	return newCid || cid;
}

/**
 * Solve a DataDome challenge: bpc=1 → bpc=2 → bpc=1, all with Chrome TLS.
 * Returns a valid datadome cookie ID.
 */
export async function solveDataDome(initialCid?: string): Promise<string> {
	const session = await getTlsSession();
	let cid = initialCid || '.keep';

	cid = await ddPost(session, cid, 1);
	await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
	cid = await ddPost(session, cid, 2);
	await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
	cid = await ddPost(session, cid, 1);

	return cid;
}
