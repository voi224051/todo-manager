var sqlite3 = require('sqlite3');
var mkdirp = require('mkdirp');
var crypto = require('crypto');

mkdirp.sync('var/db');

var db = new sqlite3.Database('var/db/todos.db');

db.serialize(function() {
  // create the database schema for the todos app
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )");
  
  db.run("CREATE TABLE IF NOT EXISTS federated_credentials ( \
    user_id INTEGER NOT NULL, \
    provider TEXT NOT NULL, \
    subject TEXT NOT NULL, \
    PRIMARY KEY (provider, subject) \
  )");
  
  db.run("CREATE TABLE IF NOT EXISTS todos ( \
    owner_id INTEGER NOT NULL, \
    title TEXT NOT NULL, \
    completed INTEGER \
  )");
  
  // create an initial user (username: alice, password: letmein)
  var salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
    'alice',
    crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
    salt
  ]);
});

module.exports = db;
