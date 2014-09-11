var controllers = controllers || new Controllers();

var LineChartController = function(container, data){
  var self = this;
  self.container = container;
  self.chart= Line();
  applyChartConfiguration('chart', container, self.chart, ['width', 'height', 'identity', 'duration', 'style']);
  if(data){
    self.update(data);
  }
};

LineChartController.prototype.update = function(data){
  var self = this;
  self.data = data = data || self.data;
  if(!data){
    return;
  }
  d3.select(self.container)
    .datum(data)
    .call(self.chart)
    ;
};

controllers.register('LineChart', LineChartController);
