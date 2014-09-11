var controllers = controllers || new Controllers();

var SourceTypeController = function(container, data){
  var self = this;
  self.container = container;
  container.onchange = function(){
    self.show(container.value);
  };
  
  self.show(container.value);
};

SourceTypeController.prototype.show = function(type){
  var self = this;
  var containers = els(self.container.parentNode.parentNode, 'label.source-type');
  var i, l = containers.length;
  for(i=0; i<l; i++){
    containers[i].style.display = 'none';
  }
  containers = els(self.container.parentNode.parentNode, 'label.source-type.'+type);
  l = containers.length;
  for(i=0; i<l; i++){
    containers[i].style.display = '';
  }
};

controllers.register('SourceTypeController', SourceTypeController);

var ExecuteSourceController = function(container, data){
  var updateCharts = function(data){
    if(data){
      var charts = els('.vis-chart-output');
      var i, l = charts.length;
      for(i=0; i<l; i++){
        charts[i].controller.update(data);
      }
    }
  };
  container.onclick = function(e){
    e.preventDefault();
    var type = el('select.source-type').value;
    if(type==='raw'){
      var src = el('textarea.raw-input').value;
      var data = JSON.parse(src);
      updateCharts(data);
    }else{
      var url = el('label.source-type.url input').value;
      Loader.get(url, function(err, data){
        updateCharts(data);
      });
    }
    return false;
  };
};

controllers.register('ExecuteSourceController', ExecuteSourceController);
