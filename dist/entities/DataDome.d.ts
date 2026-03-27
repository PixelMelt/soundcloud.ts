export declare function getTlsSession(): Promise<any>;
export declare function resetTlsSession(): void;
/**
 * Solve a DataDome challenge: bpc=1 → bpc=2 → bpc=1.
 * Uses a dedicated session for the solve, then resets the main session
 * so the API retry uses a clean cookie jar with only x-datadome-clientid.
 */
export declare function solveDataDome(initialCid?: string): Promise<string>;
