/**
 * Created by Iren on 12.05.2017.
 */

$(document).ready(function () {
  var token = localStorage.getItem('user-token');
  token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhdXRoZW50aWNhdGlvbi1zZXJ2aWNlLXYxLjAiLCJzdWIiOiJmNWQzODcxOC0zYjE4LTQ5MDgtOWViOC05M2RmMThmNGZiMmYiLCJhdWQiOiJ3c28yLWVzYiIsImlhdCI6IjIwMTctMDUtMTJUMTk6MzU6MDAuMTQ2WiIsImV4cCI6IjIwMTctMDYtMTJUMTk6MzU6MDAuMTQ2WiJ9.yGKk9qLdhNi6EMWtJFTN42Qt8E_1t86_0AH0y17jC8w';
  console.log(token);
  // window.location.replace("http://localhost:8080/student.html");


  
  $.ajax({
    url: 'http://localhost:8080/api/getTokenData',
    method: 'POST',
    dataType: 'json',
    data: {
      token: token
    },
    error: function(xhr, status, error) {
      console.log(xhr.responseText + '|\n' + status + '|\n' +error);
    }

  }).done(redirectPerson);




});

function redirectPerson(jsonTitle) {
  if (jsonTitle.title == 'Студент') {
    console.log(jsonTitle);
    window.location.replace("http://localhost:8080/student.html");
  }
}