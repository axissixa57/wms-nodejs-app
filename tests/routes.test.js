import request from 'supertest';
import should from 'should';

// This agent refers to PORT where program is runninng.
const server = request.agent('http://localhost:3000');

// UNIT test begin
describe('SAMPLE unit test', () => {
    it('should return login page', (done) => {
        server
            .get('/')
            .expect('Content-type', /html/)
            .expect(200)
            .end((err, res) => {
                // HTTP status should be 200
                res.status.should.equal(200);
                done();
            });
    });
});
