/* eslint-disable */
/**********************************************************
 * Copyright (c) 2017. Enterprise Architecture Group, EACG
 *
 * SPDX-License-Identifier:	MIT
 *********************************************************/
/* eslint-enable */
/* eslint-env mocha */

const assert = require('assert');
const nock = require('nock');
const RestClient = require('../lib/rest-client').RestClient;

const baseUrl = 'http://localhost:3000';

/* eslint-disable no-new */
describe('RestClient', () => {
    describe('Constructor', () => {
        it('should throw Error if no options defined', () => {
            assert.throws(() => {
                new RestClient();
            }, TypeError);
        });
        it('should throw Error if no baseUrl attribute defined', () => {
            assert.throws(() => {
                new RestClient({});
            }, TypeError);
        });
        it('should accept baseUrl attribute', () => {
            assert.doesNotThrow(() => {
                const restClient = new RestClient({ baseUrl });
                assert.notEqual(restClient, undefined);
            });
        });
    });

    describe('transfer method', () => {
        var restClient;

        beforeEach(() => {
            restClient = new RestClient({ baseUrl: 'http://localhost:3000' });
        });

        it('should call callback with response data if no error orccurs', (done) => {
            nock(baseUrl, {
                reqheaders: {
                    'Content-Type': 'application/json'
                }
            }).post('/api/v1/scans').reply(201, 'Test response');

            restClient.transfer({}, (err, data) => {
                assert.equal(err, null);
                assert.equal(data, 'Test response');
                done();
            });
        });

        it('response should be parsed as json object, if \'content-type\': \'application/json\'', (done) => {
            nock(baseUrl, {
                reqheaders: {
                    'Content-Type': 'application/json'
                }
            }).defaultReplyHeaders({
                'Content-Type': 'application/json'
            }).post('/api/v1/scans').reply(201, '{"bli": "blub"}');

            restClient.transfer({}, (err, data) => {
                assert.equal(err, null);
                assert.deepEqual(data, { bli: 'blub' });
                done();
            });
        });
    });
});
