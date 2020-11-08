(function (window) {

  var View = function (template) {
    this.template = template;

    // html要素
    this.el_newTodo = qs(null, namespace.NEW_TODO);
    this.el_todoList = qs(null, namespace.TODO_LIST);
    this.el_toggleAll = qs(null, namespace.TOGGLE_ALL);
    this.el_clearCompleted = qs(null, namespace.CLEAR_COMPLETED);
    this.el_todoCount = qs(null, namespace.TODO_COUNT);
    this.el_body = qs(null, 'body');
  }


  /****************************************************
   * bindEventListener
   *
   */
  View.prototype.bindEventListener = function (event, handler) {

    // console.log('[View] bindEventListener');

    var self = this;
    var datasets,           // array which is includes li.data-id
      completed,        // current li.data-id className whic express state of toggle
      result = true;

    switch (event) {

      // - static cases
      case namespace.ADD_NEW_TODO:
        self.el_newTodo.addEventListener("keypress", function (event) {
          handler(event);
        });
        return;

      case namespace.TOGGLE_ALL_CLICKED:
        self.el_toggleAll.addEventListener('click', function () { handler() });
        return;

      case namespace.CLEAR_COMPLETED_CLICKED:
        self.el_clearCompleted.addEventListener('click', function () { handler() });
        return;


      // - dynamic cases
      case namespace.TOGGLE_CLICKED:
        var toggle;

        // ul.todo-listの子要素li[data-id]を配列で取得
        datasets = Object.keys(self.el_todoList.children).map(function (index) {
          return self.el_todoList.children[index].dataset.id;
        });

        datasets.forEach(function (uid, index) {
          toggle = qs(null, '[data-id="' + uid + '"] input');
          toggle.addEventListener('click', function () {
            handler({
              uid: uid,
              index: index,
            })
          });
        });
        return;

      case namespace.DESTROY_CLICKED:
        var destory;

        // ul.todo-listの子要素li[data-id]を配列で取得
        datasets = Object.keys(self.el_todoList.children).map(function (index) {
          return self.el_todoList.children[index].dataset.id;
        });

        datasets.forEach(function (uid, index) {
          destory = qs(self.el_todoList, '[data-id="' + uid + '"] button');
          destory.addEventListener('click',
            function () {
              handler({
                uid: uid,
                index: index
              })
            });
        });
        return;

      case namespace.DBL_CLICKED:

        // ul.todo-listの子要素li[data-id]を配列で取得
        datasets = Object.keys(self.el_todoList.children).map(function (index) {
          result = result && convertStr2Bool(self.el_todoList.children[index].className);
          return self.el_todoList.children[index].dataset.id;
        });

        datasets.forEach(function (uid, index) {

          var list = qs(self.el_todoList, '[data-id="' + uid + '"] .view');
          var title = qs(list, 'label').textContent;
          list.addEventListener('dblclick',
            function (event) {
              handler({
                uid: uid,
                index: index,
                event: event
              })
            });
        });
        return;

      default:
        return;
    }
  }


  /*********************************************
   * render
   *
   *    @param: todoList is array of todo-list
   *      {id: String, title: String, done: Boolean}
   *
   */
  View.prototype.render = function (todoList) {
    console.log('[View] render');
    var self = this;

    self.el_todoList.innerHTML = self.template.getDefaultList(todoList);
  }


  /*******************************************
   * toggleAllStatus
   *
   * This method will be required when
   *  lood, toggle, toggleAll, addNewTodo, destory, clearCompleted
   *
   * @param : doesCheck
   *  If doesCheck type is booean, then set input.toggle-all by doesCheck value.
   *  If not, then check all ul.todo-list and determine its status.
   *
   *
   */
  View.prototype.toggleAllStatus = function (doesCheck) {
    console.log('[View] toggle all status');
    var self = this;
    var lists, booleanset;

    //
    if (typeof doesCheck === 'boolean') {
      self.el_toggleAll.checked = doesCheck;
    }
    else {
      // 全部調べる
    }
  }


  /**********************************************
   *
   *
   */
  View.prototype.renderCount = function (count) {
    console.log('[View] render count');
    var self = this;
    count = count === null || count === 0 ? '' : count;

    self.el_todoCount.textContent = count;
  }



  /****************************************************
   * visible clear completed
   *
   * @param: count is the count of ul.todo-list children which is fasle
   *
   */
  View.prototype.visibleClearCompleted = function (count) {
    console.log('[View] visible clear-completed');
    var self = this;

    if (count) {
      self.el_clearCompleted.innerHTML = 'Clear Completed';
      self.el_clearCompleted.removeAttribute('style');
      self.el_clearCompleted.setAttribute('style', 'display: block');
    }
    else {
      self.el_clearCompleted.innerHTML = '';
      self.el_clearCompleted.removeAttribute('style');
      self.el_clearCompleted.setAttribute('style', 'display: none');
    }
  }




  /*********************************************
   * Transform VIew
   * 
   * toggle the div.view to input form
   * 
   * @param: signal identifies conert it to form or prev view
   * 
   * 
   * 
   * 
   */
  View.prototype.transformView = function (signal, target) {
    console.log('[View] transformView');
    var self = this;

    console.log(target);

    // show edit form
    if (signal) {
      // create input form
      var temporary = document.createElement('div');
      temporary.setAttribute('class', 'temporary');
      temporary.innerHTML = '<input class="input" type="text">';
      target.appendChild(temporary);
      // hide div.view
      qs(target, '.view').classList.add('hidden');
    }
    // hide edit view
    else {
      // remove div.temporary
      console.log(qs(target, namespace.TEMPORARY));
      if (qs(target, namespace.TEMPORARY)) {
        target.removeChild(target.lastChild);
        // show div.view
        qs(target, '.view').classList.remove('hidden');
      }
    }
  }


  // >>No longer needed<<
  /*******************************************************************

    @param: callback is the method of Controller class which
            pass event.target.value as new todo title.

  */
  // View.prototype.setEventListnerToTemporary = function (target, callback) {
  //   console.log('[View] set event listener to transformed-view');
  //   var self = this;

  //   var input = qs(target, '.input');
  //   input.addEventListener('keypress', function (event) {
  //     if (event.key === 'Enter' && event.target.value !== '') {
  //       callback.call(null, event.target.value);
  //     }
  //     else {
  //       // 元に戻したいけど...document.removeEventListenerはここでは解除できない

  //     }
  //   });
  // }



  // >>No longer needed<<
  // View.prototype.documentClickHandler = function (event, target, callback) {
  //   console.log('[View] document click handler');
  //   var self = this;

  //   // click inside of target
  //   if (event.path.includes(target)) {
  //     console.log('inside');
  //     return;
  //   }
  //   // outside of target
  //   self.transformView(false, target);
  //   document.removeEventListener('click', callback);
  // }


  /******************************************
   * editItem
   *
   *    1. transform div.view to div.temporary
   *    2. qs(target, div.temporary input.input).addEventListener('keypress)
   *    3. document.addEventListener('click')
   * 
   *     chart 2 and 3 requires Controller method to react the user input.
   *  
   *
   */
  View.prototype.editItem = function (data, editHandler) {
    console.log('[View] edit item');
    var self = this;
    var target, input;
    editHandler = editHandler || function () { };

    target = qs(null, '[data-id="' + data.uid + '"]');
    self.transformView(true, target);
    input = qs(target, '.input');
    input.focus();

    // used to be
    // self.setEventListnerToTemporary(target);
    // Instead
    // qs(target, '.input').addEventListener('keypress', function(event){
    //   if(event.key === 'Enter' && event.target.value !== ''){
    //     console.log('send value ass new title');
    //   }
    //   else if(event.key === "Enter"){
    //     console.log('close the form');
    //   }
    // });

    // used to be
    // document.addEventListener('click', (function () {
    //   return function callback(event) {
    //     // invoke handler of document click event
    //     self.documentClickHandler(event, target, callback);
    //   }
    // })());

    // Instead 1
    //　終了処理をする関数にdocument.removeEventListenerヲするためのf callbackを渡すことができる
    // var callback = function (event) {
    //   self.documentClickHandler(event, target, callback);
    // }
    // document.addEventListener('click', (function () {
    //   return callback;
    // })());


    // AND THIS IS WHAT I WANT
    // callbackはControllerのメソッドにする
    var callback = function (event) {
      editHandler(event, target, callback);
    }
    document.addEventListener('click', (function () {
      return callback;
    })());
    input.addEventListener('keypress', (function () {
      return callback;
    })());
  }



  window.app = window.app || {};
  window.app.View = View;

})(window);
