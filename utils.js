export const queryStringify = (object = {}) => {
    return Object
        .entries(object)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
}

export const delay = (ms = 0) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}