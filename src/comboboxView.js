var Backbone = require('backbone');
var _ = require('lodash');
var toggleTemplate = _.template(require('txt!./comboboxView.ejs'));
var dropdownTemplate = _.template(require('txt!./dropdownView.ejs'));
var DropdownView = require('./dropdownView');
var classnames = require('classnames');

// properties of model which changes causes call of render function
var renderProperties = ['selectedId', 'isDisabled', 'isLoading', 'isOpen', 'theme', 'isWarning', 'hasError'];

module.exports = Backbone.View.extend({
  toggleTemplate: toggleTemplate,
  dropdownTemplate: dropdownTemplate,
  dropdownView: DropdownView,

  className: 'c-combobox',

  events: {
    'click .js-combobox__toggle:not(.is-disabled)': 'toggle'
  },

  initialize: function() {
    this._dropdownView = null;
    this
      .listenTo(this.model, 'change:isOpen', this.toggleDropDown)
      .listenTo(this.model, 'change:' + renderProperties.join(' change:'), this.render)
      .listenTo(this.model.getData(), 'reset', this.render)
  },

  toggleDropDown: function(model, isOpen) {
    if (isOpen) {
      this.renderDropdown();
    } else {
      this.removeDropdown();
    }
  },

  render: function() {
    var classes = {
      'is-disabled': this.model.get('isDisabled'),
      'is-open': this.model.get('isOpen'),
      'is-loading': this.model.get('isLoading'),
      'is-warning': this.model.get('isWarning'),
      'has-error': this.model.get('hasError')
    };

    if (!!this.model.get('theme')) {
      this.$el.addClass('t-combobox--' + this.model.get('theme'));
    } else {
      // removes all found theme classes
      // this.$el.removeClass(function(index, css) {
      //   return (css.match() || []).join(' ');
      // });
      this.el.setAttribute('class', this.el.getAttribute('class').replace(/\bt-combobox--\S+/g, ''));
    }

    var selectedItem = this.model.getSelectedItem();

    this.$el.html(
      this.toggleTemplate({
        classNames: classnames(classes),
        selected: selectedItem,
        label: this.model.getLabel()
      })
    );

    return this;
  },

  toggle: function(e) {
    e.stopPropagation();
    this.model.toggleOpen();
  },

  close: function() {
    this.model.toggleOpen(false);
  },

  renderDropdown: function() {
    this.removeDropdown();

    this._dropdownView = new this.dropdownView({
      template: this.dropdownTemplate,
      model: this.model,
      items: this.model.getRootItems(),
      right: false
    });

    this._dropdownView.render().$el.appendTo('body');
    this._dropdownView.setPosition(this.$el, true);
  },

  removeDropdown: function() {
    if (this._dropdownView) {
      this._dropdownView.remove();
    }
  }
});