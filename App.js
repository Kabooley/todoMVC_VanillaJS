////////////////////////////////////////////////////
// GLOBAL VARIABLES
//
var namespace = {
  APPNAME: "todo-app",
  DBNAME: "todo-app-db",

  // element identifier
  NEW_TODO: ".new-todo",
  TODO_LIST: ".todo-list",
  TOGGLE_ALL: ".toggle-all",
  CLEAR_COMPLETED: ".clear-completed",
  TODO_COUNT: ".todo-count",
  TEMPORARY: ".temporary",

  // named event
  ADD_NEW_TODO: "add-todo", // 新規のtodoをTODO-APPへ追加する
  TOGGLE_CLICKED: "toggle-clicked",
  TOGGLE_ALL_CLICKED: "toggel-all-clicked",
  DESTROY_CLICKED: "destroy-clicked",
  SHOW_ALL: "show-all-todos",
  SHOW_ACTIVE: "show-only-active",
  SHOW_COMPLETED: "show-only-completed",
  DESTROY_ALL_COMPLETED: "destroy-all-completed",
  DBL_CLICKED: "double-clicked",
  CLEAR_COMPLETED_CLICKED: "clear-completed-clicked",
};

////////////////////////////////////////////////////
// HELPERS

var qs = function (scope, identifier) {
  return (scope || document).querySelector(identifier);
};

var qsa = function (scope, identifier) {
  return (scope || document).querySelectorAll(identifier);
};

// Route check will run when hashchange event has occured.
// So this must check the route and return route
var checkRoute = function () {
  var url = window.location.hash.slice(1) || "/";
  url = url === "" ? "/" : url;
  return url;
};

// unique string maker
// 11111111aaa11111 みたいな文字列を作成してくれるらしい
// コピペ
// (https://qiita.com/coa00/items/679b0b5c7c468698d53f)
var getUniqueStr = function (myStrong) {
  var strong = 1000;
  if (myStrong) strong = myStrong;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
};

// String to Boolean
//
var convertStr2Bool = function (str) {
  if (typeof str !== "string") {
    return Boolean(str);
  }
  try {
    var obj = JSON.parse(str.toLowerCase());
    return obj == true;
  } catch (e) {
    return str != "";
  }
};

// boolean

////////////////////////////////////////////////////
// App
var App = function (app_name) {
  this.router = new app.Router();
  this.template = new app.Template();
  this.store = new app.Store(app_name);
  this.view = new app.View(this.template);
  this.model = new app.Model(this.store);
  this.controller = new app.Controller(this.view, this.model);
};

/////////////////////////////////////////////////////
// 実行命令
//
var todoapp = new App(namespace.APPNAME);

window.addEventListener("load", function () {
  console.log("load");
  todoapp.controller.setView();
});

window.addEventListener("hashchange", function (event) {
  console.log("hash change");
  console.log(event);
  todoapp.controller.setView();
});

/************************************
 *
 * 残る課題
 *
 * css
 * これまでに立ちはだかった壁をまとめる　-> Qiitaにアウトプットする
 * りふぁくたりんぐ(リファクタリングとは言ってない)
 * test
 * githubをつかっていろいろできるようになる
 *
 */
