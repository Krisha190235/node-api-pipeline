const svc = require('../src/services/items.service');

test('create + get', () => {
  const created = svc.create({ name: 'pen', price: 2 });
  expect(created.id).toBeDefined();
  const fetched = svc.get(created.id);
  expect(fetched.name).toBe('pen');
});