backbone-combobox
================

Backbone based Select component.

More info soon...

## Installation

```shell
  npm install backbone-combobox --save
```

## Sample

![Sample](https://raw.githubusercontent.com/SlideWorx/backbone-combobox/master/demo/combobox.gif)

## Usage

```js
var Combobox = require('backbone-combobox');

// create model instance, fill it with data and select item
var model = new Combobox.Model({});
model.setData([
  {id: '1', text: '1 (title specified)', title: 'Title text'},
  {id: '2', text: '2'},
  {id: '3', text: '3 (disabled)', disabled: true},
  {id: '1.1', text: '1.1', parentId: '1'},
  {id: '1.2', text: '1.2', parentId: '1'}
  // ...
]);
model.set({selectedId: '1.1'});

// create view instance and pass it model created above
var view = new Combobox.View({ model: model });

// render and append
view.render().$el.appendTo('#target');
```

## Contributing

First of all: `npm install`

Then to see example use of combobox please install `webpack-dev-server` and then run `npm run dev`.

Please use [mversion](https://github.com/mikaelbr/mversion) (`npm install -g mversion`) to bump version numbers.

## Release History

### 0.1.1 (03.06.2016)
* Updated README.md
* Added demo code
* `npm run dev` for development environment
* Changed way of including template files (tpl -> text)

### 0.1.0 (02.06.2016)
Initial release
