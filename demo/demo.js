require('./../src/style.scss');
require('./demo.scss');

var Combobox = require('./../index');

// create model instance, fill it with data and select item
var model = new Combobox.Model({});
var data = [
  {id: '1', text: '1 (title specified)', title: 'Title text'},
  {id: '2', text: '2', parentId: undefined},
  {id: '3', text: '3 (disabled)', parentId: null, disabled: true},
  {id: '1.1', text: '1.1', parentId: '1'},
  {id: '1.2', text: '1.2', parentId: '1'},
  {id: '1.3', text: '1.3 (disabled)', parentId: '1', disabled: true},
  {id: '1.4', text: '1.4', parentId: '1'},
  {id: '1.5', text: '1.5', parentId: '1'},
  {id: '1.6', text: '1.6 (disabled)', parentId: '1', disabled: true},
  {id: '1.7', text: '1.7 (divider-after)', parentId: '1', class: ['has-divider-after']},
  {id: '1.8', text: '1.8', parentId: '1'},
  {id: '1.9', text: '1.9', parentId: '1'},
  {id: '1.10', text: '1.10 (divider-before)', parentId: '1', class: ['has-divider-before']},
  {id: '1.11', text: '1.11', parentId: '1'},
  {id: '1.12', text: '1.12', parentId: '1'},
  {id: '1.2.1', text: '1.2.1', parentId: '1.2'},
  {id: '1.2.1.1', text: '1.2.1.1', parentId: '1.2.1', disabled: true},
  {id: '1.2.1.1.1', text: '1.2.1.1.1', parentId: '1.2.1.1'},
  {id: '1.2.1.1.1.1', text: '1.2.1.1.1.1', parentId: '1.2.1.1.1'},
  {id: '1.2.1.1.1.1.1', text: '1.2.1.1.1.1.1', parentId: '1.2.1.1.1.1'},
  {id: '1.2.1.1.1.1.1.1', text: '1.2.1.1.1.1.1.1', parentId: '1.2.1.1.1.1.1'},
  {id: '1.2.1.1.1.1.1.1.1', text: '1.2.1.1.1.1.1.1.1', parentId: '1.2.1.1.1.1.1.1'},
  {id: '1.2.1.1.1.1.1.1.1.1', text: '1.2.1.1.1.1.1.1.1.1', parentId: '1.2.1.1.1.1.1.1.1'},
  {id: '1.2.1.1.1.1.1.1.1.1.1', text: '1.2.1.1.1.1.1.1.1.1.1', parentId: '1.2.1.1.1.1.1.1.1.1'},
  {id: '1.2.1.1.1.1.1.1.1.1.1.1', text: '1.2.1.1.1.1.1.1.1.1.1.1', parentId: '1.2.1.1.1.1.1.1.1.1.1'},
  {id: '1.2.1.1.1.1.1.1.1.1.1.1.1', text: '1.2.1.1.1.1.1.1.1.1.1.1.1', parentId: '1.2.1.1.1.1.1.1.1.1.1.1'},
  {id: '1.2.1.1.1.1.1.1.1.1.1.1.1.1', text: '1.2.1.1.1.1.1.1.1.1.1.1.1.1', parentId: '1.2.1.1.1.1.1.1.1.1.1.1.1'},
  {id: '1.2.1.1.1.1.1.1.1.1.1.1.1.1.1', text: '1.2.1.1.1.1.1.1.1.1.1.1.1.1.1', parentId: '1.2.1.1.1.1.1.1.1.1.1.1.1.1'},
  {id: '1.2.1.1.1.1.1.1.1.1.1.1.1.1.1.1', text: '1.2.1.1.1.1.1.1.1.1.1.1.1.1.1.1', parentId: '1.2.1.1.1.1.1.1.1.1.1.1.1.1.1'},
  {id: '3.1', text: '3.1 (disabled)', parentId: '3', disabled: true}
];
model.setData(data);
model.set({selectedId: '1.1'});

// create view instance and pass it model created above
var view = new Combobox.View({ model: model });

// render and append
view.render().$el.appendTo('#target');
