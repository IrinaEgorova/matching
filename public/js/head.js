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
var GROUPS_LIST = [];
var TUTORS_LIST = [];
var tutors;

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
      <div class="slide group-slide" data-group-name="' + groupName + '">\
      <div class="slide-header">Добавление преподавателей для группы ' + groupName + '</div>\
    <div class="slide-body">\
      <p>Добавьте преподавателей, участвующих в распределении студентов группы ' + groupName + '</p>\
      <div class="group-tutors-list check-list"></div>\
      <button class="choose-all choose-button">Выбрать всех</button>\
      <button class="cancel-choose choose-button">Отменить выбор</button>\
      </div>\
    </div>\
  ');

  for (var i = 0; i < fullTutorsList.length; i++) {
    slide.find('.group-tutors-list').append('<div class="tutor-item check-item"><label><input type="checkbox" data-index="' + i + '">' + fullTutorsList[i] + '</label></div>');
  }

  return slide;
}

function createQuotasTableHeader(groupInputs) {
  var headerRow = $('<thead><tr></tr></thead>');
  headerRow.append('<th></th>');
  for (var i = 0; i < groupInputs.length; i++) {
    var header = $('<th></th>');
    var dataIndex = $(groupInputs[i]).attr('data-index');
    var group = GROUPS_LIST[dataIndex].name;
    header.html(group);
    headerRow.append(header);
  }

  return headerRow;
}

function createQuotasTable() {
  var groupInputs = $('.groups-list .group-item input:checked');
  var quotasTable = $('.quotas-table').html('');
  var headerRow = createQuotasTableHeader(groupInputs);
  var tutors = [];

  quotasTable.append(headerRow).append('<tbody></tbody>');

  var tutorSlides = $('.group-slide');

  for (var i = 0; i < tutorSlides.length; i++) {
    var checkedTutors = $(tutorSlides[i]).find('input:checked');
    for (var l = 0; l < checkedTutors.length; l++) {
      var dataIndex = $(checkedTutors[l]).attr('data-index');
      var tutor = TUTORS_LIST[dataIndex];
      var groupName = $(tutorSlides[i]).attr('data-group-name');
      if (!tutor.groups) {
        tutor.groups = [];
      }

      if (tutors.indexOf(tutor) === -1) {
        tutors.push(tutor);
      }
      tutor.groups.push(groupName);
    }
  }

  for (var j = 0; j < tutors.length; j++) {
    var tutorRow = $('<tr></tr>');
    var tutorNameCell = $('<td></td>');
    var groupCell;

    var tutorName = tutors[j].LastName + ' ' + tutors[j].FirstName + ' ' + tutors[j].PatronymicName;

    tutorNameCell.html(tutorName);
    tutorRow.append(tutorNameCell);
    for (var k = 0; k < groupInputs.length; k++) {
      var groupIndex = $(groupInputs[k]).attr('data-index');
      var group = GROUPS_LIST[groupIndex].name;
      var index = tutors[j].groups.indexOf(group);

      if (index === -1) {
        groupCell = $('<td><input type="number" value="0" disabled="disabled"></td>');
      } else {
        var input = $('<input type="number" value="3">');
        groupCell = $('<td></td>');
        groupCell.append(input);
        if (!tutors[j].quotas) {
          tutors[j].quotas = [];
        }

        tutors[j].quotas[index] = input;
      }
      tutorRow.append(groupCell);
    }
    $('.quotas-table tbody').append(tutorRow);
  }
  return tutors;
}

function showNextSlide() {
  if (curSlide === 0) {
    var groupInputs = $('.groups-list .group-item input:checked');

    if (groupInputs.length > 0) {
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

  }

  if ($(slides[curSlide + 1]).hasClass('quotas-slide')) {
    tutors = createQuotasTable();
    console.log('selected tutors', tutors);
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
  
  $('.run-button').click(function () {
   
    var tutorsData = [];
    tutors.forEach (function (tutor) {

      for (var i = 0; i < tutor.quotas.length; i++) {
        var temp = {};
        temp.Tutor_ID = tutor.ID;
        temp.Quota = parseInt(tutor.quotas[i].val());
        var groupName = tutor.groups[i];

        for (var j = 0; j < GROUPS_LIST.length; j++) {
          if (GROUPS_LIST[j].name === groupName) {
            break;
          }
        }
        
        temp.Group_ID = GROUPS_LIST[j].id;
        tutorsData.push(temp);
      }
    });

    console.log(tutorsData);

    var groups = [];
    var groupInputs = $('.groups-list .group-item input:checked');
    for (var i = 0; i < groupInputs.length; i++) {
      var dataIndex = $(groupInputs[i]).attr('data-index');
      groups[i] = GROUPS_LIST[dataIndex].name;
    }

    $.ajax({
      url: 'http://localhost:8080/api/quotas',
      method: 'POST',
      dataType: 'json',
      data: {
        tutors: tutorsData
      }
    }).done();

    // $.ajax({
    //   url: 'http://localhost:8080/api/matching',
    //   method: 'POST',
    //   dataType: 'json',
    //   data: {
    //     groups: groups
    //   }
    // }).done();
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

function showGroups(groups) {
  GROUPS_LIST = groups;
  for (var i = 0; i < groups.length; i++) {
    var g = groups[i];
    var groupName = g.name;
    $('.groups-list').append('<div class="group-item check-item"><label><input type="checkbox" data-index="' + i + '">' + groupName + '</label></div>');
  }
}

function showTutors(tutors) {
  TUTORS_LIST = tutors;
  for (var i = 0; i < tutors.length; i++) {
    var t = tutors[i];
    var tutorName = t.LastName + ' ' + t.FirstName + ' ' + t.PatronymicName;
    fullTutorsList[i] = tutorName;
    $('.tutors-list').append('<div class="tutors-item draggable" data-index="' + i + '">' + tutorName + '</div>');
  }
}

var DragManager = new function () {

  /**
   * составной объект для хранения информации о переносе:
   * {
   *   elem - элемент, на котором была зажата мышь
   *   avatar - аватар
   *   downX/downY - координаты, на которых был mousedown
   *   shiftX/shiftY - относительный сдвиг курсора от угла элемента
   * }
   */
  var dragObject = {};

  var self = this;

  function onMouseDown(e) {

    if (e.which != 1) return;

    var elem = e.target.closest('.draggable');
    if (!elem) return;

    dragObject.elem = elem;

    // запомним, что элемент нажат на текущих координатах pageX/pageY
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;

    return false;
  }

  function onMouseMove(e) {
    if (!dragObject.elem) return; // элемент не зажат

    if (!dragObject.avatar) { // если перенос не начат...
      var moveX = e.pageX - dragObject.downX;
      var moveY = e.pageY - dragObject.downY;

      // если мышь передвинулась в нажатом состоянии недостаточно далеко
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }

      // начинаем перенос
      dragObject.avatar = createAvatar(e); // создать аватар
      if (!dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
        dragObject = {};
        return;
      }

      // аватар создан успешно
      // создать вспомогательные свойства shiftX/shiftY
      var coords = getCoords(dragObject.avatar);
      dragObject.shiftX = dragObject.downX - coords.left;
      dragObject.shiftY = dragObject.downY - coords.top;

      startDrag(e); // отобразить начало переноса
    }
    var $hoverObject = $(document.elementFromPoint(e.pageX - dragObject.shiftX - 2, e.pageY - dragObject.shiftY - 2));


    // отобразить перенос объекта при каждом движении мыши
    dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

    return false;
  }

  function onMouseUp(e) {
    if (dragObject.avatar) { // если перенос идет
      finishDrag(e);
    }

    // перенос либо не начинался, либо завершился
    // в любом случае очистим "состояние переноса" dragObject
    dragObject = {};
  }

  function finishDrag(e) {
    var dropElem = findDroppable(e);

    if (!dropElem) {
      self.onDragCancel(dragObject);
    } else {
      self.onDragEnd(dragObject, dropElem);
    }
  }

  function createAvatar(e) {

    // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
    var avatar = dragObject.elem;
    var old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || ''
    };

    // функция для отмены переноса
    avatar.rollback = function () {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex
    };

    return avatar;
  }

  function startDrag(e) {
    var avatar = dragObject.avatar;

    // инициировать начало переноса
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
  }

  function findDroppable(event) {
    // спрячем переносимый элемент
    dragObject.avatar.hidden = true;

    // получить самый вложенный элемент под курсором мыши
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    dragObject.avatar.hidden = false;
    if ($(elem).hasClass('draggable')) {
      return elem;
    }
    // показать переносимый элемент обратно

    if (elem == null) {
      // такое возможно, если курсор мыши "вылетел" за границу окна
      return null;
    }

    return elem.closest('.droppable');
  }

  document.onmousemove = onMouseMove;
  document.onmouseup = onMouseUp;
  document.onmousedown = onMouseDown;

  this.onDragEnd = function (dragObject, dropElem) {
    var avatar = dragObject.avatar;
    avatar.style.zIndex = 1;
    avatar.style.position = '';
    var $dropElem = $(dropElem);
    if ($dropElem.hasClass('tutors-list')) {
      $(dragObject.elem).removeClass('selected');
      dropElem.appendChild(dragObject.elem);
      return;
    } else if ($dropElem.hasClass('draggable')) {

      if ($dropElem.hasClass('selected')) {
        $(dragObject.elem).addClass('selected');
      } else {
        $(dragObject.elem).removeClass('selected');
      }

      $dropElem.before(dragObject.elem);
      return;
    }

    $(dragObject.elem).addClass('selected');
    dropElem.appendChild(dragObject.elem);
  };
  this.onDragCancel = function (dragObject) {
    dragObject.avatar.rollback();
  };

};
function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}
