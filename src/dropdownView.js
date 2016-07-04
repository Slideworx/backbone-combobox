define(function(require, exports, module) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var _ = require('lodash');
  var classnames = require('classnames');

  var WINDOW = $(window);
  var DOCUMENT = $(document);
  var BODY = $('body');

  var ANIMATION_CLASSES = {
    below: 'c-combobox__dropdown--from-top',
    onRight: 'c-combobox__dropdown--from-left',
    onLeft: 'c-combobox__dropdown--from-right',
    above: 'c-combobox__dropdown--from-bottom'
  };

  module.exports = Backbone.View.extend({
    className: 'c-combobox__dropdown',
    tagName: 'ul',

    events: {
      'click .js-combobox__item': 'selectItem',
      'mouseenter .js-combobox__item': 'makeActive',
      'mouseleave .js-combobox__item': 'removeActive',
      'mouseenter .js-combobox__item.has-children': 'displayChildren'
    },

    initialize: function(options) {
      this.template = options.template;
      this.items = options.items;
      this.right = typeof options.right !== 'undefined' ? !!options.right : true;
      this.first = typeof options.first !== 'undefined' ? !!options.first : true;
      this.active = false;

      if (this.first) {
        this.captureClickOnBodyHandler = this._closeCombobox.bind(this);
        BODY[0].addEventListener('click', this.captureClickOnBodyHandler, true);

        this.listenTo(this.model, 'change:isOpen', this.toggleEventListener);
      }
    },

    // event handlers
    // --------------
    selectItem: function(ev) {
      var index = ev.target.getAttribute('cid');
      var selectedItem = this.items[index];

      this.model.selectItem(selectedItem.get('id'));
    },

    makeActive: function() {
      this.active = true;
      this.removeDropdown();
    },

    removeActive: function() {
      this.active = false;
    },

    displayChildren: function(event) {
      var $currentTarget = this.$(event.currentTarget);
      var hoveredModel = this.items[$currentTarget.attr('cid')];
      var children = hoveredModel.treeGetChildren();

      this.renderDropdown(children, $currentTarget);
    },

    /**
     * Depending on model's isOpen property function will add or remove eventListener at capturing phase.
     *
     * @param {object} model Dropdown (Backbone) model.
     * @param {boolean} isOpen Flag indicating that dropdown is open.
     */
    toggleEventListener: function(model, isOpen) {
      if (isOpen) {
        // handle event at capturing phase (first phase going from bottom up)
        this.captureClickOnBodyHandler = this._closeCombobox.bind(this);
        BODY[0].addEventListener('click', this.captureClickOnBodyHandler, true);
      } else {
        // unbind click listener from body
        BODY[0].removeEventListener('click', this.captureClickOnBodyHandler, true);
      }
    },

    _closeCombobox: function(event) {
      // if something else than dropdown item has been clicked...
      if (!$(event.target).hasClass('js-combobox__item')) {
        // prevent propagation of event to bubble up
        event.stopImmediatePropagation();

        // hide all dropdowns
        this.closeWithoutSelecting();
      }
    },

    render: function() {
      this.$el.html(this.template(
        this.items.map(this._itemMapper.bind(this))
      ));

      if (!!this.model.get('theme')) {
        this.$el.addClass('t-combobox--' + this.model.get('theme'));
      }

      WINDOW
        .one('resize.combobox', this.closeWithoutSelecting.bind(this))
        .one('keyup.combobox', this.closeWithoutSelecting.bind(this));

      DOCUMENT
        .on('wheel.combobox', this.checkWheelEvent.bind(this));

      return this;
    },

    closeWithoutSelecting: function() {
      this.model.set({isOpen: false}, {validate: true});
    },

    checkWheelEvent: function() {
      // event will be called on each opened dropdown so that we have to distinguish if it's active dropdown
      if (this.active) {
        this.removeDropdown();
      }
    },
    /* @todo Move to some provider or model */
    _itemMapper: function(item) {
      var selectedItem = this.model.getSelectedItem();
      var mItem = item.toJSON();
      var additionalClasses = {};

      if (!item.get('title')) { // if there is not specified title - copy text value.
        mItem.title = item.get('text');
      }

      // has-children
      additionalClasses['has-children'] = _.isFunction(item.treeGetChildren) && !_.isEmpty(item.treeGetChildren());

      // is-selected & is-selected-path
      if (selectedItem && selectedItem.get('id') !== null) { // if has selected item
        if (item.get('id') !== null) { // if mapped item isn't notSelectedItem
          additionalClasses['is-selected'] = item.get('id') === selectedItem.get('id');
          additionalClasses['is-selected-path'] = item.hasTreeAncestor(selectedItem);
        }
      }

      // is-not-selectable
      additionalClasses['is-not-selectable'] = item.get('disabled') === true;

      mItem.class = classnames(mItem.class, additionalClasses);

      return mItem;
    },

    remove: function() {
      // take off attached combobox events when first dropdown has been removed
      if (this.first) {
        WINDOW.off('.combobox');
        DOCUMENT.off('.combobox');
        BODY[0].removeEventListener('click', this.captureClickOnBodyHandler, true);
      }

      if (this._dropdownView) {
        this._dropdownView.remove();
        this._dropdownView = undefined;
      }

      Backbone.View.prototype.remove.call(this);
    },

    renderDropdown: function(children, $target) {
      this.removeDropdown();

      this._dropdownView = new this.constructor({
        template: this.template,
        first: false,
        model: this.model,
        items: children,
        right: (this.first) ? true : this.right // passing this value causes that 'zig-zag' submenu effect
      });

      this._dropdownView.render().$el.appendTo('body');
      this._dropdownView.setPosition($target, false);
    },

    removeDropdown: function() {
      if (this._dropdownView) {
        this._dropdownView.remove();
      }
    },

    /**
     * Sets position of view according to some other view.
     *
     * Function in general try to position view the way it fits on screen. It will will bump menu to other side
     * if it won't fit. If this happens it will store corresponding value in local variable (this.right).
     *
     * Depending if it's first or next item position View on the side or below/above parent item.
     *
     * Also if model has `isAnimated` set to true it will add correct classes to dropdown.
     *
     * @param {object} $parentView JQuery pointer to DOM element.
     * @param {boolean} first Flag indicating if this view should be treated as first dropdown.
     *
     * @todo Move to provider.
     */
    setPosition: function($parentView, first) {
      var animationClass;
      this.first = first;

      if (this.model.get('isAnimated')) {
        this.$el.removeClass(_.values(ANIMATION_CLASSES).join(' '));
      }

      var parentRect = $parentView[0].getBoundingClientRect();

      // It's required to set `min-width` here because width of element can be too small.
      this.$el.css({minWidth: parentRect.width});

      var dropdownRect = this.$el[0].getBoundingClientRect();

      var properties = {
        top: this.first ? parentRect.bottom : parentRect.top
      };

      // Logic below flips dropdown when it won't fit within window and applies correct animation classes
      // ===

      // Vertical checks
      // ---
      if (this.first) {
        animationClass = ANIMATION_CLASSES.below;

        if (parentRect.bottom + dropdownRect.height > window.innerHeight) {
          properties.top = parentRect.top - dropdownRect.height;
          animationClass = ANIMATION_CLASSES.above;
        }
      }

      // Horizontal checks
      // ---
      if (this.right === true && this.first === true) {
        properties.left = parentRect.right - dropdownRect.width;

        // dropdown won't fit within window
        if (parentRect.right - dropdownRect.width < 0) {
          this.right = false;

          properties.left = parentRect.left;
        }
      }

      if (this.right === true && this.first === false) {
        animationClass = ANIMATION_CLASSES.onRight;
        properties.left = parentRect.right;

        // dropdown won't fit within window
        if (properties.left + dropdownRect.width > window.innerWidth) {
          this.right = false;

          properties.left = parentRect.left - dropdownRect.width;
          animationClass = ANIMATION_CLASSES.onLeft;
        }
      }

      if (this.right === false && this.first === true) {
        properties.left = parentRect.left;

        // dropdown won't fit within window
        if (parentRect.left + dropdownRect.width > window.innerWidth) {
          this.right = true;

          properties.left = parentRect.right;
        }
      }

      if (this.right === false && this.first === false) {
        animationClass = ANIMATION_CLASSES.onLeft;
        properties.left = parentRect.left - dropdownRect.width;

        // dropdown won't fit within window
        if (properties.left < 0) {
          this.right = true;

          properties.left = parentRect.right;
          animationClass = ANIMATION_CLASSES.onLeft;
        }
      }

      this.$el.css(properties);

      if (this.model.get('isAnimated') === true) {
        this.$el.addClass(animationClass);
      }
    }
  });
});
