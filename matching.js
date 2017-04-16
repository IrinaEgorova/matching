/**
 * Created by Iren on 04.03.2017.
 */

var students = [
  {
    name: "Morozov",
    preferences: [
      "Lagerev",
      "Korostelev",
      "Podvesovsky",
      "Trubakov",
      "Belov"
    ],
    group: "PRI"
  },
  {
    name: "Sharova",
    preferences: [
      "Belov",
      "Podvesovsky",
      "Korostelev",
      "Lagerev",
      "Trubakov"
    ],
    group: "PRI"
  },
  {
    name: "Ivanov",
    preferences: [
      "Trubakov",
      "Korostelev",
      "Belov",
      "Podvesovsky",
      "Lagerev"
    ],
    group: "PRI"
  },
  {
    name: "Baranov",
    preferences: [
      "Trubakov",
      "Korostelev",
      "Belov",
      "Podvesovsky",
      "Lagerev"
    ],
    group: "PRI"
  },
  {
    name: "Gusarov",
    preferences: [
      "Trubakov",
      "Korostelev",
      "Belov",
      "Podvesovsky",
      "Lagerev"
    ],
    group: "PO"
  },
  {
    name: "Petruhin",
    preferences: [
      "Trubakov",
      "Korostelev",
      "Belov",
      "Podvesovsky",
      "Lagerev"
    ],
    group: "PO"
  },
  {
    name: "Poliakova",
    preferences: [
      "Trubakov",
      "Korostelev",
      "Belov",
      "Podvesovsky",
      "Lagerev"
    ],
    group: "PO"
  },
  {
    name: "Levkina",
    preferences: [
      "Trubakov",
      "Korostelev",
      "Belov",
      "Podvesovsky",
      "Lagerev"
    ],
    group: "PO"
  }
];

var tutors = [
  {
    name: "Trubakov",
    commonQuota: 2,
    groupQuotas: [
      {
        groupName: "PRI",
        groupQuota: 1
      },
      {
        groupName: "PO",
        groupQuota: 1
      }
    ],
    studLists: [
      {
        groupName: "PRI",
        groupList: []
      },
      {
        groupName: "PO",
        groupList: []
      }
    ]
  },
  {
    name: "Korostelev",
    commonQuota: 2,
    groupQuotas: [
      {
        groupName: "PRI",
        groupQuota: 1
      },
      {
        groupName: "PO",
        groupQuota: 1
      }
    ],
    studLists: [
      {
        groupName: "PRI",
        groupList: []
      },
      {
        groupName: "PO",
        groupList: []
      }
    ]
  },
  {
    name: "Belov",
    commonQuota: 2,
    groupQuotas: [
      {
        groupName: "PRI",
        groupQuota: 1
      },
      {
        groupName: "PO",
        groupQuota: 1
      }
    ],
    studLists: [
      {
        groupName: "PRI",
        groupList: []
      },
      {
        groupName: "PO",
        groupList: []
      }
    ]
  },
  {
    name: "Podvesovsky",
    commonQuota: 2,
    groupQuotas: [
      {
        groupName: "PRI",
        groupQuota: 1
      },
      {
        groupName: "PO",
        groupQuota: 1
      }
    ],
    studLists: [
      {
        groupName: "PRI",
        groupList: []
      },
      {
        groupName: "PO",
        groupList: []
      }
    ]
  },
  {
    name: "Lagerev",
    commonQuota: 2,
    groupQuotas: [
      {
        groupName: "PRI",
        groupQuota: 1
      },
      {
        groupName: "PO",
        groupQuota: 1
      }
    ],
    studLists: [
      {
        groupName: "PRI",
        groupList: []
      },
      {
        groupName: "PO",
        groupList: []
      }
    ]
  }
];

var numOfSteps = 4;

function copyTutors(tutors) {
  var tutorsStep = [];
  for (var i = 0; i < tutors.length; i++) {
    tutorsStep[i] = {};
    tutorsStep[i].name = tutors[i].name;
    tutorsStep[i].commonQuota = tutors[i].commonQuota;
    tutorsStep[i].groupQuotas = [];
    for (var j = 0; j < tutors[i].groupQuotas.length; j++) {
      tutorsStep[i].groupQuotas[j] = {};
      tutorsStep[i].groupQuotas[j].groupName = tutors[i].groupQuotas[j].groupName;
      tutorsStep[i].groupQuotas[j].groupQuota = tutors[i].groupQuotas[j].groupQuota;
    }
    tutorsStep[i].studLists = [];
  }

  return tutorsStep;
}

function moveToNextTutor(tutors, tutorsStep, j) {
  for (var i = tutors[j].commonQuota; i < tutors[j].studList.length; i++) {
    var stud = tutors[j].studList[i];
    var nextTutorIndex = stud.preferences.indexOf(stud.curTutor.name) + 1;
    var nextTutor = stud.preferences[nextTutorIndex];

    if (nextTutor) {
      for (var k = 0; k < tutors.length; k++) {
        if (tutors[k].name === nextTutor) {
          tutorsStep[k].studList.push(tutors[j].studList[i]);
          stud.curTutor = tutors[k];
        }
      }
      tutors[j].studList.splice(i, 1);
      i--;
    }

  }
}

function copyStudents(tutor, tutorStep, length) {
  for (var j = 0; j < tutorStep.studLists.length; j++) {
    for (var i = 0; i < length; i++) {
      tutorStep.studLists[j].push(tutor.studLists[j][i]);
    }
  }
}


var Matching = function () {

};

Matching.matchingStep = function (tutors) {
  var tutorsStep = copyTutors(tutors);

  for (var i = 0; i < tutors.length; i++) {
    var t = tutors[i];
    for (var j = 0; j < t.groupQuotas.length; j++) {
      if (t.studLists[j].length > t.groupQuotas[j]) {
        copyStudents(t, tutorsStep[i], t.groupQuotas[j]);
        moveToNextTutor(tutors, tutorsStep, i);
      } else {
        copyStudents(t, tutorsStep[i], t.studLists[j].length);
      }
    }
  }
  console.log(tutorsStep);
  return tutorsStep;
};

Matching.firstStep = function (students, tutors) {
  for (var i = 0; i < students.length; i++) {
    var curStudentPref = students[i].preferences[0];
    for (var j = 0; j < tutors.length; j++) {
      var t = tutors[j];
      if (t.name === curStudentPref) {
        for (var k = 0; k < t.studLists.length; k++) {
          if (t.studLists[k].groupName === students[i].group) {
            t.studLists[k].groupList.push(students[i]);
            students[i].curTutor = t;
          }
        }
      }
    }
  }

  return tutors;
};

module.exports = Matching;