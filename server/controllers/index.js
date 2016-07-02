var models = require('../models');

module.exports = {
  messages: {
    get: function(req, res) {
      models.messages.get(res);
    }, // a function which handles a get request for all messages
    post: function(req, res, callback) {
      models.messages.post(res, callback, req.body.username, req.body.message, req.body.roomname);
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function(req, res) {
      models.users.get(res);
    },
    post: function(req, res, callback) {
      models.users.post(res, callback, req.body.username);
    }
  }
};

