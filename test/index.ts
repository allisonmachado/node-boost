// tslint:disable: only-arrow-functions
import { expect } from "chai";
import { process } from "../src";

describe("Index module", function() {
    describe("expected behavior", function() {
        it("should return hello world", function() {
            expect(process()).to.equal("Hello World");
        });
    });
});