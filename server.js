/**
 * Created by Iren on 28.02.2017.
 */

var express = require('express');
const proxy = require('express-http-proxy');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var jwt = require('jsonwebtoken');
var Matching = require('./matching.js');
var Query = require('./query.js');
var orm = require("orm");
const Sequelize = require('sequelize');
var query = new Query();
const sequelize = new Sequelize('mysql://I:1234@localhost:3307/matching', {
  define: {
    timestamps: false // true by default
  }
});


query.getGroups(function (groups) {
  var url = encodeURI('http://82.179.88.27:8280/core/v1/groups');

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (obj) {
      var insertArray = compareGroups(obj._embedded.groups, groups);
      query.insertGroups(insertArray);

      query.getGroups(function (stud) {

      })
    });
});

query.getStudents(function (students) {
  var url = encodeURI('http://82.179.88.27:8280/core/v1/people?title=Студент');

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (obj) {
      var insertArray = compareUsers(obj._embedded.people, students);

      query.insertStudents(insertArray);

      query.getStudents(function (stud) {

      })
    });

  for (var i = 0; i < students.length; i++) {
    if (students[i].Group_ID === null) {
      var userUrl = encodeURI('http://82.179.88.27:8280/core/v1/people/' + students[i].UID);
      query.updateStudentGroupId(userUrl, students[i].ID);
    }
  }
});

query.getTutors(function (tutors) {
  var url = encodeURI('http://82.179.88.27:8280/core/v1/people?title=Преподаватель');

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (obj) {
      var insertArray = compareUsers(obj._embedded.people, tutors);

      query.insertTutors(insertArray);

      query.getTutors(function (stud) {

      })
    });
});


function compareUsers(users, dbUsers) {
  var usersArray = [];

  for (var i = 0; i < users.length; i++) {
    var exist = false;

    for (var j = 0; j < dbUsers.length; j++) {
      if (users[i].uid === dbUsers[j].UID) {
        exist = true;
        break;
      }
    }

    if (exist) {
      continue;
    }

    var user = {};

    user.FirstName = users[i].givenName;
    user.LastName = (Array.isArray(users[i].sn)) ? users[i].sn[0] : users[i].sn;
    user.PatronymicName = users[i].initials;
    user.UID = users[i].uid;
    usersArray.push(user);
  }

  return usersArray;
}

function compareGroups(groups, dbGroups) {
  var groupsArray = [];

  for (var i = 0; i < groups.length; i++) {
    var exist = false;

    for (var j = 0; j < dbGroups.length; j++) {
      if (groups[i].id == dbGroups[j].uid) {
        exist = true;
        break;
      }
    }

    if (exist) {
      continue;
    }

    var user = {};
    user.name = groups[i].name;
    user.uid = groups[i].id;
    groupsArray.push(user);
  }

  return groupsArray;
}


// connection.end();
var app = express();


var port = 8080;

// var students = [
//   {
//     name: "Morozov",
//     preferences: [
//       "Lagerev",
//       "Korostelev",
//       "Podvesovsky",
//       "Trubakov",
//       "Belov"
//     ],
//     group: "PRI"
//   },
//   {
//     name: "Sharova",
//     preferences: [
//       "Belov",
//       "Podvesovsky",
//       "Korostelev",
//       "Lagerev",
//       "Trubakov"
//     ],
//     group: "PRI"
//   },
//   {
//     name: "Ivanov",
//     preferences: [
//       "Trubakov",
//       "Korostelev",
//       "Belov",
//       "Podvesovsky",
//       "Lagerev"
//     ],
//     group: "PRI"
//   },
//   {
//     name: "Baranov",
//     preferences: [
//       "Trubakov",
//       "Korostelev",
//       "Belov",
//       "Podvesovsky",
//       "Lagerev"
//     ],
//     group: "PRI"
//   },
//   {
//     name: "Gusarov",
//     preferences: [
//       "Trubakov",
//       "Korostelev",
//       "Belov",
//       "Podvesovsky",
//       "Lagerev"
//     ],
//     group: "PO"
//   },
//   {
//     name: "Petruhin",
//     preferences: [
//       "Trubakov",
//       "Korostelev",
//       "Belov",
//       "Podvesovsky",
//       "Lagerev"
//     ],
//     group: "PO"
//   },
//   {
//     name: "Poliakova",
//     preferences: [
//       "Trubakov",
//       "Korostelev",
//       "Belov",
//       "Podvesovsky",
//       "Lagerev"
//     ],
//     group: "PO"
//   },
//   {
//     name: "Levkina",
//     preferences: [
//       "Trubakov",
//       "Korostelev",
//       "Belov",
//       "Podvesovsky",
//       "Lagerev"
//     ],
//     group: "PO"
//   }
// ];
//
// var tutors = [
//   {
//     name: "Trubakov",
//     commonQuota: 2,
//     groupQuotas: [
//       {
//         groupName: "PRI",
//         groupQuota: 1
//       },
//       {
//         groupName: "PO",
//         groupQuota: 1
//       }
//     ],
//     studLists: [
//       {
//         groupName: "PRI",
//         groupList: []
//       },
//       {
//         groupName: "PO",
//         groupList: []
//       }
//     ]
//   },
//   {
//     name: "Korostelev",
//     commonQuota: 2,
//     groupQuotas: [
//       {
//         groupName: "PRI",
//         groupQuota: 1
//       },
//       {
//         groupName: "PO",
//         groupQuota: 1
//       }
//     ],
//     studLists: [
//       {
//         groupName: "PRI",
//         groupList: []
//       },
//       {
//         groupName: "PO",
//         groupList: []
//       }
//     ]
//   },
//   {
//     name: "Belov",
//     commonQuota: 2,
//     groupQuotas: [
//       {
//         groupName: "PRI",
//         groupQuota: 1
//       },
//       {
//         groupName: "PO",
//         groupQuota: 1
//       }
//     ],
//     studLists: [
//       {
//         groupName: "PRI",
//         groupList: []
//       },
//       {
//         groupName: "PO",
//         groupList: []
//       }
//     ]
//   },
//   {
//     name: "Podvesovsky",
//     commonQuota: 2,
//     groupQuotas: [
//       {
//         groupName: "PRI",
//         groupQuota: 1
//       },
//       {
//         groupName: "PO",
//         groupQuota: 1
//       }
//     ],
//     studLists: [
//       {
//         groupName: "PRI",
//         groupList: []
//       },
//       {
//         groupName: "PO",
//         groupList: []
//       }
//     ]
//   },
//   {
//     name: "Lagerev",
//     commonQuota: 2,
//     groupQuotas: [
//       {
//         groupName: "PRI",
//         groupQuota: 1
//       },
//       {
//         groupName: "PO",
//         groupQuota: 1
//       }
//     ],
//     studLists: [
//       {
//         groupName: "PRI",
//         groupList: []
//       },
//       {
//         groupName: "PO",
//         groupList: []
//       }
//     ]
//   }
// ];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/proxy', proxy('82.179.88.27:8280'));
app.use(orm.express("mysql://I:1234@localhost:3307/matching", {
  define: function (db, models, next) {
    models.students = db.define("students", {
      ID: Number,
      FirstName: String,
      LastName: String,
      PatronymicName: String,
      Group_ID: Number, // FLOAT
      UID: String
    }, {
      methods: {
        fullName: function () {
          return this.FirstName + ' ' + this.LastName;
        }
      }
    });

    models.tutors = db.define("tutors", {
      ID: Number,
      FirstName: String,
      LastName: String,
      PatronymicName: String,
      CommonQuota: Number,
      UID: String
    }, {
      methods: {
        fullName: function () {
          return this.FirstName + ' ' + this.LastName;
        }
      }
    });

    models.groupsTable = db.define("groups", {
      id: Number,
      name: String,
      uid: String
    });

    models.tutors_groups = db.define("tutors_groups", {
      ID: Number,
      Tutor_ID: Number,
      Group_ID: Number,
      Quota: Number
    });

    models.stud_pref = db.define("stud_pref", {
      id: Number,
      stud_id: Number,
      tutor_id: Number,
      position: Number
    });

    next();
  }
}));

app.listen(port);
console.log('server started');
app.get('/', function (req, res) {
  res.json({message: 'hello'})
});

//console.log(Matching);
// tutors = Matching.firstStep(students, tutors);
// Matching.matchingStep(tutors);


app.post('/api/getTokenData', function (req, res) {
  var jwtToken = req.body.token;
  var decoded = jwt.decode(jwtToken);
  var uid = decoded.sub;
  console.log(uid);

  var url = 'http://82.179.88.27:8280/core/v1/people/' + uid;
  var encodeUrl = encodeURI(url);

  fetch(encodeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (person) {
      var title = person.title;
      var jsonTitle = {
        title: title,
        uid: decoded.sub
      };
      res.send(JSON.stringify(jsonTitle));
    });
});

app.get('/api/tutors', function (req, res) {
  query.getTutors(function (tutors) {
    res.send(tutors);
  });
});

app.post('/api/getTutors', function (req, res) {
  req.models.students.find({UID: req.body.studentUID}, function (err, person) {
    var groupID = person.Group_ID;
    req.models.tutors_groups.find({Group_ID: groupID}, function (err, row) {
      var tutorId = [];
      for (var i = 0; i < row.length; i++) {
        tutorId.push(row[i].ID);
      }
      req.models.tutors.find({ID: tutorId}, function (err, row) {
        res.send(row);
      });
      // for (var i = 0; i < tutors.length; i++) {
      //   req.models.tutors.find({ID: tutors[i].Tutor_ID}, function (err, tutor) {
      //     console.log(tutor.LastName);
      //   });
      // }

      // console.log(row);

    });
  })
});

app.get('/api/getMatchingStudents', function (req, res) {
  req.models.tutors_groups.all(function (err, quotas) {
    var groups = [];
    for (var i = 0; i < quotas.length; i++) {
      var id = quotas[i].Group_ID;
      if (groups.indexOf(id) === -1) {
        groups.push(id);
      }
    }
    req.models.students.find({Group_ID: groups}, function (err, row) {
      req.models.groupsTable.find({id: groups}, function (err, group) {
        console.log(err);
        console.log(group);
        res.send({
          groups: group,
          students: row
        });
      });
    })
  })
});

app.get('/api/getStudentsWithPref', function (req, res) {
  req.models.stud_pref.all(function (err, pref) {
    var students = [];
    for (var i = 0; i < pref.length; i++) {
      var id = pref[i].stud_id;
      if (students.indexOf(id) === -1) {
        students.push(id);
      }
    }

    req.models.students.find({ID: students}, function (err, students) {
      res.send(students);
    });
  })
});

app.post('/api/preferences', function (req, res) {
  query.insertPreferences(req.body.student, req.body.pref);

  res.send(req.body.pref);
});

app.post('/api/quotas', function (req, res) {
  query.insertQuotas(req.body.tutors);

  res.send(req.body.pref);
});

app.get('/api/groups', function (req, res) {
  query.getGroups(function (groups) {
    res.send(groups);
  });
});

app.get('/tutor', function (req, res) {
  res.sendfile('./public/tutor.html');
});

app.get('/student', function (req, res) {
  res.sendfile('./public/student.html');
});

app.get('/head', function (req, res) {
  res.sendfile('./public/head.html');
});

var dbStudents;
var dbTutors;
var dbStudPrefs;


function getStudentById(id, students) {
  for (var j = 0; j < students.length; j++) {
    // console.log(matchingStudents[i]);
    if (id === students[i].ID) {
      return students[i];
      // console.log(matchingStudents[i].preferences);
    }
  }
}

app.post('/api/matching', function (req, res) {
  var groups = req.body.groups;

  req.models.students.all(function (err, students) {
    req.models.tutors.all(function (err, tutors) {
      req.models.stud_pref.all(function (err, prefs) {
        console.log(students, tutors, prefs);
      });
    });
  });

  // query.getStudents(function (students) {
  //   dbStudents = students;
  //
  //   query.getTutors(function (tutors) {
  //     dbTutors = tutors;
  //
  //     query.getStudPrefs(function (studPrefs) {
  //
  //       dbStudPrefs = studPrefs;
  //
  //       console.log(dbStudPrefs, dbStudents, dbTutors);
  //
  //       var matchingStudents = [];
  //       for (var i = 0; i < groups.length; i++) {
  //
  //       }
  //
  //       for (var i = 0; i < dbStudents.length; i++) {
  //         matchingStudents[i] = {};
  //         matchingStudents[i].preferences = [];
  //         matchingStudents[i].preferences.push(dbStudPrefs[j]);
  //
  //         // console.log(matchingStudents[i].preferences);
  //         // matchingStudents[i].preferences = getValues(dbStudPrefs, dbStudents.ID);
  //
  //
  //         matchingStudents[i].name = dbStudents.LastName;
  //         matchingStudents[i].group = dbStudents.Group_ID;
  //       }
  //       // console.log(dbStudents[i]);
  //
  //     });
  //
  //
  //     // var firstTutors = Matching.firstStep(dbStudents, dbTutors);
  //     // Matching.matchingStep(firstTutors);
  //
  //   });
  // });
});