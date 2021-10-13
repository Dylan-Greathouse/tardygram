const app = require('./lib/app.js');
const pool = require('./lib/utils/pool.js');

const PORT = process.env.PORT || 7895;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

process.on('exit', () => {
  console.log('Goodbye!');
  pool.end();
});
