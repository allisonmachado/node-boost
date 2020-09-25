import * as _ from "lodash";

/**
 * Should expose only static pure functions.
 */
export class SharedLibrary {
  public static async delay(milliseconds: number): Promise<void> {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve();
          }, milliseconds);
      })
  }
}