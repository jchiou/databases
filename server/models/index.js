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
      db.query('SELECT id FROM users', [username], function(error, results) {
        if (error) {
          throw error;
        } else {
          console.log(results);
          queryRoomID(results[0].id);
        }
      });

      var queryRoomID = function(userId) {
        db.query('SELECT id FROM rooms', [roomname], function(error, results) {
          if (error) {
            throw error;
          } else {
            if (results.length === 0) {
              db.query('INSERT INTO rooms SET ?', roomname, function(error, results) {
                postMessage(userId, results.insertId);
              });
            } else {
              console.log(results);
              postMessage(userId, results[0].id);
            }
          }
        });
      };

      var postMessage = function(userId, roomId) {
        db.query('INSERT INTO messages SET ?', {id_users: userId, id_rooms: roomId, text: message}, function(error, results) {
          if (error) {
            throw error;
          }
          callback(results);
          res.send('success');
        });
      };
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
