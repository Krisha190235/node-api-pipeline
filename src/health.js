let start = Date.now();
const client = require('prom-client'); // add to package.json
client.collectDefaultMetrics();

exports.check = (req, res) => res.json({
  status: 'ok',
  uptimeSec: Math.round((Date.now()-start)/1000)
});

exports.metrics = async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
};