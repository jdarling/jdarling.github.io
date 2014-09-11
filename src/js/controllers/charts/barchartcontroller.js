var controllers = controllers || new Controllers();

var BarChartController = function(container, data){
  var self = this;
  self.container = container;
  self.chart= Bar();
  applyChartConfiguration('chart', container, self.chart, ['width', 'height', 'identity', 'duration', 'style']);
  if(data){
    self.update(data);
  }
};

BarChartController.prototype.update = function(data){
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

controllers.register('BarChart', BarChartController);
