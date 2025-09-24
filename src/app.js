const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const health = require('./health');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);
app.get('/health', health.check);
app.get('/metrics', health.metrics); // Prometheus-format if using prom-client

module.exports = app;