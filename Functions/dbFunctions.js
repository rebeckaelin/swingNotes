const nedb = require("nedb-promise");

const db = new nedb({filename: "Database/users.db", autoload: true});

const addUser = (user) => {
  return db.insert(user);
};

const checkUser = (username) => {
  return db.findOne({username: username});
};

module.exports = {addUser, checkUser};
