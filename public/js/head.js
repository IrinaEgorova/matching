var firstSlide = document.querySelector('.first-slide');
var slides = document.querySelectorAll('.slide');
var buttons = document.querySelector('.buttons-container');
var startButton = document.querySelector('.start-button');
var nextButton = document.querySelector('.next-button');
var backButton = document.querySelector('.back-button');
var runButton = document.querySelector('.run-button');
var mainContainer = document.querySelector('.main-container');
var container = document.querySelector('.container');

var curSlide = -1;
var fullTutorsList = [];

backButton.style.display = 'none';
nextButton.style.display = 'none';

function showButtons() {
  slides[curSlide].appendChild(buttons);
  if (curSlide >= slides.length - 1) {
    backButton.style.display = 'block';
    nextButton.style.display = 'none';
    runButton.style.display = 'block';
  } else if (curSlide > 0) {
    backButton.style.display = 'block';
    nextButton.style.display = 'block';
    runButton.style.display = 'none';
  } else if (curSlide > -1) {
    backButton.style.display = 'none';
    nextButton.style.display = 'block';
    runButton.style.display = 'none';
  } else if (curSlide <= -1) {
    backButton.style.display = 'none';
    nextButton.style.display = 'none';
    runButton.style.display = 'none';
  }
}

function generateSlide(groupInput) {
  var groupName = $(groupInput).closest('label').text();

  var slide = $('\
      <div class="slide group-slide">\
      <div class="slide-header">Добавление преподавателей для группы ' + groupName + '</div>\
    <div class="slide-body">\
      <p>Добавьте преподавателей, участвующих в распределении студентов группы ' + groupName + '</p>\
      <div class="group-tutors-list"></div>\
      <button class="choose-all choose-button">Выбрать всех</button>\
      <button class="cancel-choose choose-button">Отменить выбор</button>\
      </div>\
    </div>\
  ');

  for (var i = 0; i < fullTutorsList.length; i++) {
    slide.find('.group-tutors-list').append('<div class="tutor-item check-item"><label><input type="checkbox">' + fullTutorsList[i] + '</label></div>');
  }

  return slide;
}

function showNextSlide() {
  if (curSlide === 0) {
    var groupInputs = $('.groups-list .group-item input:checked');

    if(groupInputs.length > 0) {
      for (var i = 0; i < groupInputs.length; i++) {
        var newSlide = generateSlide(groupInputs[i]);
        container.appendChild(newSlide[0]);
        slides = Array.prototype.slice.call(slides);
        slides.splice(curSlide + 1 + i, 0, newSlide[0]);
      }
    } else {
      alert('Выберите группы, участвующие в распределении');
      return;
    }


    console.log(groupInputs);

  }

  slides[curSlide].style.display = 'none';
  slides[curSlide + 1].style.display = 'block';

  curSlide++;
  showButtons();
}

function showPrevSlide() {
  slides[curSlide].style.display = 'none';

  curSlide--;

  if (curSlide === 0) {
    var groupSlidesCount = $('.group-slide').length;
    slides.splice(1, groupSlidesCount);
    $('.group-slide').remove();
  }
  slides[curSlide].style.display = 'block';


  showButtons();
}

startButton.addEventListener('click', function () {
  firstSlide.style.display = 'none';
  slides[0].style.display = 'block';
  curSlide++;
  showButtons();
});

nextButton.addEventListener('click', function () {
  if (curSlide !== slides.length - 1) {
    showNextSlide();
  }
});


backButton.addEventListener('click', function () {
  if (curSlide !== 0) {
    showPrevSlide();
  }
});

runButton.addEventListener('click', function () {
  slides[slides.length - 1].style.display = 'none';
  mainContainer.style.display = 'block';
});


$(document).ready(function () {
  $('.cancel-choose').click(function () {
    var curSlide = $(this).closest('.slide-body');
    var groupsCheckboxes = curSlide.find('.check-list .check-item input[type=checkbox]');
    groupsCheckboxes.prop('checked', false);
  });

  $('.choose-all').click(function () {
    var curSlide = $(this).closest('.slide-body');
    var groupsCheckboxes = curSlide.find('.check-list .check-item input[type=checkbox]');
    groupsCheckboxes.prop('checked', true);
  });

  $.ajax({
    url: 'http://localhost:8080/api/groups',
    method: 'GET',
    dataType: 'json'
  }).done(showGroups);

  $.ajax({
    url: 'http://localhost:8080/api/tutors',
    method: 'GET',
    dataType: 'json',
    data: {
      title: 'Преподаватель'
    }
  }).done(showTutors);
});

function showGroups(groupsResponse) {
  var groups = groupsResponse._embedded.groups;
  for (var i = 0; i < groups.length; i++) {
    var g = groups[i];
    var groupName = g.name;
    $('.groups-list').append('<div class="group-item check-item"><label><input type="checkbox">' + groupName + '</label></div>');
  }
}

function showTutors(tutorsResponse) {
  var tutors = tutorsResponse._embedded.people;
  for (var i = 0; i < tutors.length; i++) {
    var t = tutors[i];
    var tutorName = t.displayName;
    fullTutorsList[i] = tutorName;
    $('.tutors-list').append('<div class="tutors-item">' + tutorName + '</div>');
  }
}
