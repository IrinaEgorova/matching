/**
 * Created by Iren on 02.03.2017.
 */

var tutors = document.querySelectorAll( '.students-list' );
var popup = document.querySelector( '.popup' );
popup.addEventListener( 'click', function () {
  popup.style.display = 'none';
} );
for( var i = 0; i < tutors.length; i++ ) {
  tutors[ i ].addEventListener( 'click', function () {
    popup.style.display = 'block';
  } );
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

  $.ajax({
  url: 'http://localhost:8080/api/tutors',
  method: 'POST',
  dataType: 'json',
  data: {
    title: 'Преподаватель'
  }
}).done(showTutors);
});

function showTutors(tutorsResponse) {
  var tutors = tutorsResponse._embedded.people;
  for(var i = 0; i < tutors.length; i++) {
    var t = tutors[i];
    var tutorName = t.sn + ' ' + t.givenName + ' ' + t.initials;
    $('.tutors-list').append('<div class="tutors-item">' + tutorName + '</div>')
  }
}