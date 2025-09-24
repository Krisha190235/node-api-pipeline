const request = require('supertest');
const app = require('../src/app');

test('CRUD /api/items', async () => {
  const create = await request(app).post('/api/items').send({ name: 'book', price: 10 });
  expect(create.status).toBe(201);
  const id = create.body.id;

  const list = await request(app).get('/api/items');
  expect(list.status).toBe(200);
  expect(Array.isArray(list.body)).toBe(true);

  const get = await request(app).get(`/api/items/${id}`);
  expect(get.status).toBe(200);
  expect(get.body.name).toBe('book');

  const upd = await request(app).put(`/api/items/${id}`).send({ price: 12 });
  expect(upd.status).toBe(200);
  expect(upd.body.price).toBe(12);

  const del = await request(app).delete(`/api/items/${id}`);
  expect(del.status).toBe(204);
});