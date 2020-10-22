import * as _ from "lodash";

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
}