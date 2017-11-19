/*! mr-lewisfredericks*/
//------ scripts/app/app.js
Theme = {};
//------ scripts/lib/jquery.bootstrap-select.js
(function ($) {
  'use strict';

  //<editor-fold desc="Shims">
  if (!String.prototype.includes) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var toString = {}.toString;
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var indexOf = ''.indexOf;
      var includes = function (search) {
        if (this == null) {
          throw new TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw new TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        return indexOf.call(string, searchString, pos) != -1;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'includes', {
          'value': includes,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.includes = includes;
      }
    }());
  }

  if (!String.prototype.startsWith) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var toString = {}.toString;
      var startsWith = function (search) {
        if (this == null) {
          throw new TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw new TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        var index = -1;
        while (++index < searchLength) {
          if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
            return false;
          }
        }
        return true;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'startsWith', {
          'value': startsWith,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.startsWith = startsWith;
      }
    }());
  }

  if (!Object.keys) {
    Object.keys = function (
      o, // object
      k, // key
      r  // result array
      ){
      // initialize object and result
      r=[];
      // iterate over object keys
      for (k in o)
          // fill result array with non-prototypical keys
        r.hasOwnProperty.call(o, k) && r.push(k);
      // return result
      return r;
    };
  }

  // set data-selected on select element if the value has been programmatically selected
  // prior to initialization of bootstrap-select
  // * consider removing or replacing an alternative method *
  var valHooks = {
    useDefault: false,
    _set: $.valHooks.select.set
  };

  $.valHooks.select.set = function(elem, value) {
    if (value && !valHooks.useDefault) $(elem).data('selected', true);

    return valHooks._set.apply(this, arguments);
  };

  var changed_arguments = null;
  $.fn.triggerNative = function (eventName) {
    var el = this[0],
        event;

    if (el.dispatchEvent) { // for modern browsers & IE9+
      if (typeof Event === 'function') {
        // For modern browsers
        event = new Event(eventName, {
          bubbles: true
        });
      } else {
        // For IE since it doesn't support Event constructor
        event = document.createEvent('Event');
        event.initEvent(eventName, true, false);
      }

      el.dispatchEvent(event);
    } else if (el.fireEvent) { // for IE8
      event = document.createEventObject();
      event.eventType = eventName;
      el.fireEvent('on' + eventName, event);
    } else {
      // fall back to jQuery.trigger
      this.trigger(eventName);
    }
  };
  //</editor-fold>

  // Case insensitive contains search
  $.expr.pseudos.icontains = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case insensitive begins search
  $.expr.pseudos.ibegins = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  // Case and accent insensitive contains search
  $.expr.pseudos.aicontains = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case and accent insensitive begins search
  $.expr.pseudos.aibegins = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  /**
   * Remove all diatrics from the given text.
   * @access private
   * @param {String} text
   * @returns {String}
   */
  function normalizeToBase(text) {
    var rExps = [
      {re: /[\xC0-\xC6]/g, ch: "A"},
      {re: /[\xE0-\xE6]/g, ch: "a"},
      {re: /[\xC8-\xCB]/g, ch: "E"},
      {re: /[\xE8-\xEB]/g, ch: "e"},
      {re: /[\xCC-\xCF]/g, ch: "I"},
      {re: /[\xEC-\xEF]/g, ch: "i"},
      {re: /[\xD2-\xD6]/g, ch: "O"},
      {re: /[\xF2-\xF6]/g, ch: "o"},
      {re: /[\xD9-\xDC]/g, ch: "U"},
      {re: /[\xF9-\xFC]/g, ch: "u"},
      {re: /[\xC7-\xE7]/g, ch: "c"},
      {re: /[\xD1]/g, ch: "N"},
      {re: /[\xF1]/g, ch: "n"}
    ];
    $.each(rExps, function () {
      text = text ? text.replace(this.re, this.ch) : '';
    });
    return text;
  }


  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  
  var unescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`'
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + Object.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };

  var htmlEscape = createEscaper(escapeMap);
  var htmlUnescape = createEscaper(unescapeMap);

  var Selectpicker = function (element, options) {
    // bootstrap-select has been initialized - revert valHooks.select.set back to its original function
    if (!valHooks.useDefault) {
      $.valHooks.select.set = valHooks._set;
      valHooks.useDefault = true;
    }

    this.$element = $(element);
    this.$newElement = null;
    this.$button = null;
    this.$menu = null;
    this.$lis = null;
    this.options = options;

    // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
    // data-attribute)
    if (this.options.title === null) {
      this.options.title = this.$element.attr('title');
    }

    // Format window padding
    var winPad = this.options.windowPadding;
    if (typeof winPad === 'number') {
      this.options.windowPadding = [winPad, winPad, winPad, winPad];
    }

    //Expose public methods
    this.val = Selectpicker.prototype.val;
    this.render = Selectpicker.prototype.render;
    this.refresh = Selectpicker.prototype.refresh;
    this.setStyle = Selectpicker.prototype.setStyle;
    this.selectAll = Selectpicker.prototype.selectAll;
    this.deselectAll = Selectpicker.prototype.deselectAll;
    this.destroy = Selectpicker.prototype.destroy;
    this.remove = Selectpicker.prototype.remove;
    this.show = Selectpicker.prototype.show;
    this.hide = Selectpicker.prototype.hide;

    this.init();
  };

  Selectpicker.VERSION = '1.12.1';

  // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
  Selectpicker.DEFAULTS = {
    noneSelectedText: 'Nothing selected',
    noneResultsText: 'No results matched {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
        (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'
      ];
    },
    selectAllText: 'Select All',
    deselectAllText: 'Deselect All',
    doneButton: false,
    doneButtonText: 'Close',
    multipleSeparator: ', ',
    styleBase: 'btn',
    style: 'btn-default',
    size: 'auto',
    title: null,
    selectedTextFormat: 'values',
    width: false,
    container: false,
    hideDisabled: false,
    showSubtext: false,
    showIcon: true,
    showContent: true,
    dropupAuto: true,
    header: false,
    liveSearch: false,
    liveSearchPlaceholder: null,
    liveSearchNormalize: false,
    liveSearchStyle: 'contains',
    actionsBox: false,
    iconBase: 'glyphicon',
    tickIcon: 'glyphicon-ok',
    showTick: false,
    template: {
      caret: '<svg class="next-icon next-icon--size-12"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#next-chevron-down"></use></svg>'
    },
    maxOptions: false,
    mobile: false,
    selectOnTab: false,
    dropdownAlignRight: false,
    windowPadding: 0
  };

  Selectpicker.prototype = {

    constructor: Selectpicker,

    init: function () {
      var that = this,
          id = this.$element.attr('id');

      this.$element.addClass('bs-select-hidden');

      // store originalIndex (key) and newIndex (value) in this.liObj for fast accessibility
      // allows us to do this.$lis.eq(that.liObj[index]) instead of this.$lis.filter('[data-original-index="' + index + '"]')
      this.liObj = {};
      this.multiple = this.$element.prop('multiple');
      this.autofocus = this.$element.prop('autofocus');
      this.$newElement = this.createView();
      this.$element
        .after(this.$newElement)
        .appendTo(this.$newElement);
      this.$button = this.$newElement.children('button');
      this.$menu = this.$newElement.children('.dropdown-menu');
      this.$menuInner = this.$menu.children('.inner');
      this.$searchbox = this.$menu.find('input');

      this.$element.removeClass('bs-select-hidden');

      if (this.options.dropdownAlignRight === true) this.$menu.addClass('dropdown-menu-right');

      if (typeof id !== 'undefined') {
        this.$button.attr('data-id', id);
        $('label[for="' + id + '"]').click(function (e) {
          e.preventDefault();
          that.$button.focus();
        });
      }

      this.checkDisabled();
      this.clickListener();
      if (this.options.liveSearch) this.liveSearchListener();
      this.render();
      this.setStyle();
      this.setWidth();
      if (this.options.container) this.selectPosition();
      this.$menu.data('this', this);
      this.$newElement.data('this', this);
      if (this.options.mobile) this.mobile();

      this.$newElement.on({
        'hide.bs.dropdown': function (e) {
          that.$menuInner.attr('aria-expanded', false);
          that.$element.trigger('hide.bs.select', e);
        },
        'hidden.bs.dropdown': function (e) {
          that.$element.trigger('hidden.bs.select', e);
        },
        'show.bs.dropdown': function (e) {
          that.$menuInner.attr('aria-expanded', true);
          that.$element.trigger('show.bs.select', e);
        },
        'shown.bs.dropdown': function (e) {
          that.$element.trigger('shown.bs.select', e);
        }
      });

      if (that.$element[0].hasAttribute('required')) {
        this.$element.on('invalid', function () {
          that.$button
            .addClass('bs-invalid')
            .focus();

          that.$element.on({
            'focus.bs.select': function () {
              that.$button.focus();
              that.$element.off('focus.bs.select');
            },
            'shown.bs.select': function () {
              that.$element
                .val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                .off('shown.bs.select');
            },
            'rendered.bs.select': function () {
              // if select is no longer invalid, remove the bs-invalid class
              if (this.validity.valid) that.$button.removeClass('bs-invalid');
              that.$element.off('rendered.bs.select');
            }
          });
        });
      }

      setTimeout(function () {
        that.$element.trigger('loaded.bs.select');
      });
    },

    createDropdown: function () {
      // Options
      // If we are multiple or showTick option is set, then add the show-tick class
      var showTick = (this.multiple || this.options.showTick) ? ' show-tick' : '',
          inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
          autofocus = this.autofocus ? ' autofocus' : '';
      // Elements
      var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
      var searchbox = this.options.liveSearch ?
      '<div class="bs-searchbox">' +
      '<input type="text" class="form-control" autocomplete="off"' +
      (null === this.options.liveSearchPlaceholder ? '' : ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"') + ' role="textbox" aria-label="Search">' +
      '</div>'
          : '';
      var actionsbox = this.multiple && this.options.actionsBox ?
      '<div class="bs-actionsbox">' +
      '<div class="btn-group btn-group-sm btn-block">' +
      '<button type="button" class="actions-btn bs-select-all btn btn-default">' +
      this.options.selectAllText +
      '</button>' +
      '<button type="button" class="actions-btn bs-deselect-all btn btn-default">' +
      this.options.deselectAllText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var donebutton = this.multiple && this.options.doneButton ?
      '<div class="bs-donebutton">' +
      '<div class="btn-group btn-block">' +
      '<button type="button" class="btn btn-sm btn-default">' +
      this.options.doneButtonText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var drop =
          '<div class="btn-group bootstrap-select' + showTick + inputGroup + '">' +
          '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + autofocus + ' role="button">' +
          '<span class="filter-option pull-left"></span>&nbsp;' +
          '<span class="bs-caret">' +
          this.options.template.caret +
          '</span>' +
          '</button>' +
          '<div class="dropdown-menu open" role="combobox">' +
          header +
          searchbox +
          actionsbox +
          '<ul class="dropdown-menu inner" role="listbox" aria-expanded="false">' +
          '</ul>' +
          donebutton +
          '</div>' +
          '</div>';

      return $(drop);
    },

    createView: function () {
      var $drop = this.createDropdown(),
          li = this.createLi();

      $drop.find('ul')[0].innerHTML = li;
      return $drop;
    },

    reloadLi: function () {
      // rebuild
      var li = this.createLi();
      this.$menuInner[0].innerHTML = li;
    },

    createLi: function () {
      var that = this,
          _li = [],
          optID = 0,
          titleOption = document.createElement('option'),
          liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure liObj is correct

      // Helper functions
      /**
       * @param content
       * @param [index]
       * @param [classes]
       * @param [optgroup]
       * @returns {string}
       */
      var generateLI = function (content, index, classes, optgroup) {
        return '<li' +
            ((typeof classes !== 'undefined' & '' !== classes) ? ' class="' + classes + '"' : '') +
            ((typeof index !== 'undefined' & null !== index) ? ' data-original-index="' + index + '"' : '') +
            ((typeof optgroup !== 'undefined' & null !== optgroup) ? 'data-optgroup="' + optgroup + '"' : '') +
            '>' + content + '</li>';
      };

      /**
       * @param text
       * @param [classes]
       * @param [inline]
       * @param [tokens]
       * @returns {string}
       */
      var generateA = function (text, classes, inline, tokens) {
        return '<a tabindex="0"' +
            (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
            (inline ? ' style="' + inline + '"' : '') +
            (that.options.liveSearchNormalize ? ' data-normalized-text="' + normalizeToBase(htmlEscape($(text).html())) + '"' : '') +
            (typeof tokens !== 'undefined' || tokens !== null ? ' data-tokens="' + tokens + '"' : '') +
            ' role="option">' + text +
            '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
            '</a>';
      };

      if (this.options.title && !this.multiple) {
        // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
        // since liObj is recalculated on every refresh, liIndex needs to be decreased even if the titleOption is already appended
        liIndex--;

        if (!this.$element.find('.bs-title-option').length) {
          // Use native JS to prepend option (faster)
          var element = this.$element[0];
          titleOption.className = 'bs-title-option';
          titleOption.innerHTML = this.options.title;
          titleOption.value = '';
          element.insertBefore(titleOption, element.firstChild);
          // Check if selected or data-selected attribute is already set on an option. If not, select the titleOption option.
          // the selected item may have been changed by user or programmatically before the bootstrap select plugin runs,
          // if so, the select will have the data-selected attribute
          var $opt = $(element.options[element.selectedIndex]);
          if ($opt.attr('selected') === undefined && this.$element.data('selected') === undefined) {
            titleOption.selected = true;
          }
        }
      }

      this.$element.find('option').each(function (index) {
        var $this = $(this);

        liIndex++;

        if ($this.hasClass('bs-title-option')) return;

        // Get the class and text for the option
        var optionClass = this.className || '',
            inline = this.style.cssText,
            text = $this.data('content') ? $this.data('content') : $this.html(),
            tokens = $this.data('tokens') ? $this.data('tokens') : null,
            subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.data('subtext') + '</small>' : '',
            icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
            $parent = $this.parent(),
            isOptgroup = $parent[0].tagName === 'OPTGROUP',
            isOptgroupDisabled = isOptgroup && $parent[0].disabled,
            isDisabled = this.disabled || isOptgroupDisabled;

        if (icon !== '' && isDisabled) {
          icon = '<span>' + icon + '</span>';
        }

        if (that.options.hideDisabled && (isDisabled && !isOptgroup || isOptgroupDisabled)) {
          liIndex--;
          return;
        }

        if (!$this.data('content')) {
          // Prepend any icon and append any subtext to the main text.
          text = icon + '<span class="text">' + text + subtext + '</span>';
        }

        if (isOptgroup && $this.data('divider') !== true) {
          if (that.options.hideDisabled && isDisabled) {
            if ($parent.data('allOptionsDisabled') === undefined) {
              var $options = $parent.children();
              $parent.data('allOptionsDisabled', $options.filter(':disabled').length === $options.length);
            }

            if ($parent.data('allOptionsDisabled')) {
              liIndex--;
              return;
            }
          }

          var optGroupClass = ' ' + $parent[0].className || '';

          if ($this.index() === 0) { // Is it the first option of the optgroup?
            optID += 1;

            // Get the opt group label
            var label = $parent[0].label,
                labelSubtext = typeof $parent.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $parent.data('subtext') + '</small>' : '',
                labelIcon = $parent.data('icon') ? '<span class="' + that.options.iconBase + ' ' + $parent.data('icon') + '"></span> ' : '';

            label = labelIcon + '<span class="text">' + htmlEscape(label) + labelSubtext + '</span>';

            if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
              liIndex++;
              _li.push(generateLI('', null, 'divider', optID + 'div'));
            }
            liIndex++;
            _li.push(generateLI(label, null, 'dropdown-header' + optGroupClass, optID));
          }

          if (that.options.hideDisabled && isDisabled) {
            liIndex--;
            return;
          }

          _li.push(generateLI(generateA(text, 'opt ' + optionClass + optGroupClass, inline, tokens), index, '', optID));
        } else if ($this.data('divider') === true) {
          _li.push(generateLI('', index, 'divider'));
        } else if ($this.data('hidden') === true) {
          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
        } else {
          var showDivider = this.previousElementSibling && this.previousElementSibling.tagName === 'OPTGROUP';

          // if previous element is not an optgroup and hideDisabled is true
          if (!showDivider && that.options.hideDisabled) {
            // get previous elements
            var $prev = $(this).prevAll();

            for (var i = 0; i < $prev.length; i++) {
              // find the first element in the previous elements that is an optgroup
              if ($prev[i].tagName === 'OPTGROUP') {
                var optGroupDistance = 0;

                // loop through the options in between the current option and the optgroup
                // and check if they are hidden or disabled
                for (var d = 0; d < i; d++) {
                  var prevOption = $prev[d];
                  if (prevOption.disabled || $(prevOption).data('hidden') === true) optGroupDistance++;
                }

                // if all of the options between the current option and the optgroup are hidden or disabled, show the divider
                if (optGroupDistance === i) showDivider = true;

                break;
              }
            }
          }

          if (showDivider) {
            liIndex++;
            _li.push(generateLI('', null, 'divider', optID + 'div'));
          }
          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index));
        }

        that.liObj[index] = liIndex;
      });

      //If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
      if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
        this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
      }

      return _li.join('');
    },

    findLis: function () {
      if (this.$lis == null) this.$lis = this.$menu.find('li');
      return this.$lis;
    },

    /**
     * @param [updateLi] defaults to true
     */
    render: function (updateLi) {
      var that = this,
          notDisabled;

      //Update the LI to match the SELECT
      if (updateLi !== false) {
        this.$element.find('option').each(function (index) {
          var $lis = that.findLis().eq(that.liObj[index]);

          that.setDisabled(index, this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled, $lis);
          that.setSelected(index, this.selected, $lis);
        });
      }

      this.togglePlaceholder();

      this.tabIndex();

      var selectedItems = this.$element.find('option').map(function () {
        if (this.selected) {
          if (that.options.hideDisabled && (this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled)) return;

          var $this = $(this),
              icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '',
              subtext;

          if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
            subtext = ' <small class="text-muted">' + $this.data('subtext') + '</small>';
          } else {
            subtext = '';
          }
          if (typeof $this.attr('title') !== 'undefined') {
            return $this.attr('title');
          } else if ($this.data('content') && that.options.showContent) {
            return $this.data('content').toString();
          } else {
            return icon + $this.html() + subtext;
          }
        }
      }).toArray();

      //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
      //Convert all the values into a comma delimited string
      var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

      //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
      if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
        var max = this.options.selectedTextFormat.split('>');
        if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
          notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
          var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
              tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
          title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
        }
      }

      if (this.options.title == undefined) {
        this.options.title = this.$element.attr('title');
      }

      if (this.options.selectedTextFormat == 'static') {
        title = this.options.title;
      }

      //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
      if (!title) {
        title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
      }

      //strip all HTML tags and trim the result, then unescape any escaped tags
      this.$button.attr('title', htmlUnescape($.trim(title.replace(/<[^>]*>?/g, ''))));
      this.$button.children('.filter-option').html(title);

      this.$element.trigger('rendered.bs.select');
    },

    /**
     * @param [style]
     * @param [status]
     */
    setStyle: function (style, status) {
      if (this.$element.attr('class')) {
        this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
      }

      var buttonClass = style ? style : this.options.style;

      if (status == 'add') {
        this.$button.addClass(buttonClass);
      } else if (status == 'remove') {
        this.$button.removeClass(buttonClass);
      } else {
        this.$button.removeClass(this.options.style);
        this.$button.addClass(buttonClass);
      }
    },

    liHeight: function (refresh) {
      if (!refresh && (this.options.size === false || this.sizeInfo)) return;

      var newElement = document.createElement('div'),
          menu = document.createElement('div'),
          menuInner = document.createElement('ul'),
          divider = document.createElement('li'),
          li = document.createElement('li'),
          a = document.createElement('a'),
          text = document.createElement('span'),
          header = this.options.header && this.$menu.find('.popover-title').length > 0 ? this.$menu.find('.popover-title')[0].cloneNode(true) : null,
          search = this.options.liveSearch ? document.createElement('div') : null,
          actions = this.options.actionsBox && this.multiple && this.$menu.find('.bs-actionsbox').length > 0 ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
          doneButton = this.options.doneButton && this.multiple && this.$menu.find('.bs-donebutton').length > 0 ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

      text.className = 'text';
      newElement.className = this.$menu[0].parentNode.className + ' open';
      menu.className = 'dropdown-menu open';
      menuInner.className = 'dropdown-menu inner';
      divider.className = 'divider';

      text.appendChild(document.createTextNode('Inner text'));
      a.appendChild(text);
      li.appendChild(a);
      menuInner.appendChild(li);
      menuInner.appendChild(divider);
      if (header) menu.appendChild(header);
      if (search) {
        // create a span instead of input as creating an input element is slower
        var input = document.createElement('span');
        search.className = 'bs-searchbox';
        input.className = 'form-control';
        search.appendChild(input);
        menu.appendChild(search);
      }
      if (actions) menu.appendChild(actions);
      menu.appendChild(menuInner);
      if (doneButton) menu.appendChild(doneButton);
      newElement.appendChild(menu);

      document.body.appendChild(newElement);

      var liHeight = a.offsetHeight,
          headerHeight = header ? header.offsetHeight : 0,
          searchHeight = search ? search.offsetHeight : 0,
          actionsHeight = actions ? actions.offsetHeight : 0,
          doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
          dividerHeight = $(divider).outerHeight(true),
          // fall back to jQuery if getComputedStyle is not supported
          menuStyle = typeof getComputedStyle === 'function' ? getComputedStyle(menu) : false,
          $menu = menuStyle ? null : $(menu),
          menuPadding = {
            vert: parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) +
                  parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) +
                  parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) +
                  parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
            horiz: parseInt(menuStyle ? menuStyle.paddingLeft : $menu.css('paddingLeft')) +
                  parseInt(menuStyle ? menuStyle.paddingRight : $menu.css('paddingRight')) +
                  parseInt(menuStyle ? menuStyle.borderLeftWidth : $menu.css('borderLeftWidth')) +
                  parseInt(menuStyle ? menuStyle.borderRightWidth : $menu.css('borderRightWidth'))
          },
          menuExtras =  {
            vert: menuPadding.vert +
                  parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) +
                  parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2,
            horiz: menuPadding.horiz +
                  parseInt(menuStyle ? menuStyle.marginLeft : $menu.css('marginLeft')) +
                  parseInt(menuStyle ? menuStyle.marginRight : $menu.css('marginRight')) + 2
          }

      document.body.removeChild(newElement);

      this.sizeInfo = {
        liHeight: liHeight,
        headerHeight: headerHeight,
        searchHeight: searchHeight,
        actionsHeight: actionsHeight,
        doneButtonHeight: doneButtonHeight,
        dividerHeight: dividerHeight,
        menuPadding: menuPadding,
        menuExtras: menuExtras
      };
    },

    setSize: function () {
      this.findLis();
      this.liHeight();

      if (this.options.header) this.$menu.css('padding-top', 0);
      if (this.options.size === false) return;

      var that = this,
          $menu = this.$menu,
          $menuInner = this.$menuInner,
          $window = $(window),
          selectHeight = this.$newElement[0].offsetHeight,
          selectWidth = this.$newElement[0].offsetWidth,
          liHeight = this.sizeInfo['liHeight'],
          headerHeight = this.sizeInfo['headerHeight'],
          searchHeight = this.sizeInfo['searchHeight'],
          actionsHeight = this.sizeInfo['actionsHeight'],
          doneButtonHeight = this.sizeInfo['doneButtonHeight'],
          divHeight = this.sizeInfo['dividerHeight'],
          menuPadding = this.sizeInfo['menuPadding'],
          menuExtras = this.sizeInfo['menuExtras'],
          notDisabled = this.options.hideDisabled ? '.disabled' : '',
          menuHeight,
          menuWidth,
          getHeight,
          getWidth,
          selectOffsetTop,
          selectOffsetBot,
          selectOffsetLeft,
          selectOffsetRight,
          getPos = function() {
            var pos = that.$newElement.offset(),
                $container = $(that.options.container),
                containerPos;

            if (that.options.container && !$container.is('body')) {
              containerPos = $container.offset();
              containerPos.top += parseInt($container.css('borderTopWidth'));
              containerPos.left += parseInt($container.css('borderLeftWidth'));
            } else {
              containerPos = { top: 0, left: 0 };
            }

            var winPad = that.options.windowPadding;
            selectOffsetTop = pos.top - containerPos.top - $window.scrollTop();
            selectOffsetBot = $window.height() - selectOffsetTop - selectHeight - containerPos.top - winPad[2];
            selectOffsetLeft = pos.left - containerPos.left - $window.scrollLeft();
            selectOffsetRight = $window.width() - selectOffsetLeft - selectWidth - containerPos.left - winPad[1];
            selectOffsetTop -= winPad[0];
            selectOffsetLeft -= winPad[3];
          };

      getPos();

      if (this.options.size === 'auto') {
        var getSize = function () {
          var minHeight,
              hasClass = function (className, include) {
                return function (element) {
                    if (include) {
                        return (element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    } else {
                        return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    }
                };
              },
              lis = that.$menuInner[0].getElementsByTagName('li'),
              lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('hidden', false)) : that.$lis.not('.hidden'),
              optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

          getPos();
          menuHeight = selectOffsetBot - menuExtras.vert;
          menuWidth = selectOffsetRight - menuExtras.horiz;

          if (that.options.container) {
            if (!$menu.data('height')) $menu.data('height', $menu.height());
            getHeight = $menu.data('height');

            if (!$menu.data('width')) $menu.data('width', $menu.width());
            getWidth = $menu.data('width');
          } else {
            getHeight = $menu.height();
            getWidth = $menu.width();
          }

          if (that.options.dropupAuto) {
            that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
          }

          if (that.$newElement.hasClass('dropup')) {
            menuHeight = selectOffsetTop - menuExtras.vert;
          }

          if (that.options.dropdownAlignRight === 'auto') {
            $menu.toggleClass('dropdown-menu-right', selectOffsetLeft > selectOffsetRight && (menuWidth - menuExtras.horiz) < (getWidth - selectWidth));
          }

          if ((lisVisible.length + optGroup.length) > 3) {
            minHeight = liHeight * 3 + menuExtras.vert - 2;
          } else {
            minHeight = 0;
          }

          $menu.css({
            'max-height': menuHeight + 'px',
            'overflow': 'hidden',
            'min-height': minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px'
          });
          $menuInner.css({
            'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding.vert + 'px',
            'overflow-y': 'auto',
            'min-height': Math.max(minHeight - menuPadding.vert, 0) + 'px'
          });
        };
        getSize();
        this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
        $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
      } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
        var optIndex = this.$lis.not('.divider').not(notDisabled).children().slice(0, this.options.size).last().parent().index(),
            divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
        menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding.vert;

        if (that.options.container) {
          if (!$menu.data('height')) $menu.data('height', $menu.height());
          getHeight = $menu.data('height');
        } else {
          getHeight = $menu.height();
        }

        if (that.options.dropupAuto) {
          //noinspection JSUnusedAssignment
          this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
        }
        $menu.css({
          'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
          'overflow': 'hidden',
          'min-height': ''
        });
        $menuInner.css({
          'max-height': menuHeight - menuPadding.vert + 'px',
          'overflow-y': 'auto',
          'min-height': ''
        });
      }
    },

    setWidth: function () {
      if (this.options.width === 'auto') {
        this.$menu.css('min-width', '0');

        // Get correct width if element is hidden
        var $selectClone = this.$menu.parent().clone().appendTo('body'),
            $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone,
            ulWidth = $selectClone.children('.dropdown-menu').outerWidth(),
            btnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

        $selectClone.remove();
        $selectClone2.remove();

        // Set width to whatever's larger, button title or longest option
        this.$newElement.css('width', Math.max(ulWidth, btnWidth) + 'px');
      } else if (this.options.width === 'fit') {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '').addClass('fit-width');
      } else if (this.options.width) {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', this.options.width);
      } else {
        // Remove inline min-width/width so width can be changed
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '');
      }
      // Remove fit-width class if width is changed programmatically
      if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
        this.$newElement.removeClass('fit-width');
      }
    },

    selectPosition: function () {
      this.$bsContainer = $('<div class="bs-container" />');

      var that = this,
          $container = $(this.options.container),
          pos,
          containerPos,
          actualHeight,
          getPlacement = function ($element) {
            that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
            pos = $element.offset();

            if (!$container.is('body')) {
              containerPos = $container.offset();
              containerPos.top += parseInt($container.css('borderTopWidth')) - $container.scrollTop();
              containerPos.left += parseInt($container.css('borderLeftWidth')) - $container.scrollLeft();
            } else {
              containerPos = { top: 0, left: 0 };
            }

            actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;

            that.$bsContainer.css({
              'top': pos.top - containerPos.top + actualHeight,
              'left': pos.left - containerPos.left,
              'width': $element[0].offsetWidth
            });
          };

      this.$button.on('click', function () {
        var $this = $(this);

        if (that.isDisabled()) {
          return;
        }

        getPlacement(that.$newElement);

        that.$bsContainer
          .appendTo(that.options.container)
          .toggleClass('open', !$this.hasClass('open'))
          .append(that.$menu);
      });

      $(window).on('resize scroll', function () {
        getPlacement(that.$newElement);
      });

      this.$element.on('hide.bs.select', function () {
        that.$menu.data('height', that.$menu.height());
        that.$bsContainer.detach();
      });
    },

    /**
     * @param {number} index - the index of the option that is being changed
     * @param {boolean} selected - true if the option is being selected, false if being deselected
     * @param {JQuery} $lis - the 'li' element that is being modified
     */
    setSelected: function (index, selected, $lis) {
      if (!$lis) {
        this.togglePlaceholder(); // check if setSelected is being called by changing the value of the select
        $lis = this.findLis().eq(this.liObj[index]);
      }

      $lis.toggleClass('selected', selected).find('a').attr('aria-selected', selected);
    },

    /**
     * @param {number} index - the index of the option that is being disabled
     * @param {boolean} disabled - true if the option is being disabled, false if being enabled
     * @param {JQuery} $lis - the 'li' element that is being modified
     */
    setDisabled: function (index, disabled, $lis) {
      if (!$lis) {
        $lis = this.findLis().eq(this.liObj[index]);
      }

      if (disabled) {
        $lis.addClass('disabled').children('a').attr('href', '#').attr('tabindex', -1).attr('aria-disabled', true);
      } else {
        $lis.removeClass('disabled').children('a').removeAttr('href').attr('tabindex', 0).attr('aria-disabled', false);
      }
    },

    isDisabled: function () {
      return this.$element[0].disabled;
    },

    checkDisabled: function () {
      var that = this;

      if (this.isDisabled()) {
        this.$newElement.addClass('disabled');
        this.$button.addClass('disabled').attr('tabindex', -1).attr('aria-disabled', true);
      } else {
        if (this.$button.hasClass('disabled')) {
          this.$newElement.removeClass('disabled');
          this.$button.removeClass('disabled').attr('aria-disabled', false);
        }

        if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
          this.$button.removeAttr('tabindex');
        }
      }

      this.$button.click(function () {
        return !that.isDisabled();
      });
    },

    togglePlaceholder: function () {
      var value = this.$element.val();
      this.$button.toggleClass('bs-placeholder', value === null || value === '' || (value.constructor === Array && value.length === 0));
    },

    tabIndex: function () {
      if (this.$element.data('tabindex') !== this.$element.attr('tabindex') && 
        (this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98')) {
        this.$element.data('tabindex', this.$element.attr('tabindex'));
        this.$button.attr('tabindex', this.$element.data('tabindex'));
      }

      this.$element.attr('tabindex', -98);
    },

    clickListener: function () {
      var that = this,
          $document = $(document);

      $document.data('spaceSelect', false);

      this.$button.on('keyup', function (e) {
        if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
            e.preventDefault();
            $document.data('spaceSelect', false);
        }
      });

      this.$button.on('click', function () {
        that.setSize();
      });

      this.$element.on('shown.bs.select', function () {
        if (!that.options.liveSearch && !that.multiple) {
          that.$menuInner.find('.selected a').focus();
        } else if (!that.multiple) {
          var selectedIndex = that.liObj[that.$element[0].selectedIndex];

          if (typeof selectedIndex !== 'number' || that.options.size === false) return;

          // scroll to selected option
          var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
          offset = offset - that.$menuInner[0].offsetHeight/2 + that.sizeInfo.liHeight/2;
          that.$menuInner[0].scrollTop = offset;
        }
      });

      this.$menuInner.on('click', 'li a', function (e) {
        var $this = $(this),
            clickedIndex = $this.parent().data('originalIndex'),
            prevValue = that.$element.val(),
            prevIndex = that.$element.prop('selectedIndex'),
            triggerChange = true;

        // Don't close on multi choice menu
        if (that.multiple && that.options.maxOptions !== 1) {
          e.stopPropagation();
        }

        e.preventDefault();

        //Don't run if we have been disabled
        if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
          var $options = that.$element.find('option'),
              $option = $options.eq(clickedIndex),
              state = $option.prop('selected'),
              $optgroup = $option.parent('optgroup'),
              maxOptions = that.options.maxOptions,
              maxOptionsGrp = $optgroup.data('maxOptions') || false;

          if (!that.multiple) { // Deselect all others if not multi select box
            $options.prop('selected', false);
            $option.prop('selected', true);
            that.$menuInner.find('.selected').removeClass('selected').find('a').attr('aria-selected', false);
            that.setSelected(clickedIndex, true);
          } else { // Toggle the one we have chosen if we are multi select.
            $option.prop('selected', !state);
            that.setSelected(clickedIndex, !state);
            $this.blur();

            if (maxOptions !== false || maxOptionsGrp !== false) {
              var maxReached = maxOptions < $options.filter(':selected').length,
                  maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

              if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                if (maxOptions && maxOptions == 1) {
                  $options.prop('selected', false);
                  $option.prop('selected', true);
                  that.$menuInner.find('.selected').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                  $optgroup.find('option:selected').prop('selected', false);
                  $option.prop('selected', true);
                  var optgroupID = $this.parent().data('optgroup');
                  that.$menuInner.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else {
                  var maxOptionsText = typeof that.options.maxOptionsText === 'string' ? [that.options.maxOptionsText, that.options.maxOptionsText] : that.options.maxOptionsText,
                      maxOptionsArr = typeof maxOptionsText === 'function' ? maxOptionsText(maxOptions, maxOptionsGrp) : maxOptionsText,
                      maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                      maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                      $notify = $('<div class="notify"></div>');
                  // If {var} is set in array, replace it
                  /** @deprecated */
                  if (maxOptionsArr[2]) {
                    maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                    maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                  }

                  $option.prop('selected', false);

                  that.$menu.append($notify);

                  if (maxOptions && maxReached) {
                    $notify.append($('<div>' + maxTxt + '</div>'));
                    triggerChange = false;
                    that.$element.trigger('maxReached.bs.select');
                  }

                  if (maxOptionsGrp && maxReachedGrp) {
                    $notify.append($('<div>' + maxTxtGrp + '</div>'));
                    triggerChange = false;
                    that.$element.trigger('maxReachedGrp.bs.select');
                  }

                  setTimeout(function () {
                    that.setSelected(clickedIndex, false);
                  }, 10);

                  $notify.delay(750).fadeOut(300, function () {
                    $(this).remove();
                  });
                }
              }
            }
          }

          if (!that.multiple || (that.multiple && that.options.maxOptions === 1)) {
            that.$button.focus();
          } else if (that.options.liveSearch) {
            that.$searchbox.focus();
          }

          // Trigger select 'change'
          if (triggerChange) {
            if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
              // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
              changed_arguments = [clickedIndex, $option.prop('selected'), state];
              that.$element
                .triggerNative('change');
            }
          }
        }
      });

      this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function (e) {
        if (e.currentTarget == this) {
          e.preventDefault();
          e.stopPropagation();
          if (that.options.liveSearch && !$(e.target).hasClass('close')) {
            that.$searchbox.focus();
          } else {
            that.$button.focus();
          }
        }
      });

      this.$menuInner.on('click', '.divider, .dropdown-header', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }
      });

      this.$menu.on('click', '.popover-title .close', function () {
        that.$button.click();
      });

      this.$searchbox.on('click', function (e) {
        e.stopPropagation();
      });

      this.$menu.on('click', '.actions-btn', function (e) {
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }

        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass('bs-select-all')) {
          that.selectAll();
        } else {
          that.deselectAll();
        }
      });

      this.$element.change(function () {
        that.render(false);
        that.$element.trigger('changed.bs.select', changed_arguments);
        changed_arguments = null;
      });
    },

    liveSearchListener: function () {
      var that = this,
          $no_results = $('<li class="no-results"></li>');

      this.$button.on('click.dropdown.data-api', function () {
        that.$menuInner.find('.active').removeClass('active');
        if (!!that.$searchbox.val()) {
          that.$searchbox.val('');
          that.$lis.not('.is-hidden').removeClass('hidden');
          if (!!$no_results.parent().length) $no_results.remove();
        }
        if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
        setTimeout(function () {
          that.$searchbox.focus();
        }, 10);
      });

      this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function (e) {
        e.stopPropagation();
      });

      this.$searchbox.on('input propertychange', function () {
        that.$lis.not('.is-hidden').removeClass('hidden');
        that.$lis.filter('.active').removeClass('active');
        $no_results.remove();

        if (that.$searchbox.val()) {
          var $searchBase = that.$lis.not('.is-hidden, .divider, .dropdown-header'),
              $hideItems;
          if (that.options.liveSearchNormalize) {
            $hideItems = $searchBase.not(':a' + that._searchStyle() + '("' + normalizeToBase(that.$searchbox.val()) + '")');
          } else {
            $hideItems = $searchBase.not(':' + that._searchStyle() + '("' + that.$searchbox.val() + '")');
          }

          if ($hideItems.length === $searchBase.length) {
            $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"'));
            that.$menuInner.append($no_results);
            that.$lis.addClass('hidden');
          } else {
            $hideItems.addClass('hidden');

            var $lisVisible = that.$lis.not('.hidden'),
                $foundDiv;

            // hide divider if first or last visible, or if followed by another divider
            $lisVisible.each(function (index) {
              var $this = $(this);

              if ($this.hasClass('divider')) {
                if ($foundDiv === undefined) {
                  $this.addClass('hidden');
                } else {
                  if ($foundDiv) $foundDiv.addClass('hidden');
                  $foundDiv = $this;
                }
              } else if ($this.hasClass('dropdown-header') && $lisVisible.eq(index + 1).data('optgroup') !== $this.data('optgroup')) {
                $this.addClass('hidden');
              } else {
                $foundDiv = null;
              }
            });
            if ($foundDiv) $foundDiv.addClass('hidden');

            $searchBase.not('.hidden').first().addClass('active');
          }
        }
      });
    },

    _searchStyle: function () {
      var styles = {
        begins: 'ibegins',
        startsWith: 'ibegins'
      };

      return styles[this.options.liveSearchStyle] || 'icontains';
    },

    val: function (value) {
      if (typeof value !== 'undefined') {
        this.$element.val(value);
        this.render();

        return this.$element;
      } else {
        return this.$element.val();
      }
    },

    changeAll: function (status) {
      if (!this.multiple) return;
      if (typeof status === 'undefined') status = true;

      this.findLis();

      var $options = this.$element.find('option'),
          $lisVisible = this.$lis.not('.divider, .dropdown-header, .disabled, .hidden'),
          lisVisLen = $lisVisible.length,
          selectedOptions = [];
          
      if (status) {
        if ($lisVisible.filter('.selected').length === $lisVisible.length) return;
      } else {
        if ($lisVisible.filter('.selected').length === 0) return;
      }
          
      $lisVisible.toggleClass('selected', status);

      for (var i = 0; i < lisVisLen; i++) {
        var origIndex = $lisVisible[i].getAttribute('data-original-index');
        selectedOptions[selectedOptions.length] = $options.eq(origIndex)[0];
      }

      $(selectedOptions).prop('selected', status);

      this.render(false);

      this.togglePlaceholder();

      this.$element
        .triggerNative('change');
    },

    selectAll: function () {
      return this.changeAll(true);
    },

    deselectAll: function () {
      return this.changeAll(false);
    },

    toggle: function (e) {
      e = e || window.event;

      if (e) e.stopPropagation();

      this.$button.trigger('click');
    },

    keydown: function (e) {
      var $this = $(this),
          $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
          $items,
          that = $parent.data('this'),
          index,
          next,
          first,
          last,
          prev,
          nextPrev,
          prevIndex,
          isActive,
          selector = ':not(.disabled, .hidden, .dropdown-header, .divider)',
          keyCodeMap = {
            32: ' ',
            48: '0',
            49: '1',
            50: '2',
            51: '3',
            52: '4',
            53: '5',
            54: '6',
            55: '7',
            56: '8',
            57: '9',
            59: ';',
            65: 'a',
            66: 'b',
            67: 'c',
            68: 'd',
            69: 'e',
            70: 'f',
            71: 'g',
            72: 'h',
            73: 'i',
            74: 'j',
            75: 'k',
            76: 'l',
            77: 'm',
            78: 'n',
            79: 'o',
            80: 'p',
            81: 'q',
            82: 'r',
            83: 's',
            84: 't',
            85: 'u',
            86: 'v',
            87: 'w',
            88: 'x',
            89: 'y',
            90: 'z',
            96: '0',
            97: '1',
            98: '2',
            99: '3',
            100: '4',
            101: '5',
            102: '6',
            103: '7',
            104: '8',
            105: '9'
          };

      if (that.options.liveSearch) $parent = $this.parent().parent();

      if (that.options.container) $parent = that.$menu;

      $items = $('[role="listbox"] li', $parent);

      isActive = that.$newElement.hasClass('open');

      if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 65 && e.keyCode <= 90)) {
        if (!that.options.container) {
          that.setSize();
          that.$menu.parent().addClass('open');
          isActive = true;
        } else {
          that.$button.trigger('click');
        }
        that.$searchbox.focus();
        return;
      }

      if (that.options.liveSearch) {
        if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive) {
          e.preventDefault();
          e.stopPropagation();
          that.$menuInner.click();
          that.$button.focus();
        }
        // $items contains li elements when liveSearch is enabled
        $items = $('[role="listbox"] li' + selector, $parent);
        if (!$this.val() && !/(38|40)/.test(e.keyCode.toString(10))) {
          if ($items.filter('.active').length === 0) {
            $items = that.$menuInner.find('li');
            if (that.options.liveSearchNormalize) {
              $items = $items.filter(':a' + that._searchStyle() + '(' + normalizeToBase(keyCodeMap[e.keyCode]) + ')');
            } else {
              $items = $items.filter(':' + that._searchStyle() + '(' + keyCodeMap[e.keyCode] + ')');
            }
          }
        }
      }

      if (!$items.length) return;

      if (/(38|40)/.test(e.keyCode.toString(10))) {
        index = $items.index($items.find('a').filter(':focus').parent());
        first = $items.filter(selector).first().index();
        last = $items.filter(selector).last().index();
        next = $items.eq(index).nextAll(selector).eq(0).index();
        prev = $items.eq(index).prevAll(selector).eq(0).index();
        nextPrev = $items.eq(next).prevAll(selector).eq(0).index();

        if (that.options.liveSearch) {
          $items.each(function (i) {
            if (!$(this).hasClass('disabled')) {
              $(this).data('index', i);
            }
          });
          index = $items.index($items.filter('.active'));
          first = $items.first().data('index');
          last = $items.last().data('index');
          next = $items.eq(index).nextAll().eq(0).data('index');
          prev = $items.eq(index).prevAll().eq(0).data('index');
          nextPrev = $items.eq(next).prevAll().eq(0).data('index');
        }

        prevIndex = $this.data('prevIndex');

        if (e.keyCode == 38) {
          if (that.options.liveSearch) index--;
          if (index != nextPrev && index > prev) index = prev;
          if (index < first) index = first;
          if (index == prevIndex) index = last;
        } else if (e.keyCode == 40) {
          if (that.options.liveSearch) index++;
          if (index == -1) index = 0;
          if (index != nextPrev && index < next) index = next;
          if (index > last) index = last;
          if (index == prevIndex) index = first;
        }

        $this.data('prevIndex', index);

        if (!that.options.liveSearch) {
          $items.eq(index).children('a').focus();
        } else {
          e.preventDefault();
          if (!$this.hasClass('dropdown-toggle')) {
            $items.removeClass('active').eq(index).addClass('active').children('a').focus();
            $this.focus();
          }
        }

      } else if (!$this.is('input')) {
        var keyIndex = [],
            count,
            prevKey;

        $items.each(function () {
          if (!$(this).hasClass('disabled')) {
            if ($.trim($(this).children('a').text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
              keyIndex.push($(this).index());
            }
          }
        });

        count = $(document).data('keycount');
        count++;
        $(document).data('keycount', count);

        prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

        if (prevKey != keyCodeMap[e.keyCode]) {
          count = 1;
          $(document).data('keycount', count);
        } else if (count >= keyIndex.length) {
          $(document).data('keycount', 0);
          if (count > keyIndex.length) count = 1;
        }

        $items.eq(keyIndex[count - 1]).children('a').focus();
      }

      // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
      if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
        if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
        if (!that.options.liveSearch) {
          var elem = $(':focus');
          elem.click();
          // Bring back focus for multiselects
          elem.focus();
          // Prevent screen from scrolling if the user hit the spacebar
          e.preventDefault();
          // Fixes spacebar selection of dropdown items in FF & IE
          $(document).data('spaceSelect', true);
        } else if (!/(32)/.test(e.keyCode.toString(10))) {
          that.$menuInner.find('.active a').click();
          $this.focus();
        }
        $(document).data('keycount', 0);
      }

      if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
        that.$menu.parent().removeClass('open');
        if (that.options.container) that.$newElement.removeClass('open');
        that.$button.focus();
      }
    },

    mobile: function () {
      this.$element.addClass('mobile-device');
    },

    refresh: function () {
      this.$lis = null;
      this.liObj = {};
      this.reloadLi();
      this.render();
      this.checkDisabled();
      this.liHeight(true);
      this.setStyle();
      this.setWidth();
      if (this.$lis) this.$searchbox.trigger('propertychange');

      this.$element.trigger('refreshed.bs.select');
    },

    hide: function () {
      this.$newElement.hide();
    },

    show: function () {
      this.$newElement.show();
    },

    remove: function () {
      this.$newElement.remove();
      this.$element.remove();
    },

    destroy: function () {
      this.$newElement.before(this.$element).remove();

      if (this.$bsContainer) {
        this.$bsContainer.remove();
      } else {
        this.$menu.remove();
      }

      this.$element
        .off('.bs.select')
        .removeData('selectpicker')
        .removeClass('bs-select-hidden selectpicker');
    }
  };

  // SELECTPICKER PLUGIN DEFINITION
  // ==============================
  function Plugin(option) {
    // get the args of the outer function..
    var args = arguments;
    // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
    // to get lost/corrupted in android 2.3 and IE9 #715 #775
    var _option = option;

    [].shift.apply(args);

    var value;
    var chain = this.each(function () {
      var $this = $(this);
      if ($this.is('select')) {
        var data = $this.data('selectpicker'),
            options = typeof _option == 'object' && _option;

        if (!data) {
          var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
          config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), $this.data().template, options.template);
          $this.data('selectpicker', (data = new Selectpicker(this, config)));
        } else if (options) {
          for (var i in options) {
            if (options.hasOwnProperty(i)) {
              data.options[i] = options[i];
            }
          }
        }

        if (typeof _option == 'string') {
          if (data[_option] instanceof Function) {
            value = data[_option].apply(data, args);
          } else {
            value = data.options[_option];
          }
        }
      }
    });

    if (typeof value !== 'undefined') {
      //noinspection JSUnusedAssignment
      return value;
    } else {
      return chain;
    }
  }

  var old = $.fn.selectpicker;
  $.fn.selectpicker = Plugin;
  $.fn.selectpicker.Constructor = Selectpicker;

  // SELECTPICKER NO CONFLICT
  // ========================
  $.fn.selectpicker.noConflict = function () {
    $.fn.selectpicker = old;
    return this;
  };

  $(document)
      .data('keycount', 0)
      .on('keydown.bs.select', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', Selectpicker.prototype.keydown)
      .on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', function (e) {
        e.stopPropagation();
      });

  // SELECTPICKER DATA-API
  // =====================
  $(window).on('load.bs.select.data-api', function () {
    $('.selectpicker').each(function () {
      var $selectpicker = $(this);
      Plugin.call($selectpicker, $selectpicker.data());
    })
  });
})(jQuery);

//------ scripts/lib/jquery.currencies.min.js
/*
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

jQuery.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};

/*
 * Currency tools
 *
 * Copyright (c) 2015 Caroline Schnapp (mllegeorgesand@gmail.com)
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */


if(typeof Currency==="undefined"){var Currency={}}Currency.cookie={configuration:{expires:365,path:"/",domain:window.location.hostname},name:"currency",write:function(a){jQuery.cookie(this.name,a,this.configuration)},read:function(){return jQuery.cookie(this.name)},destroy:function(){jQuery.cookie(this.name,null,this.configuration)}};Currency.moneyFormats={USD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} USD"},EUR:{money_format:"&euro;{{amount}}",money_with_currency_format:"&euro;{{amount}} EUR"},GBP:{money_format:"&pound;{{amount}}",money_with_currency_format:"&pound;{{amount}} GBP"},CAD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} CAD"},ALL:{money_format:"Lek {{amount}}",money_with_currency_format:"Lek {{amount}} ALL"},DZD:{money_format:"DA {{amount}}",money_with_currency_format:"DA {{amount}} DZD"},AOA:{money_format:"Kz{{amount}}",money_with_currency_format:"Kz{{amount}} AOA"},ARS:{money_format:"${{amount_with_comma_separator}}",money_with_currency_format:"${{amount_with_comma_separator}} ARS"},AMD:{money_format:"{{amount}} AMD",money_with_currency_format:"{{amount}} AMD"},AWG:{money_format:"Afl{{amount}}",money_with_currency_format:"Afl{{amount}} AWG"},AUD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} AUD"},BBD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} Bds"},AZN:{money_format:"m.{{amount}}",money_with_currency_format:"m.{{amount}} AZN"},BDT:{money_format:"Tk {{amount}}",money_with_currency_format:"Tk {{amount}} BDT"},BSD:{money_format:"BS${{amount}}",money_with_currency_format:"BS${{amount}} BSD"},BHD:{money_format:"{{amount}}0 BD",money_with_currency_format:"{{amount}}0 BHD"},BYR:{money_format:"Br {{amount}}",money_with_currency_format:"Br {{amount}} BYR"},BZD:{money_format:"BZ${{amount}}",money_with_currency_format:"BZ${{amount}} BZD"},BTN:{money_format:"Nu {{amount}}",money_with_currency_format:"Nu {{amount}} BTN"},BAM:{money_format:"KM {{amount_with_comma_separator}}",money_with_currency_format:"KM {{amount_with_comma_separator}} BAM"},BRL:{money_format:"R$ {{amount_with_comma_separator}}",money_with_currency_format:"R$ {{amount_with_comma_separator}} BRL"},BOB:{money_format:"Bs{{amount_with_comma_separator}}",money_with_currency_format:"Bs{{amount_with_comma_separator}} BOB"},BWP:{money_format:"P{{amount}}",money_with_currency_format:"P{{amount}} BWP"},BND:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} BND"},BGN:{money_format:"{{amount}} лв",money_with_currency_format:"{{amount}} лв BGN"},MMK:{money_format:"K{{amount}}",money_with_currency_format:"K{{amount}} MMK"},KHR:{money_format:"KHR{{amount}}",money_with_currency_format:"KHR{{amount}}"},KYD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} KYD"},XAF:{money_format:"FCFA{{amount}}",money_with_currency_format:"FCFA{{amount}} XAF"},CLP:{money_format:"${{amount_no_decimals}}",money_with_currency_format:"${{amount_no_decimals}} CLP"},CNY:{money_format:"&#165;{{amount}}",money_with_currency_format:"&#165;{{amount}} CNY"},COP:{money_format:"${{amount_with_comma_separator}}",money_with_currency_format:"${{amount_with_comma_separator}} COP"},CRC:{money_format:"&#8353; {{amount_with_comma_separator}}",money_with_currency_format:"&#8353; {{amount_with_comma_separator}} CRC"},HRK:{money_format:"{{amount_with_comma_separator}} kn",money_with_currency_format:"{{amount_with_comma_separator}} kn HRK"},CZK:{money_format:"{{amount_with_comma_separator}} K&#269;",money_with_currency_format:"{{amount_with_comma_separator}} K&#269;"},DKK:{money_format:"{{amount_with_comma_separator}}",money_with_currency_format:"kr.{{amount_with_comma_separator}}"},DOP:{money_format:"RD$ {{amount}}",money_with_currency_format:"RD$ {{amount}}"},XCD:{money_format:"${{amount}}",money_with_currency_format:"EC${{amount}}"},EGP:{money_format:"LE {{amount}}",money_with_currency_format:"LE {{amount}} EGP"},ETB:{money_format:"Br{{amount}}",money_with_currency_format:"Br{{amount}} ETB"},XPF:{money_format:"{{amount_no_decimals_with_comma_separator}} XPF",money_with_currency_format:"{{amount_no_decimals_with_comma_separator}} XPF"},FJD:{money_format:"${{amount}}",money_with_currency_format:"FJ${{amount}}"},GMD:{money_format:"D {{amount}}",money_with_currency_format:"D {{amount}} GMD"},GHS:{money_format:"GH&#8373;{{amount}}",money_with_currency_format:"GH&#8373;{{amount}}"},GTQ:{money_format:"Q{{amount}}",money_with_currency_format:"{{amount}} GTQ"},GYD:{money_format:"G${{amount}}",money_with_currency_format:"${{amount}} GYD"},GEL:{money_format:"{{amount}} GEL",money_with_currency_format:"{{amount}} GEL"},HNL:{money_format:"L {{amount}}",money_with_currency_format:"L {{amount}} HNL"},HKD:{money_format:"${{amount}}",money_with_currency_format:"HK${{amount}}"},HUF:{money_format:"{{amount_no_decimals_with_comma_separator}}",money_with_currency_format:"{{amount_no_decimals_with_comma_separator}} Ft"},ISK:{money_format:"{{amount_no_decimals}} kr",money_with_currency_format:"{{amount_no_decimals}} kr ISK"},INR:{money_format:"Rs. {{amount}}",money_with_currency_format:"Rs. {{amount}}"},IDR:{money_format:"{{amount_with_comma_separator}}",money_with_currency_format:"Rp {{amount_with_comma_separator}}"},ILS:{money_format:"{{amount}} NIS",money_with_currency_format:"{{amount}} NIS"},JMD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} JMD"},JPY:{money_format:"&#165;{{amount_no_decimals}}",money_with_currency_format:"&#165;{{amount_no_decimals}} JPY"},JEP:{money_format:"&pound;{{amount}}",money_with_currency_format:"&pound;{{amount}} JEP"},JOD:{money_format:"{{amount}}0 JD",money_with_currency_format:"{{amount}}0 JOD"},KZT:{money_format:"{{amount}} KZT",money_with_currency_format:"{{amount}} KZT"},KES:{money_format:"KSh{{amount}}",money_with_currency_format:"KSh{{amount}}"},KWD:{money_format:"{{amount}}0 KD",money_with_currency_format:"{{amount}}0 KWD"},KGS:{money_format:"лв{{amount}}",money_with_currency_format:"лв{{amount}}"},LVL:{money_format:"Ls {{amount}}",money_with_currency_format:"Ls {{amount}} LVL"},LBP:{money_format:"L&pound;{{amount}}",money_with_currency_format:"L&pound;{{amount}} LBP"},LTL:{money_format:"{{amount}} Lt",money_with_currency_format:"{{amount}} Lt"},MGA:{money_format:"Ar {{amount}}",money_with_currency_format:"Ar {{amount}} MGA"},MKD:{money_format:"ден {{amount}}",money_with_currency_format:"ден {{amount}} MKD"},MOP:{money_format:"MOP${{amount}}",money_with_currency_format:"MOP${{amount}}"},MVR:{money_format:"Rf{{amount}}",money_with_currency_format:"Rf{{amount}} MRf"},MXN:{money_format:"$ {{amount}}",money_with_currency_format:"$ {{amount}} MXN"},MYR:{money_format:"RM{{amount}} MYR",money_with_currency_format:"RM{{amount}} MYR"},MUR:{money_format:"Rs {{amount}}",money_with_currency_format:"Rs {{amount}} MUR"},MDL:{money_format:"{{amount}} MDL",money_with_currency_format:"{{amount}} MDL"},MAD:{money_format:"{{amount}} dh",money_with_currency_format:"Dh {{amount}} MAD"},MNT:{money_format:"{{amount_no_decimals}} &#8366",money_with_currency_format:"{{amount_no_decimals}} MNT"},MZN:{money_format:"{{amount}} Mt",money_with_currency_format:"Mt {{amount}} MZN"},NAD:{money_format:"N${{amount}}",money_with_currency_format:"N${{amount}} NAD"},NPR:{money_format:"Rs{{amount}}",money_with_currency_format:"Rs{{amount}} NPR"},ANG:{money_format:"&fnof;{{amount}}",money_with_currency_format:"{{amount}} NA&fnof;"},NZD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} NZD"},NIO:{money_format:"C${{amount}}",money_with_currency_format:"C${{amount}} NIO"},NGN:{money_format:"&#8358;{{amount}}",money_with_currency_format:"&#8358;{{amount}} NGN"},NOK:{money_format:"kr {{amount_with_comma_separator}}",money_with_currency_format:"kr {{amount_with_comma_separator}} NOK"},OMR:{money_format:"{{amount_with_comma_separator}} OMR",money_with_currency_format:"{{amount_with_comma_separator}} OMR"},PKR:{money_format:"Rs.{{amount}}",money_with_currency_format:"Rs.{{amount}} PKR"},PGK:{money_format:"K {{amount}}",money_with_currency_format:"K {{amount}} PGK"},PYG:{money_format:"Gs. {{amount_no_decimals_with_comma_separator}}",money_with_currency_format:"Gs. {{amount_no_decimals_with_comma_separator}} PYG"},PEN:{money_format:"S/. {{amount}}",money_with_currency_format:"S/. {{amount}} PEN"},PHP:{money_format:"&#8369;{{amount}}",money_with_currency_format:"&#8369;{{amount}} PHP"},PLN:{money_format:"{{amount_with_comma_separator}} zl",money_with_currency_format:"{{amount_with_comma_separator}} zl PLN"},QAR:{money_format:"QAR {{amount_with_comma_separator}}",money_with_currency_format:"QAR {{amount_with_comma_separator}}"},RON:{money_format:"{{amount_with_comma_separator}} lei",money_with_currency_format:"{{amount_with_comma_separator}} lei RON"},RUB:{money_format:"&#1088;&#1091;&#1073;{{amount_with_comma_separator}}",money_with_currency_format:"&#1088;&#1091;&#1073;{{amount_with_comma_separator}} RUB"},RWF:{money_format:"{{amount_no_decimals}} RF",money_with_currency_format:"{{amount_no_decimals}} RWF"},WST:{money_format:"WS$ {{amount}}",money_with_currency_format:"WS$ {{amount}} WST"},SAR:{money_format:"{{amount}} SR",money_with_currency_format:"{{amount}} SAR"},STD:{money_format:"Db {{amount}}",money_with_currency_format:"Db {{amount}} STD"},RSD:{money_format:"{{amount}} RSD",money_with_currency_format:"{{amount}} RSD"},SCR:{money_format:"Rs {{amount}}",money_with_currency_format:"Rs {{amount}} SCR"},SGD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} SGD"},SYP:{money_format:"S&pound;{{amount}}",money_with_currency_format:"S&pound;{{amount}} SYP"},ZAR:{money_format:"R {{amount}}",money_with_currency_format:"R {{amount}} ZAR"},KRW:{money_format:"&#8361;{{amount_no_decimals}}",money_with_currency_format:"&#8361;{{amount_no_decimals}} KRW"},LKR:{money_format:"Rs {{amount}}",money_with_currency_format:"Rs {{amount}} LKR"},SEK:{money_format:"{{amount_no_decimals}} kr",money_with_currency_format:"{{amount_no_decimals}} kr SEK"},CHF:{money_format:"SFr. {{amount}}",money_with_currency_format:"SFr. {{amount}} CHF"},TWD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} TWD"},THB:{money_format:"{{amount}} &#xe3f;",money_with_currency_format:"{{amount}} &#xe3f; THB"},TZS:{money_format:"{{amount}} TZS",money_with_currency_format:"{{amount}} TZS"},TTD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} TTD"},TND:{money_format:"{{amount}}",money_with_currency_format:"{{amount}} DT"},TRY:{money_format:"{{amount}}TL",money_with_currency_format:"{{amount}}TL"},UGX:{money_format:"Ush {{amount_no_decimals}}",money_with_currency_format:"Ush {{amount_no_decimals}} UGX"},UAH:{money_format:"₴{{amount}}",money_with_currency_format:"₴{{amount}} UAH"},AED:{money_format:"Dhs. {{amount}}",money_with_currency_format:"Dhs. {{amount}} AED"},UYU:{money_format:"${{amount_with_comma_separator}}",money_with_currency_format:"${{amount_with_comma_separator}} UYU"},VUV:{money_format:"${{amount}}",money_with_currency_format:"${{amount}}VT"},VEF:{money_format:"Bs. {{amount_with_comma_separator}}",money_with_currency_format:"Bs. {{amount_with_comma_separator}} VEF"},VND:{money_format:"{{amount_no_decimals_with_comma_separator}}&#8363;",money_with_currency_format:"{{amount_no_decimals_with_comma_separator}} VND"},XBT:{money_format:"{{amount_no_decimals}} BTC",money_with_currency_format:"{{amount_no_decimals}} BTC"},XOF:{money_format:"CFA{{amount}}",money_with_currency_format:"CFA{{amount}} XOF"},ZMW:{money_format:"K{{amount_no_decimals_with_comma_separator}}",money_with_currency_format:"ZMW{{amount_no_decimals_with_comma_separator}}"}};Currency.formatMoney=function(b,g){if(typeof Shopify.formatMoney==="function"){return Shopify.formatMoney(b,g)}if(typeof b=="string"){b=b.replace(".","")}var f="";var e=/\{\{\s*(\w+)\s*\}\}/;var a=g||"${{amount}}";function c(h,i){return(typeof h=="undefined"?i:h)}function d(m,k,l,j){k=c(k,2);l=c(l,",");j=c(j,".");if(isNaN(m)||m==null){return 0}m=(m/100).toFixed(k);var n=m.split("."),i=n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+l),h=n[1]?(j+n[1]):"";return i+h}switch(a.match(e)[1]){case"amount":f=d(b,2);break;case"amount_no_decimals":f=d(b,0);break;case"amount_with_comma_separator":f=d(b,2,".",",");break;case"amount_no_decimals_with_comma_separator":f=d(b,0,".",",");break}return a.replace(e,f)};Currency.currentCurrency="";Currency.format="money_with_currency_format";Currency.convertAll=function(c,b,a,d){jQuery(a||"span.money").each(function(){if(jQuery(this).attr("data-currency")===b){return}if(jQuery(this).attr("data-currency-"+b)){jQuery(this).html(jQuery(this).attr("data-currency-"+b))}else{var e=0;var f=Currency.moneyFormats[c][d||Currency.format]||"{{amount}}";var g=Currency.moneyFormats[b][d||Currency.format]||"{{amount}}";if(f.indexOf("amount_no_decimals")!==-1){e=Currency.convert(parseInt(jQuery(this).html().replace(/[^0-9]/g,""),10)*100,c,b)}else{if(c==="JOD"||c=="KWD"||c=="BHD"){e=Currency.convert(parseInt(jQuery(this).html().replace(/[^0-9]/g,""),10)/10,c,b)}else{e=Currency.convert(parseInt(jQuery(this).html().replace(/[^0-9]/g,""),10),c,b)}}var h=Currency.formatMoney(e,g);jQuery(this).html(h);jQuery(this).attr("data-currency-"+b,h)}jQuery(this).attr("data-currency",b)});this.currentCurrency=b;this.cookie.write(b)};
//------ scripts/models/addToCart.js
Theme.AddToCart = (function ($) {

    function addToCart(button) {
        if (button.closest('.mr-shop').hasClass('mr-shop--wholesale')) {
            var totalSize = parseInt(button.closest('.btn-wrapper').siblings('.content-wrapper').find('.total-size').text());
            var toAdd = [];
            for (i = 0; i < totalSize; i++) {
                if (button.closest('.btn-wrapper').siblings('.content-wrapper').find('.product-variants').find("#quantity-" + i).val() != 0) {
                    toAdd.push({
                        variant_id: button.closest('.btn-wrapper').siblings('.content-wrapper').find('.product-variants').find("#variant-" + i).val(),
                        quantity_id: button.closest('.btn-wrapper').siblings('.content-wrapper').find('.product-variants').find("#quantity-" + i).val() || 0
                    });
                }
            }
            totalSize = toAdd.length;
        }
        var wrapperID = button.closest('.product').attr("id");
        var modalID = button.closest('.modal-shop').attr("id");
        var form = button.closest('form#add-to-cart-form');
        var formIsValid = true;
        var message = "<div class='validation-fail'>Please fill out this field</div>";

        form.find('[name^="properties"]').filter('.required, [required="required"]').each(function () {
            jQuery(this).removeClass('error');
            jQuery('.validation-fail').remove();
            if (jQuery(this).closest('.product-customizer-select-wrap').length) {
                jQuery(this).closest('.product-customizer-select-wrap').removeClass('error');
            }
            if (jQuery(this).val() == '') {
                formIsValid = false;
                message = jQuery(this).attr('data-error') || message;
                if (jQuery(this).closest('.product-customizer-select-wrap').length) {
                    jQuery(this).closest('.product-customizer-select-wrap').addClass('error');
                } else {
                    jQuery(this).addClass('error');
                }
            }
        });
        if (formIsValid) {
            if (button.closest('.mr-shop').hasClass('mr-shop--wholesale') && toAdd) {
                var i = 0;
                bulkCart(i, toAdd, totalSize, wrapperID, modalID);
            } else {
                var data = form.serialize();
                jQuery.ajax({
                    url: '/cart/add.js',
                    dataType: 'json',
                    data: data,
                    method: "POST",
                    success: function (data, textStatus, jqXHR) {
                        updateCart();
                        // Make the check out button visible
                        jQuery('#' + wrapperID + ' .btn-check-out').addClass("visible");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        // Close the modal if we're in one
                        if (modalID) {
                            jQuery('#' + modalID).modal('hide');
                        }
                        var response = JSON.parse(jqXHR.responseText);
                        var status = response.status;
                        var label = response.message;
                        var description = response.description;
                        if (status == 422) {
                            jQuery('#modal-alert-status').text("Available stock allocated.");
                        } else {
                            jQuery('#modal-alert-status').text("");
                        }
                        jQuery('#modal-alert-label').text(label);
                        jQuery('#modal-alert-description').text(description);
                        jQuery('#modal-alert').modal('show');
                    }
                });
            }
        } else {
            jQuery('.error').after(message);
        }


    }

    function bulkCart(count, array, totalSize, wrapperID, modalID) {
        if (count < totalSize) {
            var request = array[count];
            var tempId = request.variant_id;
            var tempQty = request.quantity_id;
            var data = 'quantity=' + tempQty + '&id=' + tempId;
            jQuery.ajax({
                url: '/cart/add.js',
                dataType: 'json',
                data: data,
                method: "POST",
                success: function (data, textStatus, jqXHR) {
                    count++;
                    bulkCart(count, array, totalSize, wrapperID, modalID);
                    updateCart();
                    // Make the check out button visible
                    jQuery('#' + wrapperID + ' .btn-check-out').addClass("visible");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Close the modal if we're in one
                    if (modalID) {
                        jQuery('#' + modalID).modal('hide');
                    }
                    var response = JSON.parse(jqXHR.responseText);
                    var status = response.status;
                    var label = response.message;
                    var description = response.description;
                    if (status == 422) {
                        jQuery('#modal-alert-status').text("Available stock allocated.");
                    } else {
                        jQuery('#modal-alert-status').text("");
                    }
                    jQuery('#modal-alert-label').text(label);
                    jQuery('#modal-alert-description').text(description);
                    jQuery('#modal-alert').modal('show');
                }
            });
        }
    }

    function updateCart() {
        jQuery.ajax({
            url: '/cart.js',
            dataType: 'json',
            method: "GET",
            success: function (data, textStatus, jqXHR) {
                var itemsInCart = data.item_count;
                if (itemsInCart) {
                    jQuery('.items-in-cart').text("" + itemsInCart);
                } else {
                    jQuery('.items-in-cart').text("0");
                }
            }
        });
    }

    return {
        addToCart: addToCart,
        updateCart: updateCart
    };
})(Theme.jQuery);
//------ scripts/models/currencies.js
Theme.Currencies = (function ($) {
    function init() {
        jQuery('.currency-picker').on('change', function () {
            jQuery('.currency-picker').not(this).val(jQuery(this).val());
        })
    }

    return {
        init: init
    };
})(Theme.jQuery);
//------ scripts/models/login.js
Theme.Login = (function ($) {
    function init() {
        jQuery('div.mr-popup__wrapper').addClass('in');
    }

    return {
        init: init
    };
})(Theme.jQuery);
//------ scripts/controllers/categories.controllers.js
(function ($) {
    jQuery(function () {
        jQuery('.modal-shop').on('show.bs.modal', function (e) {
            var button = jQuery(e.relatedTarget);
            var shop = button.data('shop');
            jQuery(this).find('.mr-shop--' + shop).addClass('on');
        }).on('hide.bs.modal', function (e) {
            jQuery(this).find('.mr-shop').removeClass('on');
        })
    });

})(Theme.jQuery);

//------ scripts/controllers/product.controllers.js
(function ($) {
    jQuery(function () {
        // disable mousewheel on a input number field when in focus
        // (to prevent Cromium browsers change the value when scrolling)
        jQuery('input[type=number]').on('focus', function (e) {
            jQuery(this).on('mousewheel.disableScroll', function (e) {
                e.preventDefault()
            })
        });
        jQuery('input[type=number]').on('blur', function (e) {
            jQuery(this).off('mousewheel.disableScroll')
        });

        jQuery('.quantity__wrapper input').on('keyup', function () {
            // qty*price
            var price_without_currency = jQuery(this).closest('td').siblings('td.wholesale-price').text().replace(/[^\d.]/ig, '');
            var single_total_without_currency = jQuery(this).val() * price_without_currency;
            var currentCurrency = Currency.currentCurrency;
            var currentCurrencyFormat = Currency.moneyFormats[currentCurrency][Currency.format];
            var single_total_with_currency = currentCurrencyFormat.replace('{{amount}}', single_total_without_currency.toFixed(2));
            jQuery(this).closest('td').siblings('td.total').html('<span class="money">' + single_total_with_currency + '</span>');

            // calculate sum
            var qtyTotal = 0;
            var amount = 0;
            jQuery('.quantity__wrapper input').each(function () {
                var num = parseInt(this.value, 10);
                if (!isNaN(num)) {
                    qtyTotal += num;
                }
                jQuery('td div.tfoot__subtotal').html(qtyTotal);
            });

            jQuery('table tbody td.total span.money').each(function () {
                var individualTotal = parseFloat(jQuery(this).text().replace(/[^\d.]/ig, ''));
                if (!isNaN(individualTotal)) {
                    amount += individualTotal;
                }
                var amount_with_currency = currentCurrencyFormat.replace('{{amount}}', amount.toFixed(2));
                jQuery('.tfoot__total_ammout').html(amount_with_currency);
            });
        });
        jQuery('.option-type-mr-overall-size').each(function () {
            jQuery(this).appendTo(jQuery(this).siblings('.option-type-text-group--size'));
        });
        jQuery('.option-type-mr-overall-initials').each(function () {
            jQuery(this).appendTo(jQuery(this).siblings('.option-type-text-group--initials'));
        });
        jQuery('.option-type-mr-overall-inscription').each(function () {
            jQuery(this).appendTo(jQuery(this).siblings('.option-type-text-group--inscription'));
        });
        jQuery('.option-type-mr-overall-notes').each(function () {
            jQuery(this).appendTo(jQuery(this).siblings('.option-type-text-group--notes'));
        });
        jQuery('.mr-selectpicker').selectpicker();
        jQuery('.mr-selectpicker--horn-variance').on('changed.bs.select', function (e) {
            jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').find('img.option-type-image').hide();
            if (jQuery(this).val() == 'Black') {
                jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').addClass('mr-black-chosen').removeClass('mr-blonde-chosen mr-back-white-chosen mr-dark-brown-chosen');
                jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').find('img.option-type-image--black').show();
            } else if (jQuery(this).val() == 'Black and White') {
                jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').addClass('mr-back-white-chosen').removeClass('mr-black-chosen mr-blonde-chosen mr-dark-brown-chosen');
                jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').find('img.option-type-image--black_white').show();
            } else if (jQuery(this).val() == 'Dark Brown') {
                jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').addClass('mr-dark-brown-chosen').removeClass('mr-black-chosen mr-blonde-chosen mr-dark-brown-chosen');
                jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').find('img.option-type-image--dark_brown').show();
            } else if (jQuery(this).val() == 'Blonde') {
                jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').addClass('mr-blonde-chosen').removeClass('mr-black-chosen mr-back-white-chosen mr-dark-brown-chosen');
                jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').find('img.option-type-image--blonde').show();
            }
        });

        jQuery('.option-type-mr-overall-initials input').on('keyup', function () {
            jQuery(this).closest('.option-type-text-group--initials').siblings('.option-type-mr-overall-general').first().find('.product-customizer-select-wrap').removeClass('error');
            jQuery('.validation-fail').remove();
            if (jQuery(this).closest('.option-type-text-group--initials').siblings('.option-type-mr-overall-general').first().find('select.mr-selectpicker--horn-variance').val() == '') {
                jQuery(this).closest('.option-type-text-group--initials').siblings('.option-type-mr-overall-general').first().find('.product-customizer-select-wrap').addClass('error');
                jQuery(this).closest('.option-type-text-group--initials').siblings('.option-type-mr-overall-general').first().find('.product-customizer-select-wrap').after("<div class='validation-fail'>Please fill out this field</div>");
                jQuery(this).val('');
                return
            }
            var abc = jQuery(this).attr("placeholder").toLowerCase();
            jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').find('.product-customizer-image-group__initials span.initials-' + abc + '').text(jQuery(this).val());
        });

        jQuery('.option-type-mr-overall-inscription input').on('keyup', function () {
            jQuery(this).closest('.option-type-text-group--inscription').siblings('.option-type-mr-overall-general').first().find('.product-customizer-select-wrap').removeClass('error');
            jQuery('.validation-fail').remove();
            if (jQuery(this).closest('.option-type-text-group--inscription').siblings('.option-type-mr-overall-general').first().find('select.mr-selectpicker--horn-variance').val() == '') {
                jQuery(this).closest('.option-type-text-group--inscription').siblings('.option-type-mr-overall-general').first().find('.product-customizer-select-wrap').addClass('error');
                jQuery(this).closest('.option-type-text-group--inscription').siblings('.option-type-mr-overall-general').first().find('.product-customizer-select-wrap').after("<div class='validation-fail'>Please fill out this field</div>");
                jQuery(this).val('');
                return
            }
            jQuery(this).closest('.product-customizer-options').siblings('.product-customizer-image-group').find('.product-customizer-image-group__inscription').text(jQuery(this).val());
        });
    });

})(Theme.jQuery);
