'use strict';

const request = require('supertest');
const ROOTPATH = __dirname + '/./../';
const app = require(ROOTPATH + 'server.js');
const path = require('path');
let db = require('../core/dbcore/index.js')({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    log: false
}, path.resolve(__dirname, '../'), 'apps/v1');

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;

chai.should();
chai.use(chaiHttp);


let UsrData = '{"user_id": "1", "company_id":"1",  "timezone":"asia/jakarta"}';
let ttoken = 'hR0bMUMn8J';
let appid = process.env.APPID;



describe('BANK GET', () => {
    //GET BANK BY ID
    it('Get detail BANK ', function (done) {
        db.model('bank').findOne({
            order: [['bank_id', 'DESC']]
        }).then((data) => {
            let id = data.bank_id;
            request(app)
            .get('/bank/' + id)
            .set('mony-request-key', ttoken)
            .set('mony-user-data', UsrData)
            .set('mony-app-id', appid)
            .end(function (err, res) {
                if (err) {
                    throw err;
                } else {
                    res.should.have.status(200);
                    res.body.should.have.property('payload');
                    expect(res.body.payload).to.be.instanceOf(Object);
                    res.body.payload.should.have.property('bank_id');
                    done();
                }
            })
        }).catch(done);
    });
    //GET ALL DUEDATE
    it('Get All BANK', function (done) {
        request(app)
            .get('/bank/')
            .set('mony-request-key', ttoken)
            .set('mony-user-data', UsrData)
            .set('mony-app-id', appid)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.status(200);
                res.body.should.have.property('payload')
                done();
            });
    });

});