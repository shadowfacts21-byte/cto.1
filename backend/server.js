require('dotenv').config();
const app = require('./src/app');
const { initDb } = require('./src/db');

const PORT = process.env.PORT || 3000;

initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});