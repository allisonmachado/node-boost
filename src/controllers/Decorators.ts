import { Logger } from "../lib/Logger";

/**
 * This is intended to be used as a Typescript decorator for controller classes.
 * It should intercept exceptios and properly return 500 status code indicating an internal server error occured.
 */
export function CatchUnexpected(target: Function) {
    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
        const isMethod = descriptor.value instanceof Function;
        if (!isMethod || propertyName === "constructor") {
            continue;
        }
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const res = args[1]; // second arg provided by express
            try {
                await originalMethod.apply(this, args);
            } catch (error) {
                const logger = new Logger("GenericErrorHandler");
                logger.error(error);
                res.status(500).send();
            }
        };
        Object.defineProperty(target.prototype, propertyName, descriptor);
    }
}

/**
 * This is intended to be used as a Typescript decorator for controller methods.
 * It should intercept duplicate entry exceptios and properly return 409 status code.
 * Indicating a conflict with the current state of the resource.
 */
export function CatchDuplicateEntry(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        const res = args[1]; // second arg provided by express
        try {
            await originalMethod.apply(this, args);
        } catch (error) {
            if (error.message.includes('ER_DUP_ENTRY')) {
                res.status(409).send();
            }
            else {
                throw error;
            }
        }
    };
}
