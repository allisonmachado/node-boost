import check from "check-types";

/**
 * Should expose only static pure functions.
 */
export class CheckTypes {

  public static isUndefined(data: any): boolean {
    return check.undefined(data);
  }

  public static isNull(data: any): boolean {
    return check.null(data);
  }

  public static isNullOrUndefined(data: any): boolean {
    return (
      CheckTypes.isNull(data) ||
      CheckTypes.isUndefined(data)
    );
  }

  public static isTypeNumeric(data: any): boolean {
    return check.number(data);
  }

  public static isTypeNumericInteger(data: any): boolean {
    return check.number(data) && check.integer(data);
  }

  public static isTypeString(data: any): boolean {
    return check.string(data);
  }

  public static isTypeArray(data: any): boolean {
    return check.array(data);
  }

  public static isTypeStringOrArray(data: any): boolean {
    return (
      CheckTypes.isTypeString(data) || CheckTypes.isTypeArray(data)
    );
  }

  public static isEmptyString(data: any): boolean {
    if (CheckTypes.isTypeString(data)) {
      const trimmed: string = data.trim();
      return check.emptyString(trimmed);
    }
    return false;
  }

  public static isEmptyArray(data: any): boolean {
    return CheckTypes.isTypeArray(data) && check.emptyArray(data);
  }

  public static isFilledArray(data: any): boolean {
    return CheckTypes.isTypeArray(data) && !check.emptyArray(data);
  }

  public static isObject(data: any): boolean {
    return check.object(data);
  }

  public static isEmptyObject(data: any): boolean {
    return CheckTypes.isObject(data) && check.emptyObject(data);
  }

  public static hasContent(data: any): boolean {
    return (
      !CheckTypes.isUndefined(data) &&
      !CheckTypes.isNull(data) &&
      !CheckTypes.isEmptyArray(data) &&
      !CheckTypes.isEmptyString(data) &&
      !CheckTypes.isEmptyObject(data)
    );
  }

  public static assertHasContent(data: any, errorMessage: string): void {
    if (!CheckTypes.hasContent(data)) {
      throw new Error(errorMessage);
    }
  }

  public static assertAtLeastOneNotEmptyString(data: string[], errorMessage: string): void {
    for (const s of data) {
      if (!CheckTypes.isEmptyString(s)) {
        return;
      }
    }
    throw new Error(errorMessage);
  }

  public static assertAtLeastOneHasContent(data: any[], errorMessage: string): void {
    for (const s of data) {
      if (CheckTypes.hasContent(s)) {
        return;
      }
    }
    throw new Error(errorMessage);
  }
}