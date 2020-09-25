import { expect } from "chai";
import { CheckTypes } from "../src/CheckTypes";

describe("CheckTypes Specification", () => {
  describe("Content types and value verification", () => {
    it("should verify undefined values", async () => {
      let variab: any;
      expect(CheckTypes.isUndefined(variab)).to.be.true;
      variab = null;
      expect(CheckTypes.isUndefined(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.isUndefined(variab)).to.be.false;
      variab = "";
      expect(CheckTypes.isUndefined(variab)).to.be.false;
      variab = 0;
      expect(CheckTypes.isUndefined(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isUndefined(variab)).to.be.false;
      variab = [];
      expect(CheckTypes.isUndefined(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.isUndefined(variab)).to.be.false;
      variab = ["1", "2"];
      expect(CheckTypes.isUndefined(variab)).to.be.false;
      variab = 1234;
      expect(CheckTypes.isUndefined(variab)).to.be.false;
    });

    it("should verify null values", async () => {
      let variab: any;
      expect(CheckTypes.isNull(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.isNull(variab)).to.be.true;
      variab = "hello";
      expect(CheckTypes.isNull(variab)).to.be.false;
      variab = "";
      expect(CheckTypes.isNull(variab)).to.be.false;
      variab = 0;
      expect(CheckTypes.isNull(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isNull(variab)).to.be.false;
      variab = [];
      expect(CheckTypes.isNull(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.isNull(variab)).to.be.false;
      variab = ["1", "2"];
      expect(CheckTypes.isNull(variab)).to.be.false;
      variab = 1234;
      expect(CheckTypes.isNull(variab)).to.be.false;
    });

    it("should verify if values is null or undefined", async () => {
      let variab: any;
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.true;
      variab = null;
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.true;
      variab = "hello";
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.false;
      variab = "";
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.false;
      variab = 0;
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.false;
      variab = [];
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.false;
      variab = ["1", "2"];
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.false;
      variab = 1234;
      expect(CheckTypes.isNullOrUndefined(variab)).to.be.false;
    });

    it("should verify if values is of type string", async () => {
      let variab: any;
      expect(CheckTypes.isTypeString(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.isTypeString(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.isTypeString(variab)).to.be.true;
      variab = "";
      expect(CheckTypes.isTypeString(variab)).to.be.true;
      variab = 0;
      expect(CheckTypes.isTypeString(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isTypeString(variab)).to.be.false;
      variab = [];
      expect(CheckTypes.isTypeString(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.isTypeString(variab)).to.be.false;
      variab = ["1", "2"];
      expect(CheckTypes.isTypeString(variab)).to.be.false;
      variab = 1234;
      expect(CheckTypes.isTypeString(variab)).to.be.false;
    });

    it("should verify if values is of type array", async () => {
      let variab: any;
      expect(CheckTypes.isTypeArray(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.isTypeArray(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.isTypeArray(variab)).to.be.false;
      variab = "";
      expect(CheckTypes.isTypeArray(variab)).to.be.false;
      variab = 0;
      expect(CheckTypes.isTypeArray(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isTypeArray(variab)).to.be.false;
      variab = [];
      expect(CheckTypes.isTypeArray(variab)).to.be.true;
      variab = [1, 2];
      expect(CheckTypes.isTypeArray(variab)).to.be.true;
      variab = ["1", "2"];
      expect(CheckTypes.isTypeArray(variab)).to.be.true;
      variab = 1234;
      expect(CheckTypes.isTypeArray(variab)).to.be.false;
    });

    it("should verify if values is of type string or array", async () => {
      let variab: any;
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.true;
      variab = "";
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.true;
      variab = 0;
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.false;
      variab = [];
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.true;
      variab = [1, 2];
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.true;
      variab = ["1", "2"];
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.true;
      variab = 1234;
      expect(CheckTypes.isTypeStringOrArray(variab)).to.be.false;
    });

    it("should verify if values is an empty string", async () => {
      let variab: any;
      expect(CheckTypes.isEmptyString(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.isEmptyString(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.isEmptyString(variab)).to.be.false;
      variab = "";
      expect(CheckTypes.isEmptyString(variab)).to.be.true;
      variab = "   ";
      expect(CheckTypes.isEmptyString(variab)).to.be.true;
      variab = 0;
      expect(CheckTypes.isEmptyString(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isEmptyString(variab)).to.be.false;
      variab = [];
      expect(CheckTypes.isEmptyString(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.isEmptyString(variab)).to.be.false;
      variab = ["1", "2"];
      expect(CheckTypes.isEmptyString(variab)).to.be.false;
      variab = 1234;
      expect(CheckTypes.isEmptyString(variab)).to.be.false;
    });

    it("should verify if values is an empty array", async () => {
      let variab: any;
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
      variab = "";
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
      variab = 0;
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
      variab = [];
      expect(CheckTypes.isEmptyArray(variab)).to.be.true;
      variab = [null, undefined];
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
      variab = ["1", "2"];
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
      variab = 1234;
      expect(CheckTypes.isEmptyArray(variab)).to.be.false;
    });

    it("should verify if values is an array with content", async () => {
      let variab: any;
      expect(CheckTypes.isFilledArray(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.isFilledArray(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.isFilledArray(variab)).to.be.false;
      variab = "";
      expect(CheckTypes.isFilledArray(variab)).to.be.false;
      variab = 0;
      expect(CheckTypes.isFilledArray(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isFilledArray(variab)).to.be.false;
      variab = [];
      expect(CheckTypes.isFilledArray(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.isFilledArray(variab)).to.be.true;
      variab = ["1", "2"];
      expect(CheckTypes.isFilledArray(variab)).to.be.true;
      variab = 1234;
      expect(CheckTypes.isFilledArray(variab)).to.be.false;
    });

    it("should check if is an object", async () => {
      let variab: any;
      expect(CheckTypes.isObject(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.isObject(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.isObject(variab)).to.be.false;
      variab = "";
      expect(CheckTypes.isObject(variab)).to.be.false;
      variab = 0;
      expect(CheckTypes.isObject(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isObject(variab)).to.be.true;
      variab = {a: "a"};
      expect(CheckTypes.isObject(variab)).to.be.true;
      variab = [];
      expect(CheckTypes.isObject(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.isObject(variab)).to.be.false;
      variab = ["1", "2"];
      expect(CheckTypes.isObject(variab)).to.be.false;
      variab = 1234;
      expect(CheckTypes.isObject(variab)).to.be.false;
    });

    it("should check if is an empty object", async () => {
      let variab: any;
      expect(CheckTypes.isEmptyObject(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.isEmptyObject(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.isEmptyObject(variab)).to.be.false;
      variab = "";
      expect(CheckTypes.isEmptyObject(variab)).to.be.false;
      variab = 0;
      expect(CheckTypes.isEmptyObject(variab)).to.be.false;
      variab = {};
      expect(CheckTypes.isEmptyObject(variab)).to.be.true;
      variab = [];
      expect(CheckTypes.isEmptyObject(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.isEmptyObject(variab)).to.be.false;
      variab = ["1", "2"];
      expect(CheckTypes.isEmptyObject(variab)).to.be.false;
      variab = 1234;
      expect(CheckTypes.isEmptyObject(variab)).to.be.false;
    });

    it("should check if content if present", async () => {
      let variab: any;
      expect(CheckTypes.hasContent(variab)).to.be.false;
      variab = null;
      expect(CheckTypes.hasContent(variab)).to.be.false;
      variab = undefined;
      expect(CheckTypes.hasContent(variab)).to.be.false;
      variab = "hello";
      expect(CheckTypes.hasContent(variab)).to.be.true;
      variab = "";
      expect(CheckTypes.hasContent(variab)).to.be.false;
      variab = 0;
      expect(CheckTypes.hasContent(variab)).to.be.true;
      variab = {};
      expect(CheckTypes.hasContent(variab)).to.be.false;
      variab = {a: "a"};
      expect(CheckTypes.hasContent(variab)).to.be.true;
      variab = [];
      expect(CheckTypes.hasContent(variab)).to.be.false;
      variab = [1, 2];
      expect(CheckTypes.hasContent(variab)).to.be.true;
      variab = ["1", "2"];
      expect(CheckTypes.hasContent(variab)).to.be.true;
      variab = 1234;
      expect(CheckTypes.hasContent(variab)).to.be.true;
    });
  });
});