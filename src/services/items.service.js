// in-memory store for demo; swap with DB later if you like
let db = new Map(); let idSeq = 1;

exports.list = () => [...db.values()];
exports.get = (id) => db.get(Number(id));
exports.create = (data) => {
  const item = { id: idSeq++, name: data.name ?? 'unnamed', price: data.price ?? 0 };
  db.set(item.id, item); return item;
};
exports.update = (id, data) => {
  id = Number(id);
  if (!db.has(id)) return null;
  const cur = db.get(id);
  const updated = { ...cur, ...data, id };
  db.set(id, updated); return updated;
};
exports.remove = (id) => db.delete(Number(id));