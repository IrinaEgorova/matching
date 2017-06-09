/**
 * Created by Iren on 09.05.2017.
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

$(document).ready(function () {
  $('.iteration-button').click(function (){
    console.log('click');
    $.ajax({
      url: 'http://localhost:8080/api/matching',
      method: 'POST',
      dataType: 'json'
    }).done(startMatching);
  });
  $.ajax({
    url: 'http://localhost:8080/api/getMatchingStudents',
    method: 'GET',
    dataType: 'json'
  }).done(getMatchingStudents);
});

function getMatchingStudents(data) {
  var students = data.students;
  var groups = data.groups;


  console.log('------');

  $.ajax({
    url: 'http://localhost:8080/api/getStudentsWithPref',
    method: 'GET',
    dataType: 'json'
  }).done(function (studWithPref) {

    var studPrefs = [];
    for (var i = 0; i < studWithPref.length; i++) {
      var studWithPrefName = studWithPref[i].FirstName + ' ' + studWithPref[i].LastName;
      studPrefs.push(studWithPrefName);
    }
    var studTable = $('.monitoring-container table');

    students.forEach(function (student) {
      var group = groups.find(function (group) {
        return group.id === student.Group_ID;
      });

      var studName = student.FirstName + ' ' + student.LastName;
      console.log(studName);

      if (studPrefs.indexOf(studName) === -1) {
        studTable.append('<tr><td>' + group.name + '</td><td>' + studName + '</td><td>-</td></tr>');
      } else {
        studTable.append('<tr><td>' + group.name + '</td><td>' + studName + '</td><td>+</td></tr>');
      }

    });

  });

}

function startMatching(data) {
  console.log(data);
}