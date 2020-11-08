(function (window) {

  var Controller = function (view, model) {
    var self = this;

    this.model = model;
    this.view = view;

    self.view.bindEventListener(
      namespace.ADD_NEW_TODO, self.addNewTodo.bind(self)
    );
    self.view.bindEventListener(
      namespace.TOGGLE_ALL_CLICKED, self.toggleAll.bind(self)
    );
    self.view.bindEventListener(
      namespace.CLEAR_COMPLETED_CLICKED, self.clearCompleted.bind(self)
    );

    // 必要ないかも...
    self.view.bindEventListener(
      namespace.TOGGLE_CLICKED, self.toggle.bind(self)
    );

  }



  /*******************************************
   *
   *
   */
  Controller.prototype.setView = function () {
    console.log('[Controller] setView');

    var self = this;
    switch (checkRoute()) {
      case '/': self.showAll(); break;
      case '/active': self.showActive(); break;
      case '/completed': self.showCompleted(); break;
      default: console.log('the route is not defined'); break;
    }

    self._filter();
  }


  /***********************************************
   *
   *
   */
  Controller.prototype.showAll = function () {
    console.log('[Controller] showAll');
    var self = this;

    self.model.read(
      function (param) { self.view.render(param); }
    );
    self.setHandlerToDynamics();
  }


  /************************************************
   * showActive
   *
   * shows only active todos in ul.todo-list
   * Exist data will not be changed, just only shows actives.
   *
   * get active collection from model
   * send it to view
   *
   *
   *
   */
  Controller.prototype.showActive = function () {
    console.log('[Controller] showActive');
    var self = this;

    self.model.read(
      function (param) {
        var actives = param.filter(function (todo) {
          return todo.completed === false;
        });
        console.log(actives);
        self.view.render(actives);
      }
    );

    self.setHandlerToDynamics();
  }


  /*********************************************
   *
   *
   */
  Controller.prototype.showCompleted = function () {
    console.log('[Controller] showCompleted');
    var self = this;

    self.model.read(
      function (param) {
        var completed = param.filter(function (todo) {
          return todo.completed;
        });
        console.log(completed);
        self.view.render(completed);
      }
    );
    self.setHandlerToDynamics();
  }



  /***************************************************
   *
   *
   */
  Controller.prototype.addNewTodo = function (event) {
    console.log('[Controller] addNewTodo');

    var self = this;
    if (event.keyCode === 13 && event.target.value !== '') {
      self.model.create(
        event.target.value, null,
        function () {
          self.setView();
        }
      );
      var input = qs(null, namespace.NEW_TODO);
      input.value = '';
      input.focus();
    }
  }


  /********************************************
   *
   * @param: identifier is the information identifies which is clicked
   *
   *  {
   *    uid: li.data-id
   *    index: index number of the current ul.todo-list content array,
   *    completed: the state of the toggle button. true for checked, false for unchecked
   *  }
   *
   * todo-listの各要素のいずれかから発火して「どれか」を取得する
   * self.model.readで「どれか」をもとに現在のcompletedを取得する
   * self.modelupdateでstore.todo-appの既存のアイテムを更新する
   * コールバックとしてsetViewを渡す(更新されたstore.todo-appのデータをそのまま取得するため)
   *
   *
   */
  Controller.prototype.toggle = function (data) {
    console.log('[Controller] toggle');
    var self = this;
    var completed;

    // checkedかどうか、ここで確認して...
    completed = self.model.search(data.uid).completed;
    console.log(completed);
    self.model.update(
      data.uid,
      // ここで真偽値を逆転させる
      // MVC的にはmodelのなかで変更すべきだろうけど後回し...
      { completed: !completed },
      function () {
        self.setView();
      }
    );
  }


  /***************************************
   * 現在のtodoのchecked状況はまばらである -> 全部checkedにする
   * 全部checkedである -> 全部uncheckedにする
   * 全部uncheckedである -> 全部checkedにする
   *
   */
  Controller.prototype.toggleAll = function () {
    console.log('[Controller] toggleAll');
    var self = this;
    var result;


    // 一旦todo-listの各completed値からなる配列を生成して
    var todos = self.model.read(null);
    var completeStatus = todos.map(function (todo, index) {
      return todo.completed;
    });

    // falseが含まれていれば全部trueにする、そうでなければ全部falseにする
    // resultはtrueならばcheckedにする
    result = completeStatus.includes(false) ? true : false;

    // storeへ書き込む
    for (var i = 0; i < todos.length; i++) {
      // console.log(todos[i]);
      self.model.update(
        todos[i].id,
        {
          id: todos[i].id,
          title: todos[i].title,
          completed: result
        },
        null
      );
    }
    self.setView();
  }


  /*************************************************
   *
   *
   */
  Controller.prototype.destory = function (data) {
    console.log('[Controller] destory');
    var self = this;

    self.model.delete(
      data.uid,
      function () { self.setView(); }
    );
  }



  /******************************************
   * editDoneHandler
   * 
   *  @param: 
   *    event : Two type of event will be got.
   *            KeyboardEvent for input event listener,
   *            MouseEvent for document event listener.
   *      
   *    target: li [data-id] which is editing.
   * 
   *    callback: function to remove addEventListener from document.
   * 
   * editDoneHandler is the callback function for two events.
   * "keypress" and "click".
   * 
   * 
   */
  Controller.prototype.editDoneHandler = function (event, target, callback) {
    console.log('[Controller] edit done handler');
    var self = this;

    if (event.type === "click") {
      if (event.path.includes(target)) {
        return;
      }
      else {
        self.view.transformView(false, target);
        document.removeEventListener('click', callback);
      }
    }
    else if (event.type === "keypress") {

      if (event.key === "Enter" && event.target.value !== "") {
        // update the title
        console.log("send new title");
        console.log(target.dataset.id);
        self.model.update(
          target.dataset.id,
          { title: event.target.value },
          function () { self.setView(); }
        );

      }
      else if (event.key === "Enter") {
        self.view.transformView(false, target);
        document.removeEventListener('click', callback);
      }
    }
  }



  /*******************************************
   * dbl clicked
   *
   *
   * - need to add click event listener to 'document' when the element is editting
   * -
   * 
   * dblclickを一度発火させたら、editDoneするかキャンセルするまで
   * dblclickイベントハンドラを停止しておかないといけない
   *
   */
  Controller.prototype.dblClicked = function (data) {
    console.log('[Controller] dbl-click');
    var self = this;

    console.log(data);

    self.view.editItem(
      data,
      function (event, target, callback) { self.editDoneHandler(event, target, callback) });



  }


  /******************************************
   * clearCompleted
   *
   *  clear all todo[].completed to false.
   *  clear "Mark all as completed" check box.
   *  Hash will not be changed.
   *
   *
   */
  Controller.prototype.clearCompleted = function () {
    console.log('[Controller] clear completed');
    var self = this;

    self.model.read(
      function (param) {
        param.forEach(function (todo) {
          self.model.update(
            todo.id,
            {
              id: todo.id,
              title: todo.title,
              completed: false
            },
            null
          );
        });
        self.setView();
      }
    );
    self.setHandlerToDynamics();
  }



  /************************************************
   * _filter
   *
   *
   */
  Controller.prototype._filter = function () {
    console.log('[Controller] _filter');
    var self = this;
    var result;

    var todos = self.model.read();
    // bools : only false array
    var bools = todos.filter(function (todo) {
      return todo.completed === false;
    });

    // Is bools empty ?
    // true :  check toggle-all box
    // false : uncheck togle-all box
    result = bools.length > 0 ? false : true;


    // render toggle all status
    todos.length > 0
      ? self.view.toggleAllStatus(result)
      : self.view.toggleAllStatus(false);
    // render active todos count
    self.view.renderCount(bools.length);
    // render 'clear-completed'
    self.view.visibleClearCompleted(todos.length - bools.length);
  }




  /*********************************************
   * set handler to dynamics
   *
   * Add event listner to elements which is created every rendered time.
   */
  Controller.prototype.setHandlerToDynamics = function () {
    console.log('[Controller] set handler to dynamics');

    var self = this;

    self.view.bindEventListener(namespace.TOGGLE_CLICKED, self.toggle.bind(self));
    self.view.bindEventListener(namespace.DESTROY_CLICKED, self.destory.bind(self));
    self.view.bindEventListener(namespace.DBL_CLICKED, self.dblClicked.bind(self));
  }


  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
