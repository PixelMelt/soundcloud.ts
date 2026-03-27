import { execFileSync } from 'child_process';
import * as path from 'path';

const SOLVER_BIN = path.join(__dirname, '..', 'bin', 'datadome-solver');
const DDK = '7FC6D561817844F25B65CDD97F28A1';
const DD_ENDPOINT = 'https://dwt.soundcloud.com/js/';
const DDV = '5.5.1';
const PAGE_REFERER = encodeURIComponent('https://soundcloud.com/discover');
const PAGE_REQUEST = encodeURIComponent('/discover');

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

async function ddPost(cid: string, bpc: number): Promise<string> {
	const payload = generatePayload(cid, bpc);
	const body = new URLSearchParams({
		jspl: payload.jspl,
		eventCounters: payload.eventCounters,
		jsType: payload.jsType,
		cid,
		ddk: DDK,
		Referer: PAGE_REFERER,
		request: PAGE_REQUEST,
		responsePage: 'origin',
		ddv: DDV,
	});

	const res = await fetch(DD_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent':
				'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
			Origin: 'https://soundcloud.com',
			Referer: 'https://soundcloud.com/',
			Accept: '*/*',
		},
		body: body.toString(),
	});

	const dd = (await res.json()) as { cookie?: string; status?: string };
	const match = dd.cookie?.match(/datadome=([^;]+)/);
	return match?.[1] || cid;
}

/**
 * Solve a DataDome challenge by running the bpc=1 → bpc=2 → bpc=1 trust flow.
 * Returns a valid datadome cookie ID.
 */
export async function solveDataDome(initialCid?: string): Promise<string> {
	let cid = initialCid || '.keep';

	// bpc=1: initial fingerprint
	cid = await ddPost(cid, 1);

	// Brief pause between requests
	await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));

	// bpc=2: interaction signals
	cid = await ddPost(cid, 2);

	await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

	// bpc=1: navigation trust
	cid = await ddPost(cid, 1);

	return cid;
}
