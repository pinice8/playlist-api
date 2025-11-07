import { initializeDatabase } from './schema.js';

console.log('Initializing database...');
initializeDatabase();
console.log('Database initialization complete!');
process.exit(0);
