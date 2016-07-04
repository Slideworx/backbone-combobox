define(function(require, exports, module) {
  var Backbone = require('backbone');
  var _ = require('lodash');
  var toggleTemplate = _.template(require('text!./comboboxView.ejs'));
  var dropdownTemplate = _.template(require('text!./dropdownView.ejs'));
  var DropdownView = require('./dropdownView');
  var classnames = require('classnames');

// properties of model which changes causes call of render function
  var renderProperties = ['selectedId', 'isDisabled', 'isLoading', 'theme', 'isWarning', 'hasError'];

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
        .listenTo(this.model, 'change-combobox-toggle-classes', this.updateComboboxToggleClasses);
    },

    toggleDropDown: function(model, isOpen) {
      if (isOpen) {
        this.renderDropdown();
      } else {
        this.removeDropdown();
      }
    },

    render: function() {
      var classes = this.model.getComboboxToggleClasses();

      this.updateTheme();

      this.$el.html(
        this.toggleTemplate({
          classNames: classnames(classes),
          model: this.model
        })
      );

      return this;
    },

    updateComboboxToggleClasses: function(model) {
      var classes = this.model.getComboboxToggleClasses();
      var classesToRemove = Object.keys(classes).join(' ');
      var classesToAdd = classnames(classes);

      this.$('.js-combobox__toggle').removeClass(classesToRemove);
      this.$('.js-combobox__toggle').addClass(classesToAdd);
    },

    updateTheme: function() {
      if (!!this.model.get('theme')) {
        this.$el.addClass('t-combobox--' + this.model.get('theme'));
      } else {
        // removes all found theme classes
        // this.$el.removeClass(function(index, css) {
        //   return (css.match() || []).join(' ');
        // });
        this.el.setAttribute('class', this.el.getAttribute('class').replace(/\bt-combobox--\S+/g, ''));
      }
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
    },

    remove: function() {
      this.removeDropdown();
      Backbone.View.prototype.remove.call(this);
    },
  });
});
