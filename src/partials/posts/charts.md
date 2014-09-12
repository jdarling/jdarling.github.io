Charting with Markdown
======================

@@chart=LineChart
data-chart-x=d.text
data-chart-y=d.value
data-chart-colorize=d.color || d[0].color
@@data
    [
      {
        value: 100,
        color: 'blue',
        text: 'Test 1'
      },
      {
        value: 75,
        color: 'red',
        text: 'Test 2'
      }
    ]
@@chart

@@chart=BarChart
data-chart-x=d.text
data-chart-y=d.value
data-chart-colorize=d.color || d[0].color
@@data
    [
      {
        value: 100,
        color: 'blue',
        text: 'Test 1'
      },
      {
        value: 75,
        color: 'red',
        text: 'Test 2'
      }
    ]
@@chart

@@chart=PieChart
data-chart-value=d.value
data-chart-colorize=d.color || d[0].color
@@data
    [
      {
        value: 100,
        color: 'blue',
        text: 'Test 1'
      },
      {
        value: 75,
        color: 'red',
        text: 'Test 2'
      }
    ]
@@chart

@@chart=ScatterChart
data-chart-x=d.x
data-chart-y=d.y
data-chart-value=d.value
data-chart-colorize=d.color || d[0].color
@@data
    [
      {
        value: 100,
        color: 'blue',
        text: 'Test 1',
        x: 5,
        y: 10
      },
      {
        value: 75,
        color: 'red',
        text: 'Test 2',
        x: 10,
        y: 20
      }
    ]
@@chart

@@chart=MindMap
  {
    'name': 'Root',
    'children': [
      {
        'name': 'Branch 1',
        'children': [
          {'name': 'Leaf 3'},
          {'name': 'Leaf 4'}
        ]
      },
      {'name': 'Branch 2'}
    ]
  }
@@chart

@@chart=TableView
data-table-cols=[/
  {title: 'X', value: 'x'},/
  {title: 'Y', value: 'y'},/
  {title: 'Text', value: 'text'},/
  {/
    title: 'Color',/
    value: function(d){/
      var color = d.color;/
      return '&lt;span style=\'background: '+color+'; padding: 0 1em; color: black;\'&gt;'+color+'&lt;/span&gt;';/
    }/
  }/
]
@@data
[
  {
    value: 100,
    color: 'blue',
    text: 'Test 1',
    x: 5,
    y: 10
  },
  {
    value: 75,
    color: 'red',
    text: 'Test 2',
    x: 10,
    y: 20
  }
]
@@chart
