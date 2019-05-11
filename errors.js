class APIError extends Error {
    constructor(errorObject = {}) {
        super();

        this.code = errorObject.code;
        this.name = this.constructor.name;
        this.message = `Code (${this.code}) => ${errorObject.message}`;

        Error.captureStackTrace(this, this.constructor.name);
    }
}

class AxiosError extends Error {
    constructor(errorMessage = {}) {
        super();

        this.name = this.constructor.name;
        this.message = errorMessage;

        Error.captureStackTrace(this, this.constructor);
    }
}

class GlobalError extends Error {
    constructor(errorMessage) {
        super();

        this.name = this.constructor.name;
        this.message = errorMessage;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { APIError, AxiosError, GlobalError };