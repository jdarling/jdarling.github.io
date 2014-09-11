var controllers = controllers || new Controllers();

var MarkdownController = function(container, data){
  var self = this;
  var content = container.innerHTML;
  container.innerHTML = markdown.toHTML(content);
};

controllers.register('MarkdownController', MarkdownController);
