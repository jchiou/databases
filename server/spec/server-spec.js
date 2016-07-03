/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '0987',
      database: 'chat'
    });
    dbConnection.connect();

    var tablename = "messages"; // TODO: fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query('truncate ' + tablename, done);
 
  });

  afterEach(function() {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function(done) {
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'Valjean' }
    }, function () {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          message: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function () {
        // Now if we look in the database, we should find the
        // posted message there.

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        var queryString = 'SELECT * FROM messages';
        var queryArgs = [];

        dbConnection.query(queryString, queryArgs, function(err, results) {
          // Should have one result:
          expect(results.length).to.equal(1);
          // TODO: If you don't have a column named text, change this test.
          expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');

          done();
        });
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    dbConnection.query("INSERT INTO users SET username='fred'", function(err, results) {
      dbConnection.query("INSERT INTO rooms SET roomname='main'", function(err, results) {
        dbConnection.query(`INSERT INTO messages SET
                              text = ?,
                              RoomId = (SELECT id FROM rooms WHERE roomname = ?),
                              UserId = (SELECT id FROM users WHERE username = ?)`,
          ['Men like you can never change!', 'main', 'fred'],
          function(err, results) {
            if (err) {
              throw err;
            }
            // Let's insert a message into the db
            var queryString = 'SELECT * FROM messages';
            var queryArgs = [];
            var tablename = "messages"; // TODO: fill this out
            // TODO - The exact query string and query args to use
            // here depend on the schema you design, so I'll leave
            // them up to you. */

            dbConnection.query(queryString, queryArgs, function(err) {
              if (err) { throw err; }

              // Now query the Node chat server and see if it returns
              // the message we just inserted:
              request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
                var messageLog = JSON.parse(body);
                expect(messageLog[0].text).to.equal('Men like you can never change!');

                var roomQuery = 'SELECT RoomId FROM messages WHERE text = ?';
                var roomArgs = ['Men like you can never change!'];
                dbConnection.query(roomQuery, roomArgs, function(err, results) {
                  if (err) { throw err; }
                  dbConnection.query('SELECT roomname FROM rooms WHERE id = ?', results[0].RoomId, function(err, results) {
                    if (err) { throw err; }
                    expect(results[0].roomname).to.equal('main');
                    done();
                  });
                });
              });
            });
          });
      });
    });
  });
});
