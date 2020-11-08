(function (window) {

    var Store = function (database_name) {
        var self = this;

        this.dbName = database_name;

        if (!localStorage.getItem(self.dbName)) {
            var todo = [
                // {id: String, title: String, done: Boolean},
                // {id: String, title: String, done: Boolean},
                // {id: String, title: String, done: Boolean},
            ];
            localStorage.setItem(self.dbName, JSON.stringify(todo));
        }
    }


    /****************************************
     * write
     * 
     *      Usually write new todo to todo database.
     *      If there are more than two parameters,
     *      overwrite existing data.
     *      
     * 
     *      @param: 
     * 
     * 
     * 今度はtodo-llistのトグルボタンを押してもチェックされたままになっちゃったよ
     * callbackでsetView渡してから...
     * 
     */
    Store.prototype.write = function (data, callback) {
        console.log('[Store] write');
        var self = this;
        callback = typeof callback === 'function' ? callback : function () { };
        var todos = JSON.parse(localStorage.getItem(self.dbName));

        console.log(data);
        console.log(callback);

        // overwrite exisiting item
        if (data.id) {
            for (var i = 0; i < todos.length; i++) {
                if (todos[i].id === data.id) {
                    for (var key in data) {
                        todos[i][key] = data[key];
                    }
                    break;
                }
            }

            localStorage.setItem(self.dbName, JSON.stringify(todos));
            callback(todos);
        }
        // add new item
        else {
            data.id = getUniqueStr();
            todos.push(data);
            localStorage.setItem(self.dbName, JSON.stringify(todos));
            callback(todos);
        }
    }


    /**************************************
     * find
     * 
     *      find item from collection
     * 
     * 
     */
    Store.prototype.find = function (id) {
        console.log('[Store] find');
        var self = this, match = null;

        var todos = JSON.parse(localStorage.getItem(self.dbName));

        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
                match = todos[i];
                break;
            }
        }

        console.log(match);
        return match;
    }


    /****************************************
     * read 
     *      @param: 
     * 
     * 
     */
    Store.prototype.findAll = function () {
        console.log('[Store] findAll');
        var self = this;

        return JSON.parse(localStorage.getItem(self.dbName));
    }


    Store.prototype.deleteItem = function (id, callback) {
        console.log('[Store] delete Item');
        var self = this;


        var updatedTodos = JSON.parse(localStorage.getItem(self.dbName))
            .filter(function (todo) {
                return todo.id !== id;
            });

        localStorage.setItem(self.dbName, JSON.stringify(updatedTodos));
        callback();
    }



    /*********************************************
     * drop
     * 
     *      Deletes all data registered by this.dbName.
     * 
     */
    Store.prototype.drop = function () {
        console.log('[Store] drop');

        var self = this;
        var todos = [];
        localStorage.setItem(self.dbName, JSON.stringify(todos));
    }


    window.app = window.app || {};
    window.app.Store = Store;
})(window);