class Logger {
    static log(...args) {
        console.log("\x1b[46m log \x1b[0m", ...args);
    }

    static error(...args) {
        console.error("\x1b[41m error \x1b[0m", ...args);
    }

    static warn(...args) {
        console.error("\x1b[43m warn \x1b[0m", ...args);
    }
}

export default Logger;