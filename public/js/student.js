/**
 * Created by Iren on 02.03.2017.
 */

var tutors = document.querySelectorAll('.students-list');
var popup = document.querySelector('.popup');
var TUTORS_LIST = [];
popup.addEventListener('click', function () {
  popup.style.display = 'none';
});
for (var i = 0; i < tutors.length; i++) {
  tutors[i].addEventListener('click', function () {
    popup.style.display = 'block';
  });
}

$(document).ready(function () {
  // var url = encodeURI('http://82.179.88.27:8280/core/v1/people?title=Доцент');
  // fetch(url)
  //   .then(function(response) {
  //     console.log(response);
  //     return response.json();
  //   } )
  //   .then(function( obj ) {
  //     console.log(obj);
  //     res.send(obj);
  //   } );

  // TODO: change ip to localhost
  $.ajax({
    url: 'http://192.168.1.35:8080/api/tutors',
    method: 'POST',
    dataType: 'json',
    data: {
      title: 'Преподаватель'
    }
  }).done(showTutors);
});

function showTutors(tutors) {
  TUTORS_LIST = tutors;
  for (var i = 0; i < tutors.length; i++) {
    var t = tutors[i];
    var tutorName = t.LastName + ' ' + t.FirstName + ' ' + t.PatronymicName;
    var $tutor = $('<div class="tutors-item">' + tutorName + '</div>');
    $('.tutors-list').append($tutor);
  }
}