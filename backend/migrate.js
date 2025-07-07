const db = require('./config/database');

console.log('Duke ekzekutuar migrimin e databazës...');

// Add new columns to requests table if they don't exist
const migrations = [
  'ALTER TABLE requests ADD COLUMN postalCode TEXT',
  'ALTER TABLE requests ADD COLUMN budgetType TEXT DEFAULT "fixed"',
  'ALTER TABLE requests ADD COLUMN urgency TEXT DEFAULT "normal"',
  'ALTER TABLE requests ADD COLUMN propertyType TEXT',
  'ALTER TABLE requests ADD COLUMN propertySize TEXT',
  'ALTER TABLE requests ADD COLUMN contactPreference TEXT DEFAULT "phone"',
  'ALTER TABLE requests ADD COLUMN additionalRequirements TEXT',
  'ALTER TABLE requests ADD COLUMN photos TEXT',
  'ALTER TABLE requests ADD COLUMN views INTEGER DEFAULT 0',
  'ALTER TABLE requests ADD COLUMN responses INTEGER DEFAULT 0',
  'ALTER TABLE requests ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP'
];

migrations.forEach((migration, index) => {
  db.run(migration, (err) => {
    if (err) {
      // Column might already exist, which is fine
      console.log(`Migrimi ${index + 1}: ${err.message.includes('duplicate column') ? 'Kolona ekziston tashmë' : 'Gabim'}`);
    } else {
      console.log(`Migrimi ${index + 1}: U ekzekutua me sukses`);
    }
  });
});

console.log('Migrimi u përfundua!'); 