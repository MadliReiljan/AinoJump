const { defineConfig } = require('cypress');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql2/promise');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 1440,
  e2e: {
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      config.env.CYPRESS_LOGIN_URL = process.env.CYPRESS_LOGIN_URL;
      config.env.CYPRESS_USERNAME = process.env.CYPRESS_USERNAME;
      config.env.CYPRESS_PASSWORD = process.env.CYPRESS_PASSWORD;

      on('task', {
        async queryDb(query) {
          const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          });

          const [results] = await connection.execute(query);
          await connection.end();
          return results;
        },
      });

      return config;
    },
  },
});
