export declare function getTlsSession(): Promise<any>;
export declare function closeTlsSession(): void;
/**
 * Solve a DataDome challenge: bpc=1 → bpc=2 → bpc=1, all with Chrome TLS.
 * Returns a valid datadome cookie ID.
 */
export declare function solveDataDome(initialCid?: string): Promise<string>;
