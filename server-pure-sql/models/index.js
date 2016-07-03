var db = require('../db');

db.connect();

module.exports = {
  messages: {
    get: function(res) {
      db.query('SELECT * FROM messages', [], function(error, results) {
        if (error) {
          throw error;
        }

        res.send(results);
      });
    }, // a function which produces all the messages

    post: function(res, callback, username, message, roomname) {
      db.query('INSERT INTO users SET username=?', [username], function(error, results) {
        if (error) { console.log(error); }
        db.query('INSERT INTO rooms SET roomname=?', [roomname], function(error, results) {
          if (error) { console.log(error); }
          db.query(`INSERT INTO messages SET 
                      text = ?,
                      id_rooms = (SELECT id FROM rooms WHERE roomname = ?),
                      id_users = (SELECT id FROM users WHERE username = ?)`,
            [message, roomname, username], 
            function(error, results) {
              if (error) { throw error; }
              callback(results);
              res.send('success');
            });
        }); 
      }); 
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function(res) {
      db.query('SELECT * FROM users', [], function(error, results) {
        if (error) {
          throw error;
        }

        res.send(results);
      });
    },
    post: function(res, callback, username) {
      db.query('SELECT id FROM users', [username], function(error, results) {
        if (error) {
          throw error;
        } else {
          if (results.length === 0) {
            db.query('INSERT INTO users SET ?', username, function(error, results) {
              console.log('user inserted');
            });
          }
          callback(results);
          res.send('success');
        }
      });
    }
  }
};