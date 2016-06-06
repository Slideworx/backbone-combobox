define(function(require, exports, module) {
  require('./src/style.scss');

  module.exports = {
    View: require('./src/comboboxView'),
    Model: require('./src/comboboxModel'),
    DropdownView: require('./src/dropdownView')
  };
});
