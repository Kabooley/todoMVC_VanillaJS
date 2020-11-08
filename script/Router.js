////////////////////////////////////////////////////////////////////////
//  Router
// This constructor might not be needed
// Helper method will helps us instead....
// 

(function (window) {

    var Router = function () {
        this.routes = {};
    }


    Router.prototype.route = function (path, template) {
        var self = this;
        if (typeof template === "function") {
            self.routes[path] = template;
        }
        else {
            return;
        }
    }

    window.app = window.app || {};
    window.app.Router = Router;
})(window);