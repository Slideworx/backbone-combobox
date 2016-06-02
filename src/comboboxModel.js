var Backbone = require('backbone');
var _ = require('lodash');
var TreeCollection = require('backbone-tree').Collection;

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
    var item = this.findItem(id);

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

    return this.findItem(this.get('selectedId'));
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
