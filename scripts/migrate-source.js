const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'trendpoll.db');
const db = new Database(dbPath);

try {
    // Add source column to polls table
    db.prepare("ALTER TABLE polls ADD COLUMN source TEXT DEFAULT 'user'").run();
    console.log('Added source column to polls table.');
} catch (error) {
    if (error.message.includes('duplicate column name')) {
        console.log('Column source already exists.');
    } else {
        console.error('Failed to migrate:', error);
    }
}
