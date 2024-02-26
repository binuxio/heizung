type errorCodes = 200 | 404 | 500 | "CLIENT_ERROR" | "ERR_NETWORK" | "ECONNABORTED" | number | undefined
export type RequestReturn = { status: errorCodes, error?: string }

