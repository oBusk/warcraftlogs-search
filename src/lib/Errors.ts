export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

/**
 * Returns true if the error is an error that is expected to result
 * in a 404 behaviour. This includes sub-classes of {@link NotFoundError}.
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
    return error instanceof NotFoundError;
}

/**
 * Represents an error in the URL parameters sent by the user.
 */
export class MalformedUrlParameterError extends NotFoundError {
    constructor(message: string) {
        super(`Malformed parameter: ${message}`);
        this.name = "MalformedUrlParameterError";
    }
}

/**
 * Represents an error where the API handled our request, but the
 * query was bad in some way.
 */
export class UnsupportedQueryError extends NotFoundError {
    constructor(message: string) {
        super(`API refused parameter: ${message}`);
        this.name = "UnsupportedQueryError";
    }
}

// TODO Custom UX handling? Right now just falls to 500 error page.
export class ApiAuthenticationError extends Error {
    constructor(message: string) {
        super(`API authentication failed: ${message}`);
        this.name = "ApiAuthenticationError";
    }
}
