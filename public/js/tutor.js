$(document).ready(function () {
  $('.tutors-item').click(function (e) {
    var $studinfo = $('.student-info');
    $studinfo.css({
      position: 'absolute',
      left: $(this).offset().left + $(this).width() + 75,
      top: $(this).offset().top + 3
    });
    $('.tutors-item').removeClass('selected');
    $(this).addClass('selected');
    e.stopPropagation();
    $studinfo.show();
  });
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
  }).done(function (data) {
    console.log(data);

    // // TODO: change ip to localhost
    $.ajax({
      url: 'http://localhost:8080/proxy/core/v1/people/' + data.uid,
      method: 'POST',
      dataType: 'json'
    }).done(function (tutorInfo) {
      $.ajax({
        url: 'http://localhost:8080/api/getCurrentIteration',
        method: 'GET',
        dataType: 'json'
      }).done(function (matchingData) {
        console.log(matchingData); // Array of tutors matchingData[0].data[0].
        // Найти препода в массиве matchingData по фамилии
      });
    });
  });

});

$(document).click(function () {
  $('.student-info').hide();
});

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
      sortStudentList();
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
    sortStudentList();
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
    $('.tutors-item').removeClass('selected');
    $(avatar).removeClass('red').removeClass('green').addClass('selected');
  }

  function findDroppable(event) {
    // спрячем переносимый элемент
    dragObject.avatar.hidden = true;

    // получить самый вложенный элемент под курсором мыши
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    dragObject.avatar.hidden = false;
    if ($(elem).hasClass('draggable')) {
      return elem;
    } else if ($(elem).parent().hasClass('draggable')) {
      return elem.parentNode;
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

    if ($dropElem.hasClass('draggable')) {
      $dropElem.before(dragObject.elem);
      sortStudentList($(dragObject.elem));
      return;
    }

    $(dragObject.elem).addClass('selected');
    dropElem.appendChild(dragObject.elem);
    sortStudentList($(dragObject.elem));
  };
  this.onDragCancel = function (dragObject) {
    dragObject.avatar.rollback();
  };

};

function sortStudentList($dropElem) {
  $('.student-info').hide();
  var $students = $('.students-list .tutors-item').removeClass('green').removeClass('red');
  for (var i = 0; i < $students.length; i++) {
    var elem = $($students[i]).find('span').first();
    elem.html((i + 1) + '. ');
  }

  for (i = 0; i < 3; i++) {
    $($students[i]).addClass('green');
  }

  for (i = 3; i < $students.length; i++) {
    $($students[i]).addClass('red');
  }

  if ($dropElem) {
    $dropElem.animate({opacity: '0.5'}, 300);
    $dropElem.animate({opacity: '1'}, 300);
    $dropElem.animate({opacity: '0.5'}, 300);
    $dropElem.animate({opacity: '1'}, 300);
  }
}

function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}
