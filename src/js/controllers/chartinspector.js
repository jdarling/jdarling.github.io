var controllers = controllers || new Controllers();

var ChartInspectorController = function(container, data){
  var self = this;
  
  var templateEls = els(container, '[data-template-property]')||{};
  var templates = self.templates = {};
  var i, l=templateEls.length, src, name;
  var charts = els('[data-controller$=Chart],[data-controller$=View]');
  
  self.container = container;
  
  for(i=0; i<l; i++){
    name = templateEls[i].attributes['data-template-property'].nodeValue;
    templates[name] = Handlebars.compile(templateEls[i].innerHTML);
  }
  
  charts.forEach(function(chart){
    var btn = document.createElement('button');
    btn.setAttribute('title', 'Configure Chart');
    btn.style.float = 'right';
    btn.style.cursor = 'pointer';
    btn.setAttribute('class', 'ink-button btn-configure');
    btn.innerHTML = '<i class="fa fa-gear" />';
    self.bindEditClick(btn, chart);
    chart.appendChild(btn);
  });
};

ChartInspectorController.prototype.bindEditClick = function(elem, chart){
  var self = this;
  if(elem && !chart){
    chart = elem;
  }
  elem.onclick = function(){
    self.inspect(chart);
    return false;
  };
};

ChartInspectorController.prototype.inspect = function(chart){
  var self = this;
  
  var properties = getChartPropertyValues(chart);
  var outlet = el(self.container, '[data-properties]')||container;
  var key, value, propEdit, edits = '', template, valType;
  
  if(self._checkEditors){
    clearTimeout(self._checkEditors);
  }

  outlet.innerHTML = '';
  
  for(key in properties){
    value = properties[key];
    valType = typeof(value);
    template = self.templates[key]||self.templates[valType];
    if(!template && valType === 'boolean'){
      value = ''+value;
    }
    template = template||self.templates.default;
    propEdit = template({
      propertyName: key,
      propertyValue: value
    }, {helpers: handlebarsHelpers});
    edits += propEdit;
  }
  outlet.innerHTML = edits;
  
  els(outlet, 'textarea.codemirror').forEach(function(textArea){
    CodeMirror.fromTextArea(textArea, {
      lineNumbers: true
    });
  });
  
  //*
  var checkEditors = function(){
    var editors = els(outlet, '.property-editor');
    var container = chart;
    self._checkEditors = false;
    editors.forEach(function(editor){
      var propName = editor.name;
      var value = editor.value, stoValue = properties[propName], valType = typeof(stoValue);
      var valIsSpecial = ['object', 'boolean', 'number'].indexOf(valType) > -1;
      
      if(valType==='undefined'){
        //console.log(propName, 'undefined');
        stoValue = '';
        console.log(propName, valIsSpecial, stoValue, value, value != stoValue);
      }
      
      if(valIsSpecial){
        //console.log(propName, 'is special', valType, stoValue, value);
        stoValue = JSON.stringify(stoValue);
        try{
          value = JSON.stringify((new Function('return '+value))());
        }catch(e){}
      }
      
      if(value != stoValue){
        //console.log('value different');
        console.log(propName, stoValue+'=>'+value, typeof(stoValue)+'=>'+typeof(value));
        properties[propName] = value;
        setChartProperty(container, propName, value);
      }
    });
    self._checkEditors = setTimeout(checkEditors, 100);
  }
  checkEditors();
  /*
  editors.forEach(function(editor){
    editor.onkeyup = editor.onblur = function(){
      var propName = this.getAttribute('name');
      var value = this.value;
      console.log(this, propName, value);
      setChartProperty(chart, propName, value);
    };
  });
  */
};

ChartInspectorController.prototype.teardown = function(){
  var self = this;
  if(self._checkEditors){
    clearTimeout(self._checkEditors);
  }
  delete self.container;
  self.container = null;
};

controllers.register('ChartInspector', ChartInspectorController);
