/**
 * Created by Iren on 12.05.2017.
 */

$(document).ready(function () {
  var token = localStorage.getItem('user-token');
  console.log('Original Token', token);
  if (token == null) {
    window.location.replace("http://localhost:8080/proxy/authentication/?redirect=localhost:8080");
  }

  $.ajax({
    url: 'http://localhost:8080/api/getTokenData',
    method: 'POST',
    dataType: 'json',
    data: {
      token: token
    },
    error: function (xhr, status, error) {
      console.log(xhr.responseText + '|\n' + status + '|\n' + error);
    }

  }).done(redirectPerson);


});

function redirectPerson(jsonTitle) {
  if (jsonTitle.title == 'Студент') {
    console.log(jsonTitle);
    window.location.replace("http://localhost:8080/student.html");
  } else if (jsonTitle.title == 'Преподаватель') {
    window.location.replace("http://localhost:8080/tutor.html");
  } else if (jsonTitle.title == 'Лагерев') {
    window.location.replace("http://localhost:8080/tutor.html");
  }
}