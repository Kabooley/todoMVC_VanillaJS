(function (window) {

    var Template = function () {
        this.defaultTemplate
            = '<li data-id="{{id}}" class="{{completed}}">'
            + '<div class="view">'
            + '<input class="toggle" type="checkbox" {{checked}}>'
            + '<label for="toggle">{{title}}</label>'
            + '<button class="destroy"></button>'
            + '</div>'
            + '</li>';
	}
	

	var htmlEscaper = function (string) {
		// 注意！'&'は最初にもって来ないとエスケープ記号の&を変換してしまうぞ!
		return string
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/`/g, '&#x60;')
		.replace(/\\/g, '&#x27;');
	}


	// 
	var isTitleHtml = function (string) {
		var re = /[<>\\"'`]/g;
		var regularExpressObject = new RegExp(re);
		return string && regularExpressObject.test(string)
			? htmlEscaper(string)
			: string;
	}


    /**************************************
     * @param todoList : Storeのローカルストレージに保存されている
     *          todoの中身全部
     *
     */
    Template.prototype.getDefaultList = function (todoList) {
        console.log('[Template] getDefaultList');

        var self = this;
        var view = '';

        for (var i = 0; i < todoList.length; i++) {
            // console.log(todoList[i]);
            var template = self.defaultTemplate;
            var id = todoList[i].id;
            var title = isTitleHtml(todoList[i].title);
            // var title = todoList[i].title;
            var completed = todoList[i].completed;
			var didCheck = todoList[i].completed ? 'checked' : '';
			
			console.log(title);


            template = template.replace('{{id}}', id);
            // 本当は正規表現使ってHTML判定されないように気を付けないといけない
            // 正規表現めんどいのであと
            template = template.replace('{{title}}', title);
            template = template.replace('{{completed}}', completed);
            template = template.replace('{{checked}}', didCheck);

            view = view + template;
        }

        return view;
    }



    window.app = window.app || {};
    window.app.Template = Template;

})(window);
