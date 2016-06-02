backbone-tree
=============

A node module providing mixins, model and collection which may help working with tree structures.

More info soon...

## Installation

```shell
  npm install backbone-combobox --save
```

## Usage

```js
var Combobox = require('backbone-combobox');

// create model instance, fill it with data and select item
var model = new Combobox.Model();
model.setData([
  {id: '1', text: 'Main'},
  {id: '1.0', text: 'Subelement', parentId: '1'},
  {id: '1.1', text: 'Subelement', parendId: '1'}
  // ...
]);
model.set('selectedId', '1.1');

// create view instance and pass it model created above 
var new Combobox.View({
  model: model
});

// render and append
$('#combobox-target').empty().append(this.view.render().el);
```

## Contributing

Please use [mversion](https://github.com/mikaelbr/mversion) (`npm install -g mversion`) to bump version numbers.

## Release History

* 0.1.0 Initial release
