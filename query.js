/**
 * Created by Iren on 09.04.2017.
 */

var mysql = require('mysql');


var Query = function () {
  this.connection = mysql.createConnection({
    host: 'localhost',
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
  this.connection.query("SELECT * FROM `matching`.`group_list`", function (err, rows) {
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

Query.prototype.insertPreferences = function (student, tutors) {
  
  this.connection.query("DELETE FROM `matching`.`stud_pref` WHERE `stud_id`=" + student, function (err) {
    if (err) throw err;
  });

  // this.connection.query("TRUNCATE TABLE `matching`.`stud_pref`", function (err) {
  //   if (err) throw err;
  // });
  
  for (var i = 0; i < tutors.length; i++) {
    var pref = {
      stud_id: 0,
      tutor_id: 0,
      position: 0
    };

    pref.stud_id = student;
    pref.tutor_id = tutors[i].ID;
    pref.position = i + 1;
    
    
    this.connection.query("INSERT INTO `matching`.`stud_pref` SET ?", pref, function (err) {
      if (err) throw err;
    })

  }
};

Query.prototype.insertQuotas = function (tutors) {

  this.connection.query("TRUNCATE TABLE `matching`.`tutor_groups`", function (err) {
    if (err) throw err;
  });
 

  for (var i = 0; i < tutors.length; i++) {
    this.connection.query("INSERT INTO `matching`.`tutor_groups` SET ?", tutors, function (err) {
      if (err) throw err;
    })
  }
};

Query.prototype.getStudPrefs = function (callback) {
  var dbStudPrefs;
  // console.log(stud_id);
  this.connection.query("SELECT * FROM `matching`.`stud_pref`", function (err, rows) {
    if (err) throw err;
    // console.log(rows);
    dbStudPrefs = rows;
    callback(rows);
  });
};

module.exports = Query;