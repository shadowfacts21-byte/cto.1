const { execSync } = require('child_process');

const query = (sql) => {
  try {
    // Escape single quotes for the shell command
    const escapedSql = sql.replace(/'/g, "'\\''");
    const result = execSync(`team-db '${escapedSql}'`, { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (error) {
    console.error('Database Error:', error.message);
    throw error;
  }
};

module.exports = { query };
