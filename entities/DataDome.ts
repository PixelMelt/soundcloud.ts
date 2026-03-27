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
 * TLS-fingerprinted session. Recreated after each DD solve to clear the cookie jar.
 */
let _session: any = null;
export async function getTlsSession(): Promise<any> {
	if (!_session) {
		_session = await createSession({ browser: 'chrome_145' });
	}
	return _session;
}

export function resetTlsSession(): void {
	if (_session) {
		try { _session.close(); } catch {}
	}
	_session = null;
}

/**
 * POST to the DD endpoint using a separate session (no stale cookies).
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
 * Solve a DataDome challenge: bpc=1 → bpc=2 → bpc=1.
 * Uses a dedicated session for the solve, then resets the main session
 * so the API retry uses a clean cookie jar with only x-datadome-clientid.
 */
export async function solveDataDome(initialCid?: string): Promise<string> {
	// Use a dedicated session for the solve POSTs so the main session's
	// cookie jar doesn't get polluted with DD cookies
	const solveSession = await createSession({ browser: 'chrome_145' });
	let cid = initialCid || '.keep';

	try {
		cid = await ddPost(solveSession, cid, 1);
		await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
		cid = await ddPost(solveSession, cid, 2);
		await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
		cid = await ddPost(solveSession, cid, 1);
	} finally {
		try { solveSession.close(); } catch {}
	}

	// Reset the main API session so the retry starts with a clean cookie jar
	resetTlsSession();

	return cid;
}
