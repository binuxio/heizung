type errorCodes = 200 | 404 | 500 | "CLIENT_ERROR" | "ERR_NETWORK" | "ECONNABORTED" | number | undefined
export type _Response = { status: errorCodes, error?: string }

