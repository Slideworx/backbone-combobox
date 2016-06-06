webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	  __webpack_require__(1);

	  module.exports = {
	    View: __webpack_require__(5),
	    Model: __webpack_require__(15),
	    DropdownView: __webpack_require__(13)
	  };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	  var Backbone = __webpack_require__(6);
	  var _ = __webpack_require__(9);
	  var toggleTemplate = _.template(__webpack_require__(11));
	  var dropdownTemplate = _.template(__webpack_require__(12));
	  var DropdownView = __webpack_require__(13);
	  var classnames = __webpack_require__(14);

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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	module.exports = "<div class=\"c-combobox__toggle js-combobox__toggle <%- classNames %>\">\r\n  <div class=\"c-combobox__text-wrapper\">\r\n    <% if (typeof selected !== 'undefined') { %>\r\n      <% if (typeof selected.get('icon') !== 'undefined') { %><i class=\"<%- selected.get('icon') %>\"></i><% } %>\r\n      <span class=\"c-combobox__text\"><%= label %></span>\r\n    <% } else { %>\r\n      <!-- Nothing has been selected -->\r\n      &nbsp;\r\n    <% } %>\r\n  </div>\r\n  <i class=\"c-combobox__toggle-icon\"></i>\r\n</div>\r\n"

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = "<% forEach(function (item, index) { %>\r\n  <li cid=\"<%= index %>\"\r\n      title=\"<%- item.title %>\"\r\n      class=\"c-combobox__item js-combobox__item <%- item.class %>\">\r\n    <%= item.text %>\r\n  </li>\r\n<% }); %>\r\n"

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	  var Backbone = __webpack_require__(6);
	  var $ = __webpack_require__(8);
	  var _ = __webpack_require__(9);
	  var classnames = __webpack_require__(14);

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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	  var Backbone = __webpack_require__(6);
	  var _ = __webpack_require__(9);
	  var TreeCollection = __webpack_require__(16).Collection;

	  var VALIDATE = {validate: true};
	  var validateMsgTmpl = _.template(
	    'Property `<%- prop %>` by convention should contain <%- type %> value (<%- value %>)'
	  );

	  var startingWithIsOrHasRegex = /^(is|has).+$/;
	  var endingWithTextRegex = /^.+Text$/;

	  module.exports = Backbone.Model.extend({
	    defaults: function() {
	      return {
	        // Opens or closes dropdowns
	        isOpen: false,
	        // Put toggle into loading state. Also causes closing opened dropdown.
	        isLoading: false,
	        // disables toggle element. Immediately.
	        isDisabled: false,
	        // displays dropdowns animating them (adding specific CSS classes to dropdowns)
	        isAnimated: true,
	        // indicates if toggle element should be highlighted
	        isWarning: false,
	        // indicates that something wrong has happen
	        hasError: false,

	        // if hasNotSelectedItem === true, null points to that value
	        selectedId: null,

	        // creates an item to represent not selected value
	        hasNotSelectedItem: true,
	        // this text is displayed as not selected value. More details
	        notSelectedText: '- select -',

	        // text displayed to user when loading state has been switched on
	        loadingText: 'loading...',

	        // use this to style toggle and dropdowns. Eg. try 'inline'.
	        theme: '',

	        _data: new TreeCollection()
	      };
	    },

	    initialize: function() {
	      // if items has been changed (potentially removed) check if selected item still exists
	      this.listenTo(this.getData(), 'reset remove update change:id', this.checkIfSelectedIdStillExists);

	      // listen to change on disabled property
	      this.listenTo(this, 'change:isDisabled change:isLoading', this.closeDropdownWhenTrue);
	    },

	    /* @TODO move to provider */
	    validate: function(attrs) {
	      var errors = [];

	      // check conventions
	      _.forEach(attrs, function(value, property) {
	        // starting with 'is' or 'has' should be boolean type
	        if (startingWithIsOrHasRegex.test(property) && !_.isBoolean(value)) {
	          errors.push(validateMsgTmpl({prop: property, value: value, type: 'boolean'}));
	        }

	        if (endingWithTextRegex.test(property) && !_.isString(value)) {
	          errors.push(validateMsgTmpl({prop: property, value: value, type: 'string'}));
	        }
	      });

	      if (errors.length) {
	        return errors;
	      }
	    },

	    checkIfSelectedIdStillExists: function() {
	      var newProps = {hasError: false};

	      if (this.get('selectedId')) {
	        var selectedItem = this.findItem(this.get('selectedId'));

	        if (!selectedItem) {
	          newProps.hasError = true;
	          newProps.selectedId = null;
	        } else {
	          newProps.hasError = !!selectedItem.get('disabled')
	        }
	      }

	      this.set(newProps, VALIDATE);
	    },

	    getLabel: function() {
	      var selectedItem = this.getSelectedItem();
	      var label = selectedItem && selectedItem.get('text') ? selectedItem.get('text') : '&nbsp;';

	      return this.get('isLoading') && this.get('loadingText') ? this.get('loadingText') : label;
	    },

	    closeDropdownWhenTrue: function(model, property) {
	      if (!!property) {
	        this.toggleOpen(false);
	      }
	    },

	    isLoading: function() {
	      return this.get('isLoading') === true;
	    },

	    hasData: function() {
	      return !this.getData().isEmpty();
	    },

	    getData: function() {
	      return this.get('_data');
	    },

	    setData: function(data) {
	      this.getData().reset(data);
	    },

	    findItem: function(searchFor) {
	      if (this.isLoading()) {
	        return this.getLoadingItem();
	      }

	      if (_.isString(searchFor) || _.isNumber(searchFor)) {
	        return this.getData().get(searchFor);
	      }

	      // search for item on current item
	      return this.getData().findWhere(searchFor);
	    },

	    /**
	     * Selects item.
	     *
	     * @param {string|number|object} id Id of selected item or query which finds item.
	     * @param {boolean} force Force select item. May be used when you want to select disabled item.
	     * @param {boolean} remainOpen Should dropdown remain in the same open state after setting selected item.
	     */
	    selectItem: function(id, force, remainOpen) {
	      var item;

	      if (!!id) {
	        item = this.findItem(id);
	      }

	      if (!item) {
	        if (this.get('hasNotSelectedItem') === true) {
	          item = this.getNotSelectedItem();
	        } else {
	          throw new Error('Can\'t select item which couldn\'t be found');
	        }
	      }

	      if (item.get('disabled') === true && !force) {
	        return;
	      }

	      this.set({
	        selectedId: item.get('id'),
	        hasError: item.get('disabled') === true
	      }, VALIDATE);

	      if (!remainOpen) {
	        this.toggleOpen(false);
	      }
	    },

	    getSelectedItem: function() {
	      if (this.get('selectedId') === null && this.get('hasNotSelectedItem') === true) {
	        return this.getNotSelectedItem();
	      }

	      if (this.get('selectedId')) {
	        return this.findItem(this.get('selectedId'));
	      }
	    },

	    getNotSelectedItem: function() {
	      return new Backbone.Model({
	        id: null,
	        text: this.get('notSelectedText')
	      });
	    },

	    getLoadingItem: function() {
	      return new Backbone.Model({
	        id: null,
	        text: this.get('loadingText')
	      });
	    },

	    getRootItems: function() {
	      var items = this.getData().filter(function(item) {
	        var pId = item.get('parentId');
	        return _.isNull(pId) || _.isUndefined(pId) || pId === false;
	      });

	      if (this.get('hasNotSelectedItem') === true) {
	        var notSelecteItem = this.getNotSelectedItem();
	        items = [notSelecteItem].concat(items);
	      }

	      return items;
	    },

	    toggleOpen: function(forceValue) {
	      this.set({
	        isOpen: typeof forceValue === 'undefined' ? !this.get('isOpen') : !!forceValue
	      }, VALIDATE);
	    }
	  });
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  Mixins: __webpack_require__(17),
	  Model: __webpack_require__(18),
	  Collection: __webpack_require__(19)
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Backbone-tree Mixins
	 *
	 * Provides useful mixins which can be applied to Backbone.Model and used within Collection.
	 */

	var _ = __webpack_require__(9);

	module.exports = {
	  treeNodeId: 'id',
	  treeNodeParentId: 'parentId',

	  isTreeRoot: function() {
	    return this.treeGetParent() === undefined;
	  },

	  hasTreeAncestor: function(model) {
	    var modelAncestors = model.treeGetPath();

	    return modelAncestors.filter(function(ancestor) {
	        return ancestor.cid === this.cid;
	      }).length > 0;
	  },

	  treeGetPath: function(models) {
	    models = models || [];
	    models.unshift(this);

	    return this.isTreeRoot() ? models : this.treeGetParent().treeGetPath(models);
	  },

	  treeAddChild: function(model) {
	    model.set(this.treeNodeParentId, this.get(this.treeNodeId));
	    this.collection.add(model);
	  },

	  treeGetRoot: function() {
	    var parent = this.treeGetParent();

	    return parent ? parent.treeGetRoot() : this;
	  },

	  treeGetParent: function() {
	    if (!this.collection || typeof this.collection.findWhere !== 'function') {
	      throw new Error('This model have to be within a collection.');
	    }

	    var parent,
	      parentId = this.get(this.treeNodeParentId),
	      whereClause = {};

	    if (parentId) {
	      whereClause[this.treeNodeId] = parentId;
	      parent = this.collection.findWhere(whereClause);
	    }

	    return parent;
	  },

	  treeGetChildren: function() {
	    var whereClause = {};

	    whereClause[this.treeNodeParentId] = this.get(this.treeNodeId);

	    return this.collection.where(whereClause);
	  },

	  treeGetDescendants: function() {
	    var models = [];
	    var children = this.treeGetChildren();

	    models = models.concat(children);

	    children.forEach(function(model) {
	      var descendants = model.treeGetDescendants(true);
	      if (descendants.length) {
	        models = models.concat(descendants)
	      }
	    });

	    return models;
	  },

	  toTreeJSON: function() {
	    var node = _.clone(this.attributes),
	      children = this.treeGetChildren();

	    node.children = _.invoke(children, 'toTreeJSON');

	    return node;
	  }
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(6);
	var treeMixins = __webpack_require__(17);

	module.exports = Backbone.Model
	  .extend(treeMixins)
	  .extend({
	    defaults: {},
	    sync: function() {
	      return false;
	    }
	  });


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(6);
	var TreeModel = __webpack_require__(18);

	module.exports = Backbone.Collection.extend({
	  model: TreeModel,
	  comparator: 'order'
	});


/***/ }
]);