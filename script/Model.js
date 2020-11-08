(function (window) {


    var Model = function (store) {
        this.store = store;
    }


    /*****************************************
     * create
     *  
     *      @param: value is String data that to write to storage as new todo
     *      @param: id , if this is not null, overwrite exist todo of collection
     *      @param: callback is function. If it's not function or empty, 
     *                     then do nothing.
     * 
     * mainly add new item to storage in store instance
     * 
     * 
     * 
     */
    Model.prototype.create = function (value, id, callback) {
        console.log('[Model] create');
        var self = this;

        var newItem = {
            id: id,
            title: value,
            completed: false
        };

        self.store.write(newItem, callback);
    }



    /****************************************************
     * update
     * 
     * 
     * update exist item via parameter id.
     * 
     */
    Model.prototype.update = function (id, updatedData, callback) {
        console.log('[Model] update');
        var self = this;
        callback = callback || function () { };
        var updatedItem = {
            id: id,
        }

        // titleもcompletedもあったもなくても対応できるようにする
        Object.keys(updatedData).forEach(function (key) {
            if (key === 'title') {
                updatedItem.title = updatedData.title;
            }
            if (key === 'completed') {
                updatedItem.completed = updatedData.completed;
            }
        });


        self.store.write(updatedItem, callback);
    }


    /*******************************************
     * 
     * read
     * 
     * 
     * @param
     * 
     * if ths id was passed as the argument,
     * then invoke store.find method as callback parameter.
     * 
     *  
     */
    Model.prototype.read = function (callback) {
        console.log('[Model] read');
        var self = this;
        if (typeof callback === 'function') {
            callback(self.store.findAll());
        }
        else {
            return self.store.findAll();
        }
    }


    /******************************************
     * search
     * 
     * so far,
     * this returns an item of store.todo-app
     * 
     */
    Model.prototype.search = function (id) {
        console.log("[Model] search");
        var self = this;
        id = id || null;

        return self.store.find(id);
    }



    Model.prototype.delete = function (id, callback) {
        console.log("[Model] delete");
        var self = this;
        callback = callback || function () { };

        console.log(id);
        console.log(callback);

        self.store.deleteItem(id, callback);
    }


    window.app = window.app || {};
    window.app.Model = Model;
})(window);