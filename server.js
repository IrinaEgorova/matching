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
    user.displayName = users[i].displayName;
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

    // console.log(models.students);
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

    models.matching_data = db.define("matching_data", {
      id: Number,
      matching_number: Number,
      iteration: Number,
      data: Object,
      students: Object,
      tutors: Object
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
      var personName = person.displayName;
      var jsonTitle = {
        title: title,
        uid: decoded.sub,
        name: personName
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
    var groupID = person[0].Group_ID;
    req.models.tutors_groups.find({Group_ID: groupID}, function (err, row) {
      var tutorId = [];
      for (var i = 0; i < row.length; i++) {
        tutorId.push(row[i].Tutor_ID);
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
        // console.log(err);
        // console.log(group);
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
  var studUID = req.body.studentUID;
  req.models.students.find({UID: studUID}, function (err, student) {
    query.insertPreferences(student[0].ID, req.body.pref);
  });


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
  res.sendFile('../html/tutor.html');
});

app.get('/student', function (req, res) {
  res.sendFile('../html/student.html');
});

app.get('/head', function (req, res) {
  res.sendFile('../html/head.html');
});

function getStudentById(id, students) {
  for (var j = 0; j < students.length; j++) {
    // console.log(matchingStudents[i]);
    if (id === students[i].ID) {
      return students[i];
      // console.log(matchingStudents[i].preferences);
    }
  }
}
function getStudentsPrefs(students, tutors, groups, prefs) {
  var matchingStudents = [];

  prefs.forEach(function (pref) {
    var tutor = tutors.find(function (tutor) {
      return tutor.ID === pref.tutor_id;
    });
    var student = students.find(function (student) {
      return student.ID === pref.stud_id;
    });

    var group = groups.find(function (group) {
      return group.id === student.Group_ID;
    });

    if (!student) {
      return;
    }
    var matchingStud = matchingStudents.find(function (stud) {
      return stud.name === student.LastName;
    });

    if (!matchingStud) {
      matchingStud = {};
      matchingStudents.push(matchingStud);
    }
    var index = matchingStudents.indexOf(matchingStud);

    if (!matchingStud.preferences) {
      matchingStud.preferences = [];
    }
    // matchingStud.preferences.push(tutor.UID.toString());
    // matchingStud.name = student.UID;
    matchingStud.preferences.push(tutor.UID.toString());
    matchingStud.name = student.UID;
    matchingStud.displayName = student.FirstName + ' ' + student.LastName + ' ' + student.PatronymicName;
    matchingStud.id = student.ID;
    matchingStud.groupID = student.Group_ID;
    matchingStud.groupName = group.name;
    matchingStudents[index] = matchingStud;
  });

  return matchingStudents;
}

function getTutorsPrefs(tutors, groups, quotas) {

  var matchingTutors = [];
  quotas.forEach(function (quota) {
    var tutor = tutors.find(function (tutor) {
      return tutor.ID === quota.Tutor_ID;
    });
    var group = groups.find(function (group) {
      return group.id === quota.Group_ID;
    });
    var matchingTutor = matchingTutors.find(function (tut) {
      return tut.name === tutor.LastName;
    });

    if (!matchingTutor) {
      matchingTutor = {};
      matchingTutors.push(matchingTutor);
    }

    var index = matchingTutors.indexOf(matchingTutor);

    matchingTutor.name = tutor.UID;
    matchingTutor.displayName = tutor.FirstName + ' ' + tutor.LastName + ' ' + tutor.PatronymicName;
    matchingTutor.id = tutor.ID;
    matchingTutor.commonQuota = (matchingTutor.commonQuota == null) ? 0 : matchingTutor.commonQuota + quota.Quota;

    if (!matchingTutor.groupQuotas) {
      matchingTutor.groupQuotas = [];
    }
    var groupQuota = {
      groupID: group.id,
      groupName: group.name,
      groupQuota: quota.Quota
    };
    matchingTutor.groupQuotas.push(groupQuota);

    if (!matchingTutor.studLists) {
      matchingTutor.studLists = [];
    }
    var studList = matchingTutor.studLists.find(function (list) {
      return list.groupID === group.id;
    });
    if (!studList) {
      studList = {
        groupID: group.id,
        groupName: group.name,
        groupList: []
      };
    }
    matchingTutor.studLists.push(studList);

    matchingTutors[index] = matchingTutor;
  });

  return matchingTutors;
}

app.post('/api/startMatching', function (req, res) {
  req.models.matching_data.find({},["id", "Z"], 1 ,function (err, mData) {

    var matchingNumber = mData[0] ? mData[0].matching_number : 0;
    matchingNumber += 1;
    req.models.students.all(function (err, students) {
    req.models.tutors_groups.all(function (err, quotas) {
    req.models.tutors.all(function (err, tutors) {
    req.models.groupsTable.all(function (err, groups) {
    req.models.stud_pref.all(function (err, prefs) {
      var matchingStudents = getStudentsPrefs(students, tutors, groups, prefs);
      var matchingTutors = getTutorsPrefs(tutors, groups, quotas);

      var firstStepTutors = Matching.firstStep(matchingStudents, matchingTutors);

      var result = {
        students: JSON.stringify(matchingStudents),
        tutors: JSON.stringify(matchingTutors),
        firstStep: JSON.stringify(firstStepTutors)
      };

      req.models.matching_data.create({
        data: firstStepTutors,
        students: matchingStudents,
        tutors: matchingTutors,
        matching_number: matchingNumber,
        iteration: 0
      }, function (err) {
        // err - description of the error or null
        // items - array of inserted items
      });

      query.dropStudents();

      res.send(result);
    });
    });
    });
    });
    });
  });
});

app.get('/api/getCurrentIteration', function (req, res) {
  req.models.matching_data.find({},["id", "Z"], 1 ,function (err, mData) {
    res.send(mData);
  });
});