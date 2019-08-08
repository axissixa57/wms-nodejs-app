import request from 'supertest';

// This agent refers to PORT where program is runninng.
const server = request.agent('http://localhost:3000');

// UNIT test begin
describe('SAMPLE unit test', () => {
    it('should return all products', (done) => {
        server
            .get('/api/products')
            .expect('Content-type', /json/)
            .expect(200)
            .end(done);
    });

    it('should return all cosmetic products', (done) => {
        server
            .get('/api/products/cosmetics')
            .expect('Content-type', /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body[0]).toEqual({
                    "_id": 1000001,
                    "category": "Косметика и средства личной гигиены",
                    "cost": 0.85,
                    "name": "Салфетки бумажные \"VETA TOPICANA\"",
                    "unit": "шт",
                    "weight": 100,
                });
            })
            .end(done);
    });
});

