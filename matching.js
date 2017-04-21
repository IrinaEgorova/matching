
/**
 * Created by Iren on 04.03.2017.
 */
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
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
    for (var j = 0; j < tutors[i].studLists.length; j++) {
      tutorsStep[i].studLists[j] = {};
      tutorsStep[i].studLists[j].groupName = tutors[i].groupQuotas[j].groupName;
      tutorsStep[i].studLists[j].groupList = [];
      for (var k = 0; k < tutors[i].studLists[j].groupList.length; k++) {
        tutorsStep[i].studLists[j].groupList[k] = tutors[i].studLists[j].groupList[k];
      }
    }
  }

  return tutorsStep;
}


function spliceRedundantStudents(tutor, index) {
  var quota = tutor.groupQuotas[index].groupQuota;
  var students = tutor.studLists[index].groupList;
  var removeCount = students.length - quota;

  return students.splice(quota, removeCount);
}

function moveToNextTutor(tutors, j) {
  var removedStudents = [];
  for (var g = 0; g < tutors[j].groupQuotas.length; g++) {
    var removed = spliceRedundantStudents(tutors[j], g);
    removedStudents = removedStudents.concat(removed);
  }
  return removedStudents;
}

function copyStudents(tutor, tutorStep, curI) {
  for (var i = 0; i < tutor.groupQuotas[curI].groupQuota; i++) {
    var list = tutorStep.studLists[curI].groupList;
    var stud = tutor.studLists[curI].groupList[i];
    if (tutor.studLists[curI].groupList[i] && list.indexOf(stud) === -1) {
      list.push(stud);
    }
  }
}

function updateTutor(tutors, tutor) {
  for (var i = 0; i < tutors.length; i++) {
    if (tutors[i].name === tutor.name) {
      tutors[i] = tutor;
    }
  }
}


var Matching = function () {

};

Matching.matchingStep = function (tutors) {
  var tutorsStep = copyTutors(tutors);

  var removedStudents = [];
  for (var i = 0; i < tutors.length; i++) {
    var t = tutors[i];
    for (var j = 0; j < t.groupQuotas.length; j++) {
      if (t.studLists[j].groupList.length > t.groupQuotas[j].groupQuota) {
        copyStudents(t, tutorsStep[i], j);
        var removed = moveToNextTutor(tutors, i);
        removedStudents = removedStudents.concat(removed);
        console.log('removed', removed);
      } else {
        copyStudents(t, tutorsStep[i], j);
      }
    }
  }

  removedStudents.forEach(function (student) {
    var nextTutorIndex = student.preferences.indexOf(student.curTutor.name) + 1;
    var nextTutor = student.preferences[nextTutorIndex];
    var tutor = tutorsStep.find(function (tutor) {
      return tutor.name === nextTutor;
    });
    console.log('tutors', tutor);
    var studList = tutor.studLists.find(function (list) {
      return list.groupName === student.group;
    });
    console.log('studList', studList);
    if (studList.groupList.indexOf(student) === -1) {
      studList.groupList.push(student);
      student.curTutor = tutor;
      updateTutor(tutors, tutor);
      console.log('updated', tutors);
    }
  });
  console.log(' -----------------STEP------------------- ');
  for (var g = 0; g < tutors.length; g++) {
    console.log(tutors[g].name);
    for (var h = 0; h < tutors[g].studLists.length; h++) {
      for (var x = 0; x < tutors[g].studLists[h].groupList.length; x++) {
        console.log(tutors[g].studLists[h].groupList[x]);
      }
    }
  }

  return tutors;
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
//
// tutors = Matching.firstStep(students, tutors);
// tutors = Matching.matchingStep(tutors);
// tutors = Matching.matchingStep(tutors);
// tutors = Matching.matchingStep(tutors);
// tutors = Matching.matchingStep(tutors);
// tutors = Matching.matchingStep(tutors);
// tutors = Matching.matchingStep(tutors);
// tutors = Matching.matchingStep(tutors);
// tutors = Matching.matchingStep(tutors);

module.exports = Matching;