/**
 * Created by Iren on 09.04.2017.
 */

var mysql = require('mysql');


var Query = function () {
  this.connection = mysql.createConnection({
    host: '192.168.1.36',
    port: 3307,
    user: 'I',
    password: '1234',
    database: 'matching'
  });

  this.connection.connect();
};

Query.prototype.getStudents = function (callback) {
  var dbStudents;
  this.connection.query("SELECT * FROM `matching`.`students`", function (err, rows, fields) {
    if (err) throw err;
    dbStudents = rows;
    callback(rows);
  });
};

Query.prototype.insertStudents = function (values) {
  for (var i = 0; i < values.length; i++) {
    this.connection.query("INSERT INTO `matching`.`students` SET ?", values[i], function (err) {
      if (err) throw err;
    });
  }
};

Query.prototype.updateStudent = function (value) {
  this.connection.query("UPDATE `matching`.`students` SET ? Where ID = ?", value, function (err, rows, fields) {
    if (err) throw err;
  });
};

Query.prototype.getGroupID = function (id, callback) {
  this.connection.query("SELECT * FROM `matching`.`group_list` WHERE Group_UID = " + id, function (err, rows, fields) {
    if (err) throw err;
    callback(rows);
  });
};

Query.prototype.updateStudentGroupId = function (url, id) {
  var self = this;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (obj) {
      self.getGroupID(obj._links.groups[0].id, function (groups) {
        self.updateStudent([{Group_ID: groups[0].Group_ID}, id])
      });
    });
};

Query.prototype.getTutors = function (callback) {
  var dbStudents;
  this.connection.query("SELECT * FROM `matching`.`tutors`", function (err, rows, fields) {
    if (err) throw err;
    dbStudents = rows;
    callback(rows);
  });
};

Query.prototype.insertTutors = function (values) {
  for (var i = 0; i < values.length; i++) {
    this.connection.query("INSERT INTO `matching`.`tutors` SET ?", values[i], function (err) {
      if (err) throw err;
    });
  }
};

Query.prototype.getGroups = function (callback) {
  var dbStudents;
  this.connection.query("SELECT * FROM `matching`.`group_list`", function (err, rows, fields) {
    if (err) throw err;
    dbStudents = rows;
    callback(rows);
  });
};

Query.prototype.insertGroups = function (values) {
  for (var i = 0; i < values.length; i++) {
    this.connection.query("INSERT INTO `matching`.`group_list` SET ?", values[i], function (err) {
      if (err) throw err;
    })
  }
};

module.exports = Query;