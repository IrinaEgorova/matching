/**
 * Created by Iren on 02.03.2017.
 */

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
  var token = localStorage.getItem('user-token');
  console.log('Original Token', token);

  // Если пользователь не вошел в систему, то он перенаправляется на форму авторизации.
  if (token == null) {
    window.location.replace("http://localhost:8080/proxy/authentication/?redirect=localhost:8080");
  }

  // Если пользоватеь вошел в систему, то на сервер отправляется запрос,
  // в котором по токену возвращается информация о пользователе.
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
  }).done(function (data) {

    $('.student-name').html(data.name);

    // Для данного студента запрашивается список преподавателей для выбора.
    $.ajax({
      url: 'http://localhost:8080/api/getTutors',
      method: 'POST',
      dataType: 'json',
      data: {
        studentUID: data.uid
      }
    }).done(showTutors);
  });

  // Обработка отправки выбора студента на сервер.
  $('.send-button').click(function () {
    var $tutors = $('.selected-tutors-list .tutors-item');
    var tutors = [];
    for (var i = 0; i < $tutors.length; i++) {
      tutors.push(TUTORS_LIST[$($tutors[i]).attr('data-index')]);
    }
    console.log(tutors);
    console.log(JSON.stringify(tutors));

    // Получение данных о студенте.
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
    }).done(function (data) {

       
      $.ajax({
        url: 'http://localhost:8080/api/preferences',
        method: 'POST',
        dataType: 'json',
        data: {
          studentUID: data.uid,
          pref: tutors
        }
      }).done();
    });


  });
});

function showTutors(tutors) {
  TUTORS_LIST = tutors;
  for (var i = 0; i < tutors.length; i++) {
    var t = tutors[i];
    var tutorName = t.LastName + ' ' + t.FirstName + ' ' + t.PatronymicName;
    var $tutor = $('<div class="tutors-item draggable" data-index="' + i + '">' + tutorName + '</div>');
    $('.tutors-list').append($tutor);
  }
}