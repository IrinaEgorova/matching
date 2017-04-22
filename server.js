/**
 * Created by Iren on 28.02.2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var Matching = require('./matching.js');
var Query = require('./query.js');
var query = new Query();

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
      if (groups[i].id == dbGroups[j].Group_UID) {
        exist = true;
        break;
      }
    }

    if (exist) {
      continue;
    }

    var user = {};
    user.GroupName = groups[i].name;
    user.Group_UID = groups[i].id;
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

app.listen(port);
console.log('server started');

//console.log(Matching);
// tutors = Matching.firstStep(students, tutors);
// Matching.matchingStep(tutors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/api/tutors', function (req, res) {
  query.getTutors(function (tutors) {
    res.send(tutors);
  });
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
app.post('/api/matching', function (req, res) {

  query.getStudents(function (students) {
    dbStudents = students;

    query.getTutors(function (tutors) {
      dbTutors = tutors;
      
      var matchingStudents = [];
      for (var i = 0; i < dbStudents.length; i++) {
        matchingStudents[i] = {};
        console.log(dbStudents[i]);
        query.getStudPrefs(dbStudents[i].ID, function (studPrefs) {
          dbStudPrefs = studPrefs;
          console.log(dbStudPrefs);
        });

        matchingStudents[i].name = dbStudents.LastName;
        matchingStudents[i].preferences = dbStudPrefs;
        matchingStudents[i].group = dbStudents.Group_ID;
      }
    
      // var firstTutors = Matching.firstStep(dbStudents, dbTutors);
      // Matching.matchingStep(firstTutors);

    });
  });
});