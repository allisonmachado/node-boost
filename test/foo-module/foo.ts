import { Foo } from "../../src/foo-module";
import { expect } from "chai";

describe("Foo module", function() {
    describe("exposed initialization", function() {
        it("should receive proper size", function() {
            const foo = new Foo(5);
            expect(foo.getSize()).to.equal(5);
        });
    });
});