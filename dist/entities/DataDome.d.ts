export declare function getTlsSession(): Promise<any>;
export declare function resetTlsSession(): void;
/**
 * Solve a DataDome challenge on the SAME session used for API requests.
 * DD ties cookie trust to TLS fingerprint — different session = low trust.
 *
 * bpc=1 → bpc=2 → bpc=1, returns valid datadome cookie ID.
 */
export declare function solveDataDome(initialCid?: string): Promise<string>;
