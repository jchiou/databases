var Sequelize = require('sequelize');
var db = new Sequelize('chat', 'root', '0987');

var User = db.define('User', {
  username: Sequelize.STRING
}, {
  timestamps: false
});

var Room = db.define('Room', {
  roomname: Sequelize.STRING
}, {
  timestamps: false
});

var Message = db.define('Message', {
  text: Sequelize.STRING,
  UserId: {
    type: Sequelize.INTEGER,
    references: 'User',
    referenceKey: 'id'
  }
}, {
  timestamps: false
});

User.hasMany(Message, {as: 'Usernames'});
Message.belongsTo(User);
Room.hasMany(Message, {as: 'Roomnames'});
Message.belongsTo(Room);

db.sync({force: true})
  .then(function(error) {
    console.log('It worked!');
  }, function(error) {
    console.log('An error occurred when creating the table:', error);
  });

module.exports = {
  messages: {
    get: function(res) {
      Message.findAll()
        .then(function(data) {
          console.log('data values', data[0].dataValues);
          res.send(JSON.stringify(data));
        });
    }, // a function which produces all the messages

    post: function(res, callback, username, message, roomname) {
      Message.create({
        username: username,
        text: message,
        roomname: roomname
      })
      .then(function(results) {
        console.log('message created', results.text, results.UserId);
        callback(results);
        res.send('success');
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function(res) {
      User.findAll()
        .then(function(data) {
          res.send(JSON.stringify(data));
        });
    },
    post: function(res, callback, username) {
      User.findOrCreate({where: {
        username: username
      }})
      .then(function(results) {
        callback(results);
        res.send('success');
      });
    }
  }
};
