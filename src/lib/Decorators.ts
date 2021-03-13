/**
 * This is intended to be used as a Typescript decorator for request processor classes.
 * It should intercept exceptios and properly return 500 status code indicating an internal server error occured.
 */
export function CatchUnexpected(statusCode: number) {
    return (target: any) => {
        for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
            const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
            const isMethod = descriptor.value instanceof Function;
            if (!isMethod || propertyName === "constructor") {
                continue;
            }
            const originalMethod = descriptor.value;
            descriptor.value = async function(...args: any[]) {
                const res = args[1]; /* second arg provided by express */
                try {
                    await originalMethod.apply(this, args);
                } catch (error) {
                    this.logger.error(error);
                    res.status(statusCode).send();
                }
            };
            Object.defineProperty(target.prototype, propertyName, descriptor);
        }
    };
}

/**
 * This is intended to be used as a Typescript decorator for controller methods.
 * It should intercept duplicate entry exceptios and properly return 409 status code.
 * Indicating a conflict with the current state of the resource.
 */
export function CatchDuplicateEntry(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
        const res = args[1]; /* second arg provided by express */
        try {
            await originalMethod.apply(this, args);
        } catch (error) {
            if (error.message.includes("ER_DUP_ENTRY")) {
                res.status(409).send();
            } else {
                throw error;
            }
        }
    };
}

/**
 * This is intended to be used as a Typescript decorator for controller methods.
 * It should intercept forbidden exceptios and properly return 403 status code.
 * Indicating the lack of permissions to perform the action.
 */
export function CatchActionForbidden(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
        const res = args[1]; /* second arg provided by express */
        try {
            await originalMethod.apply(this, args);
        } catch (error) {
            if (error.message.includes("Action forbidden")) {
                res.status(403).send();
            } else {
                throw error;
            }
        }
    };
}
