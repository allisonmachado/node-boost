/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect } from 'chai';
import { CircularCache } from '../../src/lib/CircularCache';

describe('Minimal cache specification', () => {
    describe('constructor rules', async () => {
        it('should not allow for a big cache number', async () => {
            try {
                new CircularCache(11);
                expect.fail();
            } catch (error) {
                expect(error.message).to
                    .equal('[CircularCache]: this cache is supposed to be small, biggest size is 10');
            }
        });
    });

    describe('saving items up to the value of its internal size', async () => {
        it('should work for one item cache', async () => {
            const cache = new CircularCache(1);

            expect(cache.search('foo')).to.be.undefined;
            expect(cache.search('bar')).to.be.undefined;
            expect(cache.search('baz')).to.be.undefined;

            cache.save('foo', 1);

            expect(cache.search('foo')).to.equal(1);
            expect(cache.search('bar')).to.be.undefined;
            expect(cache.search('baz')).to.be.undefined;

            cache.save('bar', 2);

            expect(cache.search('foo')).to.be.undefined;
            expect(cache.search('bar')).to.equal(2);
            expect(cache.search('baz')).to.be.undefined;

            cache.save('baz', 3);

            expect(cache.search('foo')).to.be.undefined;
            expect(cache.search('bar')).to.be.undefined;
            expect(cache.search('baz')).to.equal(3);
        });

        it('should work for cache of size two', async () => {
            const cache = new CircularCache(2);

            expect(cache.search('foo')).to.be.undefined;
            expect(cache.search('bar')).to.be.undefined;
            expect(cache.search('baz')).to.be.undefined;

            cache.save('foo', 1);

            expect(cache.search('foo')).to.equal(1);
            expect(cache.search('bar')).to.be.undefined;
            expect(cache.search('baz')).to.be.undefined;

            cache.save('bar', 2);

            expect(cache.search('foo')).to.equal(1);
            expect(cache.search('bar')).to.equal(2);
            expect(cache.search('baz')).to.be.undefined;

            cache.save('baz', 3);

            expect(cache.search('foo')).to.be.undefined;
            expect(cache.search('bar')).to.equal(2);
            expect(cache.search('baz')).to.equal(3);
        });

        it('should work for cache of size three (default)', async () => {
            const cache = new CircularCache();

            expect(cache.search('foo')).to.be.undefined;
            expect(cache.search('bar')).to.be.undefined;
            expect(cache.search('baz')).to.be.undefined;

            cache.save('foo', 1);

            expect(cache.search('foo')).to.equal(1);
            expect(cache.search('bar')).to.be.undefined;
            expect(cache.search('baz')).to.be.undefined;

            cache.save('bar', 2);

            expect(cache.search('foo')).to.equal(1);
            expect(cache.search('bar')).to.equal(2);
            expect(cache.search('baz')).to.be.undefined;

            cache.save('baz', 3);

            expect(cache.search('foo')).to.equal(1);
            expect(cache.search('bar')).to.equal(2);
            expect(cache.search('baz')).to.equal(3);
        });
    });
});