/* eslint-disable @typescript-eslint/ban-ts-comment */
import { User } from '../../src/data/entities/User';
import { expect } from 'chai';
import { BaseAuthService } from '../../src/services/AuthService';
import { CircularCache } from '../../src/lib/CircularCache';

import jwt from 'jsonwebtoken';
import sinon from 'sinon';

import * as bcrypt from 'bcryptjs';
import { BaseLogger } from '../../src/lib/Logger';

describe('Auth Service', () => {
    const logger = new BaseLogger('Auth Service Spec');
    const secret = 'abcd-1234';
    const cache = new CircularCache<User>(3);

    const genSalt = (str: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (genSaltErr, salt) => {
                if (genSaltErr) {
                    reject(genSaltErr);
                } else {
                    bcrypt.hash(str, salt, (hashErr, hash) => {
                        if (hashErr) {
                            reject(hashErr);
                        } else {
                            resolve(hash);
                        }
                    });
                }
            });
        });
    };

    const jwtVerify = (token: string, secret: string): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err: Error | null, decoded: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    };

    describe('private implementations', async () => {
        it('should abstract bcrypt async compare hashed password', async () => {
            const authService = new BaseAuthService(secret, null, cache, logger);
            const password = 'abcdxyz';
            const hash = await genSalt(password);

            // @ts-ignore
            const comparison = await authService.compareHashedPassword(password, hash);

            expect(comparison).to.be.true;
        });

        it('should abstract jwt signing process', async () => {
            const authService = new BaseAuthService(secret, null, cache, logger);
            // @ts-ignore
            const token = await authService.sign({ data: 'any' }, secret, { expiresIn: '10h' });
            const decodedJwt = await jwtVerify(token, secret);

            expect(decodedJwt['data']).to.equal('any');
        });
    });

    describe('access token generation and validation', async () => {
        it('should sign and verify a valid token format', async () => {
            const cache = new CircularCache<User>(3);
            cache.save('foobar@email.com', {
                id: 1,
                name: 'Foo',
                surname: 'Bar',
                email: 'foobar@email.com',
                password: '12345'
            });
            const authService = new BaseAuthService(secret, null, cache, logger);

            const token = await authService.signAccessToken('foobar@email.com');
            const decoded = await authService.validateAccessToken(token);

            expect(decoded.name).to.equal('Foo');
            expect(decoded.surname).to.equal('Bar');
            expect(decoded.email).to.equal('foobar@email.com');
        });

        it('should not verify token not signed by the system', async () => {
            const authService = new BaseAuthService(secret, null, cache, logger);
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
                '.eyJuYW1lIjoiSm9obiIsInN1cm5hbWUiOiJEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZW1haWwuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ' +
                '.PKyYB3UlAyDnDKlUSl7IHkAiqplvY_nKw1nLUbqj3i0';

            try {
                await authService.validateAccessToken(token);
                expect.fail('this token was not signed by the system');
            } catch (error) {
                expect(error.message).to.include('invalid signature');
            }
        });

        it('should not verify token signed by the system but with an invalid format', async () => {
            const authService = new BaseAuthService(secret, null, cache, logger);
            const tokenPayload = {
                name: 'Foo',
                surname: 'Bar',
            };

            try {
                // @ts-ignore
                const token = await authService.sign(tokenPayload, secret, { expiresIn: '10h' });
                await authService.validateAccessToken(token);
                expect.fail('this token has an invalid format');
            } catch (error) {
                expect(error.message).to.include('Invalid decoded jwt payload');
            }
        });
    });

    describe('user credentials validation', async () => {
        it('should return true for found user and a valid given password', async () => {
            const password = '123456';
            const user = {
                id: 1,
                name: 'Foo',
                surname: 'Bar',
                email: 'foobar@email.com',
                password: await genSalt(password)
            };
            const userRepository = {
                findByEmail: sinon.stub().resolves(user)
            };
            // @ts-ignore
            const authService = new BaseAuthService(secret, userRepository, cache, logger);

            const validation = await authService.validateCredentials('foobar@email.com', password);

            expect(validation).to.be.true;
        });

        it('should return false for found user and a invalid given password', async () => {
            const password = '123456';
            const user = {
                id: 1,
                name: 'Foo',
                surname: 'Bar',
                email: 'foobar@email.com',
                password: await genSalt(password)
            };
            const userRepository = {
                findByEmail: sinon.stub().resolves(user)
            };
            // @ts-ignore
            const authService = new BaseAuthService(secret, userRepository, cache, logger);

            const validation = await authService.validateCredentials('foobar@email.com', 'abcdefg');

            expect(validation).to.be.false;
        });

        it('should return false for not found user', async () => {
            const userRepository = {
                findByEmail: sinon.stub().resolves(null)
            };
            // @ts-ignore
            const authService = new BaseAuthService(secret, userRepository, cache, logger);

            const validation = await authService.validateCredentials('foobar@email.com', 'abcdefg');

            expect(validation).to.be.false;
        });
    });
});