import * as _ from "lodash";
import * as bcrypt from "bcryptjs";

/**
 * Should expose only static pure functions.
 */
export class SharedFunctions {
    public static async delay(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, milliseconds);
        })
    }

    public static async hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    reject(err);
                } else {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(hash);
                        }
                    });
                }
            });
        });
    }

    public static async compareHashedPassword(password: string, hash: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
}