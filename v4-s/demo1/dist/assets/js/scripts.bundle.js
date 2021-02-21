"use strict";

// Component Definition
var KTApp = function() {
    /** @type {object} colors State colors **/
    var settings = {};

    var initTooltip = function(el) {
        var theme = el.data('theme') ? 'tooltip-' + el.data('theme') : '';
        var width = el.data('width') == 'auto' ? 'tooltop-auto-width' : '';
        var trigger = el.data('trigger') ? el.data('trigger') : 'hover';

        $(el).tooltip({
            trigger: trigger,
            template: '<div class="tooltip ' + theme + ' ' + width + '" role="tooltip">\
                <div class="arrow"></div>\
                <div class="tooltip-inner"></div>\
            </div>'
        });
    }

    var initTooltips = function() {
        // init bootstrap tooltips
        $('[data-toggle="tooltip"]').each(function() {
            initTooltip($(this));
        });
    }

    var initPopover = function(el) {
        var skin = el.data('skin') ? 'popover-' + el.data('skin') : '';
        var triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';

        el.popover({
            trigger: triggerValue,
            template: '\
            <div class="popover ' + skin + '" role="tooltip">\
                <div class="arrow"></div>\
                <h3 class="popover-header"></h3>\
                <div class="popover-body"></div>\
            </div>'
        });
    }

    var initPopovers = function() {
        // init bootstrap popover
        $('[data-toggle="popover"]').each(function() {
            initPopover($(this));
        });
    }

    var initFileInput = function() {
        // init bootstrap popover
        $('.custom-file-input').on('change', function() {
            var fileName = $(this).val();
            $(this).next('.custom-file-label').addClass("selected").html(fileName);
        });
    }

    var initScroll = function() {
        $('[data-scroll="true"]').each(function() {
            var el = $(this);

            KTUtil.scrollInit(this, {
                mobileNativeScroll: true,
                handleWindowResize: true,
                rememberPosition: (el.data('remember-position') == 'true' ? true : false)
            });
        });
    }

    var initAlerts = function() {
        // init bootstrap popover
        $('body').on('click', '[data-close=alert]', function() {
            $(this).closest('.alert').hide();
        });
    }

    var initCard = function(el, options) {
        // init card tools
        var el = $(el);
        var card = new KTCard(el[0], options);
    }

    var initCards = function() {
        // init card tools
        $('[data-card="true"]').each(function() {
            var el = $(this);
            var options = {};

            if (el.data('data-card-initialized') !== true) {
                initCard(el, options);
                el.data('data-card-initialized', true);
            }
        });
    }

    var initStickyCard = function() {
        if (typeof Sticky === 'undefined') {
            return;
        }

        var sticky = new Sticky('[data-sticky="true"]');
    }

    var initAbsoluteDropdown = function(context) {
        var dropdownMenu;

        if (!context) {
            return;
        }

        $('body').on('show.bs.dropdown', context, function(e) {
        	dropdownMenu = $(e.target).find('.dropdown-menu');
        	$('body').append(dropdownMenu.detach());
        	dropdownMenu.css('display', 'block');
        	dropdownMenu.position({
        		'my': 'right top',
        		'at': 'right bottom',
        		'of': $(e.relatedTarget),
        	});
        }).on('hide.bs.dropdown', context, function(e) {
        	$(e.target).append(dropdownMenu.detach());
        	dropdownMenu.hide();
        });
    }

    var initAbsoluteDropdowns = function() {
        $('body').on('show.bs.dropdown', function(e) {
            // e.target is always parent (contains toggler and menu)
            var $toggler = $(e.target).find("[data-attach='body']");
            if ($toggler.length === 0) {
                return;
            }
            var $dropdownMenu = $(e.target).find('.dropdown-menu');
            // save detached menu
            var $detachedDropdownMenu = $dropdownMenu.detach();
            // save reference to detached menu inside data of toggler
            $toggler.data('dropdown-menu', $detachedDropdownMenu);

            $('body').append($detachedDropdownMenu);
            $detachedDropdownMenu.css('display', 'block');
            $detachedDropdownMenu.position({
                my: 'right top',
                at: 'right bottom',
                of: $(e.relatedTarget),
            });
        });

        $('body').on('hide.bs.dropdown', function(e) {
            var $toggler = $(e.target).find("[data-attach='body']");
            if ($toggler.length === 0) {
                return;
            }
            // access to reference of detached menu from data of toggler
            var $detachedDropdownMenu = $toggler.data('dropdown-menu');
            // re-append detached menu inside parent
            $(e.target).append($detachedDropdownMenu.detach());
            // hide dropdown
            $detachedDropdownMenu.hide();
        });
    };

    return {
        init: function(settingsArray) {
            if (settingsArray) {
                settings = settingsArray;
            }

            KTApp.initComponents();
        },

        initComponents: function() {
            initScroll();
            initTooltips();
            initPopovers();
            initAlerts();
            initFileInput();
            initCards();
            initStickyCard();
            initAbsoluteDropdowns();
        },

        initTooltips: function() {
            initTooltips();
        },

        initTooltip: function(el) {
            initTooltip(el);
        },

        initPopovers: function() {
            initPopovers();
        },

        initPopover: function(el) {
            initPopover(el);
        },

        initCard: function(el, options) {
            initCard(el, options);
        },

        initCards: function() {
            initCards();
        },

        initSticky: function() {
            initSticky();
        },

        initAbsoluteDropdown: function(context) {
            initAbsoluteDropdown(context);
        },

        block: function(target, options) {
            var el = $(target);

            options = $.extend(true, {
                opacity: 0.05,
                overlayColor: '#000000',
                type: '',
                size: '',
                state: 'primary',
                centerX: true,
                centerY: true,
                message: '',
                shadow: true,
                width: 'auto'
            }, options);

            var html;
            var version = options.type ? 'spinner-' + options.type : '';
            var state = options.state ? 'spinner-' + options.state : '';
            var size = options.size ? 'spinner-' + options.size : '';
            var spinner = '<span class="spinner ' + version + ' ' + state + ' ' + size + '"></span';

            if (options.message && options.message.length > 0) {
                var classes = 'blockui ' + (options.shadow === false ? 'blockui' : '');

                html = '<div class="' + classes + '"><span>' + options.message + '</span>' + spinner + '</div>';

                var el = document.createElement('div');

                $('body').prepend(el);
                KTUtil.addClass(el, classes);
                el.innerHTML = html;
                options.width = KTUtil.actualWidth(el) + 10;
                KTUtil.remove(el);

                if (target == 'body') {
                    html = '<div class="' + classes + '" style="margin-left:-' + (options.width / 2) + 'px;"><span>' + options.message + '</span><span>' + spinner + '</span></div>';
                }
            } else {
                html = spinner;
            }

            var params = {
                message: html,
                centerY: options.centerY,
                centerX: options.centerX,
                css: {
                    top: '30%',
                    left: '50%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none',
                    width: options.width
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor,
                    opacity: options.opacity,
                    cursor: 'wait',
                    zIndex: (target == 'body' ? 1100 : 10)
                },
                onUnblock: function() {
                    if (el && el[0]) {
                        KTUtil.css(el[0], 'position', '');
                        KTUtil.css(el[0], 'zoom', '');
                    }
                }
            };

            if (target == 'body') {
                params.css.top = '50%';
                $.blockUI(params);
            } else {
                var el = $(target);
                el.block(params);
            }
        },

        unblock: function(target) {
            if (target && target != 'body') {
                $(target).unblock();
            } else {
                $.unblockUI();
            }
        },

        blockPage: function(options) {
            return KTApp.block('body', options);
        },

        unblockPage: function() {
            return KTApp.unblock('body');
        },

        getSettings: function() {
            return settings;
        }
    };
}();

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTApp;
}

// Initialize KTApp class on document ready
$(document).ready(function() {
    KTApp.init(KTAppSettings);
});

// CSS3 Transitions only after page load(.page-loading class added to body tag and remove with JS on page load)
window.onload = function() {
    var result = KTUtil.getByTagName('body');
    if (result && result[0]) {
        KTUtil.removeClass(result[0], 'page-loading');
    }
}
"use strict";

// Component Definition
var KTCard = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        toggleSpeed: 400,
        sticky: {
            releseOnReverse: false,
            offset: 300,
            zIndex: 101
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('card')) {
                the = KTUtil.data(element).get('card');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('card', the);
            }

            return the;
        },

        /**
         * Init card
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
            the.header = KTUtil.child(element, '.card-header');
            the.footer = KTUtil.child(element, '.card-footer');

            if (KTUtil.child(element, '.card-body')) {
                the.body = KTUtil.child(element, '.card-body');
            } else if (KTUtil.child(element, '.form')) {
                the.body = KTUtil.child(element, '.form');
            }
        },

        /**
         * Build Form Wizard
         */
        build: function() {
            // Remove
            var remove = KTUtil.find(the.header, '[data-card-tool=remove]');
            if (remove) {
                KTUtil.addEvent(remove, 'click', function(e) {
                    e.preventDefault();
                    Plugin.remove();
                });
            }

            // Reload
            var reload = KTUtil.find(the.header, '[data-card-tool=reload]');
            if (reload) {
                KTUtil.addEvent(reload, 'click', function(e) {
                    e.preventDefault();
                    Plugin.reload();
                });
            }

            // Toggle
            var toggle = KTUtil.find(the.header, '[data-card-tool=toggle]');
            if (toggle) {
                KTUtil.addEvent(toggle, 'click', function(e) {
                    e.preventDefault();
                    Plugin.toggle();
                });
            }
        },

        /**
         * Enable stickt mode
         */
        initSticky: function() {
            var lastScrollTop = 0;
            var offset = the.options.sticky.offset;

            if (!the.header) {
                return;
            }

	        window.addEventListener('scroll', Plugin.onScrollSticky);
        },

	    /**
	     * Window scroll handle event for sticky card
	     */
	    onScrollSticky: function(e) {
		    var offset = the.options.sticky.offset;

		    if(isNaN(offset)) return;

		    var st = KTUtil.getScrollTop();

		    if (st >= offset && KTUtil.hasClass(body, 'card-sticky-on') === false) {
			    Plugin.eventTrigger('stickyOn');

			    KTUtil.addClass(body, 'card-sticky-on');

			    Plugin.updateSticky();

		    } else if ((st*1.5) <= offset && KTUtil.hasClass(body, 'card-sticky-on')) {
			    // Back scroll mode
			    Plugin.eventTrigger('stickyOff');

			    KTUtil.removeClass(body, 'card-sticky-on');

			    Plugin.resetSticky();
		    }
	    },

        updateSticky: function() {
            if (!the.header) {
                return;
            }

            var top;

            if (KTUtil.hasClass(body, 'card-sticky-on')) {
                if (the.options.sticky.position.top instanceof Function) {
                    top = parseInt(the.options.sticky.position.top.call(this, the));
                } else {
                    top = parseInt(the.options.sticky.position.top);
                }

                var left;
                if (the.options.sticky.position.left instanceof Function) {
                    left = parseInt(the.options.sticky.position.left.call(this, the));
                } else {
                    left = parseInt(the.options.sticky.position.left);
                }

                var right;
                if (the.options.sticky.position.right instanceof Function) {
                    right = parseInt(the.options.sticky.position.right.call(this, the));
                } else {
                    right = parseInt(the.options.sticky.position.right);
                }

                KTUtil.css(the.header, 'z-index', the.options.sticky.zIndex);
                KTUtil.css(the.header, 'top', top + 'px');
                KTUtil.css(the.header, 'left', left + 'px');
                KTUtil.css(the.header, 'right', right + 'px');
            }
        },

        resetSticky: function() {
            if (!the.header) {
                return;
            }

            if (KTUtil.hasClass(body, 'card-sticky-on') === false) {
                KTUtil.css(the.header, 'z-index', '');
                KTUtil.css(the.header, 'top', '');
                KTUtil.css(the.header, 'left', '');
                KTUtil.css(the.header, 'right', '');
            }
        },

        /**
         * Remove card
         */
        remove: function() {
            if (Plugin.eventTrigger('beforeRemove') === false) {
                return;
            }

            // Remove tooltips
            var tooltips;
            if ( tooltips = document.querySelectorAll('.tooltip.show') ) {
                $(tooltips).tooltip('dispose');
            }

            KTUtil.remove(element);

            Plugin.eventTrigger('afterRemove');
        },

        /**
         * Set content
         */
        setContent: function(html) {
            if (html) {
                the.body.innerHTML = html;
            }
        },

        /**
         * Get body
         */
        getBody: function() {
            return the.body;
        },

        /**
         * Get self
         */
        getSelf: function() {
            return element;
        },

        /**
         * Reload
         */
        reload: function() {
            Plugin.eventTrigger('reload');
        },

        /**
         * Toggle
         */
        toggle: function() {
            if (KTUtil.hasClass(element, 'card-collapse') || KTUtil.hasClass(element, 'card-collapsed')) {
                Plugin.expand();
            } else {
                Plugin.collapse();
            }
        },

        /**
         * Collapse
         */
        collapse: function() {
            if (Plugin.eventTrigger('beforeCollapse') === false) {
                return;
            }

            KTUtil.slideUp(the.body, the.options.toggleSpeed, function() {
                Plugin.eventTrigger('afterCollapse');
            });

            KTUtil.addClass(element, 'card-collapse');
        },

        /**
         * Expand
         */
        expand: function() {
            if (Plugin.eventTrigger('beforeExpand') === false) {
                return;
            }

            KTUtil.slideDown(the.body, the.options.toggleSpeed, function() {
                Plugin.eventTrigger('afterExpand');
            });

            KTUtil.removeClass(element, 'card-collapse');
            KTUtil.removeClass(element, 'card-collapsed');
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            //KTUtil.triggerCustomEvent(name);
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Remove card
     */
    the.remove = function() {
        return Plugin.remove(html);
    };

    /**
     * Init sticky card
     */
    the.initSticky = function() {
        return Plugin.initSticky();
    };

    /**
     * Rerender sticky layout
     */
    the.updateSticky = function() {
        return Plugin.updateSticky();
    };

    /**
     * Reset the sticky
     */
    the.resetSticky = function() {
        return Plugin.resetSticky();
    };

	/**
	 * Destroy sticky card
	 */
	the.destroySticky = function() {
		Plugin.resetSticky();
		window.removeEventListener('scroll', Plugin.onScrollSticky);
	};

    /**
     * Reload card
     */
    the.reload = function() {
        return Plugin.reload();
    };

    /**
     * Set card content
     */
    the.setContent = function(html) {
        return Plugin.setContent(html);
    };

    /**
     * Toggle card
     */
    the.toggle = function() {
        return Plugin.toggle();
    };

    /**
     * Collapse card
     */
    the.collapse = function() {
        return Plugin.collapse();
    };

    /**
     * Expand card
     */
    the.expand = function() {
        return Plugin.expand();
    };

    /**
     * Get cardbody
     * @returns {jQuery}
     */
    the.getBody = function() {
        return Plugin.getBody();
    };

    /**
     * Get cardbody
     * @returns {jQuery}
     */
    the.getSelf = function() {
        return Plugin.getSelf();
    };

    /**
     * Attach event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTCard;
}

"use strict";
// DOCS: https://javascript.info/cookie

// Component Definition
var KTCookie = function() {
  return {
    // returns the cookie with the given name,
    // or undefined if not found
    getCookie: function(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    // Please note that a cookie value is encoded,
    // so getCookie uses a built-in decodeURIComponent function to decode it.
    setCookie: function(name, value, options) {
      if (!options) {
          options = {};
      }

      options = Object.assign({}, {path: '/'}, options);

      if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
      }

      var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

      for (var optionKey in options) {
        if (!options.hasOwnProperty(optionKey)) {
          continue;
        }
        updatedCookie += "; " + optionKey;
        var optionValue = options[optionKey];
        if (optionValue !== true) {
          updatedCookie += "=" + optionValue;
        }
      }

      document.cookie = updatedCookie;
    },
    // To delete a cookie, we can call it with a negative expiration date:
    deleteCookie: function(name) {
      setCookie(name, "", {
        'max-age': -1
      })
    }
  }
}();

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = KTCookie;
}

"use strict";

// Component Definition 
var KTDialog = function(options) {
    // Main object
    var the = this;

    // Get element object
    var element;
    var body = KTUtil.getBody();

    // Default options
    var defaultOptions = {
        'placement' : 'top center',
        'type'  : 'loader',
        'width' : 100,
        'state' : 'default',
        'message' : 'Loading...'
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            Plugin.init(options);

            return the;
        },

        /**
         * Handles subtoggle click toggle
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            the.state = false;
        },

        /**
         * Show dialog
         */
        show: function() {
            Plugin.eventTrigger('show');

            element = document.createElement("DIV");
            KTUtil.setHTML(element, the.options.message);

            KTUtil.addClass(element, 'dialog dialog-shown');
            KTUtil.addClass(element, 'dialog-' + the.options.state);
            KTUtil.addClass(element, 'dialog-' + the.options.type);

            if (the.options.placement == 'top center') {
                KTUtil.addClass(element, 'dialog-top-center');
            }

            body.appendChild(element);

            the.state = 'shown';

            Plugin.eventTrigger('shown');

            return the;
        },

        /**
         * Hide dialog
         */
        hide: function() {
            if (element) {
                Plugin.eventTrigger('hide');

                element.remove();
                the.state = 'hidden';

                Plugin.eventTrigger('hidden');
            }

            return the;
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];

                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Check shown state
     */
    the.shown = function() {
        return the.state == 'shown';
    };

    /**
     * Check hidden state
     */
    the.hidden = function() {
        return the.state == 'hidden';
    };

    /**
     * Show dialog
     */
    the.show = function() {
        return Plugin.show();
    };

    /**
     * Hide dialog
     */
    the.hide = function() {
        return Plugin.hide();
    };

    /**
     * Attach event
     * @returns {KTToggle}
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @returns {KTToggle}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTDialog;
}

"use strict";

// Component Definition
var KTHeader = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (element === undefined) {
        return;
    }

    // Default options
    var defaultOptions = {
        offset: {
            desktop: true,
            tabletAndMobile: true
        },
        releseOnReverse: {
            desktop: false,
            tabletAndMobile: false
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {KTHeader}
         */
        construct: function(options) {
            if (KTUtil.data(element).has('header')) {
                the = KTUtil.data(element).get('header');
            } else {
                // reset header
                Plugin.init(options);

                // build header
                Plugin.build();

                KTUtil.data(element).set('header', the);
            }

            return the;
        },

        /**
         * Handles subheader click toggle
         * @returns {KTHeader}
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        /**
         * Reset header
         * @returns {KTHeader}
         */
        build: function() {
            var eventTriggerState = true;
            var lastScrollTop = 0;

            window.addEventListener('scroll', function() {
                var offset = 0, st, attrName;

                if (KTUtil.isBreakpointDown('lg') && the.options.offset.tabletAndMobile === false) {
                    return;
                }

                if (KTUtil.isBreakpointUp('lg') && the.options.offset.desktop === false) {
                    return;
                }

                if (KTUtil.isBreakpointUp('lg')) {
                    offset = the.options.offset.desktop;
                } else if (KTUtil.isBreakpointDown('lg')) {
                    offset = the.options.offset.tabletAndMobile;
                }

                st = KTUtil.getScrollTop();

                if (
                    (KTUtil.isBreakpointDown('lg') && the.options.releseOnReverse.tabletAndMobile) ||
                    (KTUtil.isBreakpointUp('lg') && the.options.releseOnReverse.desktop)
                ) {
                    if (st > offset && lastScrollTop < st) { // down scroll mode
                        if (body.hasAttribute('data-header-scroll') === false) {
                            body.setAttribute('data-header-scroll', 'on');
                        }

                        if (eventTriggerState) {
                            Plugin.eventTrigger('scrollOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        if (body.hasAttribute('data-header-scroll') === true) {
                            body.removeAttribute('data-header-scroll');
                        }

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('scrollOff', the);
                            eventTriggerState = true;
                        }
                    }

                    lastScrollTop = st;
                } else {
                    if (st > offset) { // down scroll mode
                        if (body.hasAttribute('data-header-scroll') === false) {
                            body.setAttribute('data-header-scroll', 'on');
                        }

                        if (eventTriggerState) {
                            Plugin.eventTrigger('scrollOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        if (body.hasAttribute('data-header-scroll') === true) {
                            body.removeAttribute('data-header-scroll');
                        }

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('scrollOff', the);
                            eventTriggerState = true;
                        }
                    }
                }
            });
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the, args);
                        }
                    } else {
                        return event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Register event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTHeader;
}

"use strict";

// Component Definition 
var KTImageInput = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        editMode: false
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('imageinput')) {
                the = KTUtil.data(element).get('imageinput');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('imageinput', the);
            }

            return the;
        },

        /**
         * Init avatar
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            the.input = KTUtil.find(element, 'input[type="file"]');
            the.wrapper = KTUtil.find(element, '.image-input-wrapper');
            the.cancel = KTUtil.find(element, '[data-action="cancel"]');
            the.remove = KTUtil.find(element, '[data-action="remove"]');
            the.src = KTUtil.css(the.wrapper, 'backgroundImage');
            the.hidden = KTUtil.find(element, 'input[type="hidden"]');

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        /**
         * Build
         */
        build: function() {
            // Handle change
            KTUtil.addEvent(the.input, 'change', function(e) {
                e.preventDefault();

	            if (the.input && the.input.files && the.input.files[0]) {
	                var reader = new FileReader();
	                reader.onload = function(e) {
	                    KTUtil.css(the.wrapper, 'background-image', 'url('+e.target.result +')');
	                }
	                reader.readAsDataURL(the.input.files[0]);

	                KTUtil.addClass(the.element, 'image-input-changed');
                    KTUtil.removeClass(the.element, 'image-input-empty');

                    // Fire change event
                    Plugin.eventTrigger('change');
	            }
            });

            // Handle cancel
            KTUtil.addEvent(the.cancel, 'click', function(e) {
                e.preventDefault();

                // Fire cancel event
                Plugin.eventTrigger('cancel');

	            KTUtil.removeClass(the.element, 'image-input-changed');
                KTUtil.removeClass(the.element, 'image-input-empty');
	            KTUtil.css(the.wrapper, 'background-image', the.src);
	            the.input.value = "";

                if (the.hidden) {
                    the.hidden.value = "0";
                }
            });

            // Handle remove
            KTUtil.addEvent(the.remove, 'click', function(e) {
                e.preventDefault();

                // Fire cancel event
                Plugin.eventTrigger('remove');

	            KTUtil.removeClass(the.element, 'image-input-changed');
                KTUtil.addClass(the.element, 'image-input-empty');
	            KTUtil.css(the.wrapper, 'background-image', "none");
	            the.input.value = "";

                if (the.hidden) {
                    the.hidden.value = "1";
                }
            });
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            //KTUtil.triggerCustomEvent(name);
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Attach event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTImageInput;
}

"use strict";

// Component Definition
var KTMenu = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        // scrollable area with Perfect Scroll
        scroll: {
            rememberPosition: false
        },

        // accordion submenu mode
        accordion: {
            slideSpeed: 200, // accordion toggle slide speed in milliseconds
            autoScroll: false, // enable auto scrolling(focus) to the clicked menu item
            autoScrollSpeed: 1200,
            expandAll: true // allow having multiple expanded accordions in the menu
        },

        // dropdown submenu mode
        dropdown: {
            timeout: 500 // timeout in milliseconds to show and hide the hoverable submenu dropdown
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {KTMenu}
         */
        construct: function(options) {
            if (KTUtil.data(element).has('menu')) {
                the = KTUtil.data(element).get('menu');
            } else {
                // reset menu
                Plugin.init(options);

                // reset menu
                Plugin.reset();

                // build menu
                Plugin.build();

                KTUtil.data(element).set('menu', the);
            }

            return the;
        },

        /**
         * Handles submenu click toggle
         * @returns {KTMenu}
         */
        init: function(options) {
            the.events = [];

            the.eventHandlers = {};

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

            the.uid = KTUtil.getUniqueID();
        },

        update: function(options) {
            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

             // reset menu
            Plugin.reset();

            the.eventHandlers = {};

            // build menu
            Plugin.build();

            KTUtil.data(element).set('menu', the);
        },

        reload: function() {
             // reset menu
            Plugin.reset();

            // build menu
            Plugin.build();

            // reset submenu props
            Plugin.resetSubmenuProps();
        },

        /**
         * Reset menu
         * @returns {KTMenu}
         */
        build: function() {
            // General accordion submenu toggle
            the.eventHandlers['event_1'] = KTUtil.on( element, '.menu-toggle', 'click', Plugin.handleSubmenuAccordion);

            // Dropdown mode(hoverable)
            if (Plugin.getSubmenuMode() === 'dropdown' || Plugin.isConditionalSubmenuDropdown()) {
                // dropdown submenu - hover toggle
                the.eventHandlers['event_2'] = KTUtil.on( element, '[data-menu-toggle="hover"]', 'mouseover', Plugin.handleSubmenuDrodownHoverEnter);
                the.eventHandlers['event_3'] = KTUtil.on( element, '[data-menu-toggle="hover"]', 'mouseout', Plugin.handleSubmenuDrodownHoverExit);

                // dropdown submenu - click toggle
                the.eventHandlers['event_4'] = KTUtil.on( element, '[data-menu-toggle="click"] > .menu-toggle, [data-menu-toggle="click"] > .menu-link .menu-toggle', 'click', Plugin.handleSubmenuDropdownClick);
                the.eventHandlers['event_5'] = KTUtil.on( element, '[data-menu-toggle="tab"] > .menu-toggle, [data-menu-toggle="tab"] > .menu-link .menu-toggle', 'click', Plugin.handleSubmenuDropdownTabClick);
            }

            // Handle general link click
            the.eventHandlers['event_6'] = KTUtil.on(element, '.menu-item > .menu-link:not(.menu-toggle):not(.menu-link-toggle-skip)', 'click', Plugin.handleLinkClick);

            // Init scrollable menu
            if (the.options.scroll && the.options.scroll.height) {
                Plugin.scrollInit();
            }
        },

        /**
         * Reset menu
         * @returns {KTMenu}
         */
        reset: function() {
            KTUtil.off( element, 'click', the.eventHandlers['event_1']);

            // dropdown submenu - hover toggle
            KTUtil.off( element, 'mouseover', the.eventHandlers['event_2']);
            KTUtil.off( element, 'mouseout', the.eventHandlers['event_3']);

            // dropdown submenu - click toggle
            KTUtil.off( element, 'click', the.eventHandlers['event_4']);
            KTUtil.off( element, 'click', the.eventHandlers['event_5']);

            // handle link click
            KTUtil.off(element, 'click', the.eventHandlers['event_6']);
        },

        /**
         * Init scroll menu
         *
        */
        scrollInit: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                KTUtil.scrollDestroy(element, true);
                KTUtil.scrollInit(element, {mobileNativeScroll: true, windowScroll: false, resetHeightOnDestroy: true, handleWindowResize: true, height: the.options.scroll.height, rememberPosition: the.options.scroll.rememberPosition});
            } else {
                KTUtil.scrollDestroy(element, true);
            }
        },

        /**
         * Update scroll menu
        */
        scrollUpdate: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                KTUtil.scrollUpdate(element);
            }
        },

        /**
         * Scroll top
        */
        scrollTop: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                KTUtil.scrollTop(element);
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {KTMenu}
         */
        getSubmenuMode: function(el) {
            if ( KTUtil.isBreakpointUp('lg') ) {
                if (el && KTUtil.hasAttr(el, 'data-menu-toggle') && KTUtil.attr(el, 'data-menu-toggle') == 'hover') {
                    return 'dropdown';
                }

                if ( KTUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                    if ( KTUtil.hasClasses(body, the.options.submenu.desktop.state.body) ) {
                        return the.options.submenu.desktop.state.mode;
                    } else {
                        return the.options.submenu.desktop.default;
                    }
                } else if ( KTUtil.isset(the.options.submenu, 'desktop') ) {
                    return the.options.submenu.desktop;
                }
            } else if ( KTUtil.isBreakpointUp('md') && KTUtil.isBreakpointDown('lg') && KTUtil.isset(the.options.submenu, 'tablet') ) {
                return the.options.submenu.tablet;
            } else if ( KTUtil.isBreakpointDown('md') && KTUtil.isset(the.options.submenu, 'mobile') ) {
                return the.options.submenu.mobile;
            } else {
                return false;
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {KTMenu}
         */
        isConditionalSubmenuDropdown: function() {
            if ( KTUtil.isBreakpointUp('lg') && KTUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                return true;
            } else {
                return false;
            }
        },


        /**
         * Reset submenu attributes
         * @returns {KTMenu}
         */
        resetSubmenuProps: function(e) {
            var submenus = KTUtil.findAll(element, '.menu-submenu');
            if ( submenus ) {
                for (var i = 0, len = submenus.length; i < len; i++) {
                    var submenu = submenus[0];

                    KTUtil.css(submenu, 'display', '');
                    KTUtil.css(submenu, 'overflow', '');

                    if (submenu.hasAttribute('data-hor-direction')) {
                        KTUtil.removeClass(submenu, 'menu-submenu-left');
                        KTUtil.removeClass(submenu, 'menu-submenu-right');
                        KTUtil.addClass(submenu, submenu.getAttribute('data-hor-direction'));
                    }
                }
            }
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        handleSubmenuDrodownHoverEnter: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            var item = this;

            if ( item.getAttribute('data-hover') == '1' ) {
                item.removeAttribute('data-hover');
                clearTimeout( item.getAttribute('data-timeout') );
                item.removeAttribute('data-timeout');
            }

            Plugin.showSubmenuDropdown(item);
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        handleSubmenuDrodownHoverExit: function(e) {
            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            var item = this;
            var time = the.options.dropdown.timeout;

            var timeout = setTimeout(function() {
                if ( item.getAttribute('data-hover') == '1' ) {
                    Plugin.hideSubmenuDropdown(item, true);
                }
            }, time);

            item.setAttribute('data-hover', '1');
            item.setAttribute('data-timeout', timeout);
        },

        /**
         * Handles submenu click toggle
         * @returns {KTMenu}
         */
        handleSubmenuDropdownClick: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            var item = this.closest('.menu-item');

            // Trigger click event handlers
            var result = Plugin.eventTrigger('submenuToggle', this, e);
            if (result === false) {
                return;
            }

            if ( item.getAttribute('data-menu-submenu-mode') == 'accordion' ) {
                return;
            }

            if ( KTUtil.hasClass(item, 'menu-item-hover') === false ) {
                KTUtil.addClass(item, 'menu-item-open-dropdown');
                Plugin.showSubmenuDropdown(item);
            } else {
                KTUtil.removeClass(item, 'menu-item-open-dropdown' );
                Plugin.hideSubmenuDropdown(item, true);
            }

            e.preventDefault();
        },

        /**
         * Handles tab click toggle
         * @returns {KTMenu}
         */
        handleSubmenuDropdownTabClick: function(e) {
            if (Plugin.getSubmenuMode(this) === 'accordion') {
                return;
            }
            var item = this.closest('.menu-item');

            // Trigger click event handlers
            var result = Plugin.eventTrigger('submenuToggle', this, e);
            if (result === false) {
                return;
            }

            if (item.getAttribute('data-menu-submenu-mode') == 'accordion') {
                return;
            }

            if (KTUtil.hasClass(item, 'menu-item-hover') == false) {
                KTUtil.addClass(item, 'menu-item-open-dropdown');
                Plugin.showSubmenuDropdown(item);
            }

            e.preventDefault();
        },

        /**
         * Handles link click
         * @returns {KTMenu}
         */
        handleLinkClick: function(e) {
            var submenu = this.closest('.menu-item.menu-item-submenu');

            // Trigger click event handlers
            var result = Plugin.eventTrigger('linkClick', this, e);
            if (result === false) {
                return;
            }

            if ( submenu && Plugin.getSubmenuMode(submenu) === 'dropdown' ) {
                Plugin.hideSubmenuDropdowns();
            }
        },

        /**
         * Handles submenu dropdown close on link click
         * @returns {KTMenu}
         */
        handleSubmenuDropdownClose: function(e, el) {
            // exit if its not submenu dropdown mode
            if (Plugin.getSubmenuMode(el) === 'accordion') {
                return;
            }

            var shown = element.querySelectorAll('.menu-item.menu-item-submenu.menu-item-hover:not(.menu-item-tabs)');

            // check if currently clicked link's parent item ha
            if (shown.length > 0 && KTUtil.hasClass(el, 'menu-toggle') === false && el.querySelectorAll('.menu-toggle').length === 0) {
                // close opened dropdown menus
                for (var i = 0, len = shown.length; i < len; i++) {
                    Plugin.hideSubmenuDropdown(shown[0], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {KTMenu}
         */
        handleSubmenuAccordion: function(e, el) {
            var query;
            var item = el ? el : this;

            // Trigger click event handlers
            var result = Plugin.eventTrigger('submenuToggle', this, e);
            if (result === false) {
                return;
            }

            if ( Plugin.getSubmenuMode(el) === 'dropdown' && (query = item.closest('.menu-item') ) ) {
                if (query.getAttribute('data-menu-submenu-mode') != 'accordion' ) {
                    e.preventDefault();
                    return;
                }
            }

            var li = item.closest('.menu-item');
            var submenu = KTUtil.child(li, '.menu-submenu, .menu-inner');

            if (KTUtil.hasClass(item.closest('.menu-item'), 'menu-item-open-always')) {
                return;
            }

            if ( li && submenu ) {
                e.preventDefault();
                var speed = the.options.accordion.slideSpeed;
                var hasClosables = false;

                if ( KTUtil.hasClass(li, 'menu-item-open') === false ) {
                    // hide other accordions
                    if ( the.options.accordion.expandAll === false ) {
                        var subnav = item.closest('.menu-nav, .menu-subnav');
                        var closables = KTUtil.children(subnav, '.menu-item.menu-item-open.menu-item-submenu:not(.menu-item-here):not(.menu-item-open-always)');

                        if ( subnav && closables ) {
                            for (var i = 0, len = closables.length; i < len; i++) {
                                var el_ = closables[0];
                                var submenu_ = KTUtil.child(el_, '.menu-submenu');
                                if ( submenu_ ) {
                                    KTUtil.slideUp(submenu_, speed, function() {
                                        Plugin.scrollUpdate();
                                        KTUtil.removeClass(el_, 'menu-item-open');
                                    });
                                }
                            }
                        }
                    }

                    KTUtil.slideDown(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.scrollUpdate();

                        Plugin.eventTrigger('submenuToggle', submenu, e);
                    });

                    KTUtil.addClass(li, 'menu-item-open');

                } else {
                    KTUtil.slideUp(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.scrollUpdate();
                        Plugin.eventTrigger('submenuToggle', submenu, e);
                    });

                    KTUtil.removeClass(li, 'menu-item-open');
                }
            }
        },

        /**
         * scroll to item function
         * @returns {KTMenu}
         */
        scrollToItem: function(item) {
            // handle auto scroll for accordion submenus
            if ( KTUtil.isBreakpointUp('lg')  && the.options.accordion.autoScroll && element.getAttribute('data-menu-scroll') !== '1' ) {
                KTUtil.scrollTo(item, the.options.accordion.autoScrollSpeed);
            }
        },

        /**
         * Hide submenu dropdown
         * @returns {KTMenu}
         */
        hideSubmenuDropdown: function(item, classAlso) {
            // remove submenu activation class
            if ( classAlso ) {
                KTUtil.removeClass(item, 'menu-item-hover');
                KTUtil.removeClass(item, 'menu-item-active-tab');
            }

            // clear timeout
            item.removeAttribute('data-hover');

            if ( item.getAttribute('data-menu-toggle-class') ) {
                KTUtil.removeClass(body, item.getAttribute('data-menu-toggle-class'));
            }

            var timeout = item.getAttribute('data-timeout');
            item.removeAttribute('data-timeout');
            clearTimeout(timeout);
        },

        /**
         * Hide submenu dropdowns
         * @returns {KTMenu}
         */
        hideSubmenuDropdowns: function() {
            var items;
            if ( items = element.querySelectorAll('.menu-item-submenu.menu-item-hover:not(.menu-item-tabs):not([data-menu-toggle="tab"])') ) {
                for (var j = 0, cnt = items.length; j < cnt; j++) {
                    Plugin.hideSubmenuDropdown(items[j], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {KTMenu}
         */
        showSubmenuDropdown: function(item) {
            // close active submenus
            var list = element.querySelectorAll('.menu-item-submenu.menu-item-hover, .menu-item-submenu.menu-item-active-tab');

            if ( list ) {
                for (var i = 0, len = list.length; i < len; i++) {
                    var el = list[i];
                    if ( item !== el && el.contains(item) === false && item.contains(el) === false ) {
                        Plugin.hideSubmenuDropdown(el, true);
                    }
                }
            }

            // add submenu activation class
            KTUtil.addClass(item, 'menu-item-hover');

            // Change the alignment of submenu is offscreen.
            var submenu = KTUtil.find(item, '.menu-submenu');

            if (submenu && submenu.hasAttribute('data-hor-direction') === false) {
                if (KTUtil.hasClass(submenu, 'menu-submenu-left')) {
                    submenu.setAttribute('data-hor-direction', 'menu-submenu-left');
                } else if (KTUtil.hasClass(submenu, 'menu-submenu-right')) {
                    submenu.setAttribute('data-hor-direction', 'menu-submenu-right');
                }
            }

            if ( submenu && KTUtil.isOffscreen(submenu, 'left', 15) === true ) {
                KTUtil.removeClass(submenu, 'menu-submenu-left');
                KTUtil.addClass(submenu, 'menu-submenu-right');
            } else if ( submenu && KTUtil.isOffscreen(submenu, 'right', 15) === true ) {
                KTUtil.removeClass(submenu, 'menu-submenu-right');
                KTUtil.addClass(submenu, 'menu-submenu-left');
            }

            if ( item.getAttribute('data-menu-toggle-class') ) {
                KTUtil.addClass(body, item.getAttribute('data-menu-toggle-class'));
            }
        },

        /**
         * Handles submenu slide toggle
         * @returns {KTMenu}
         */
        createSubmenuDropdownClickDropoff: function(el) {
            var query;
            var zIndex = (query = KTUtil.child(el, '.menu-submenu') ? KTUtil.css(query, 'z-index') : 0) - 1;

            var dropoff = document.createElement('<div class="menu-dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + zIndex + '"></div>');

            body.appendChild(dropoff);

            KTUtil.addEvent(dropoff, 'click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                KTUtil.remove(this);
                Plugin.hideSubmenuDropdown(el, true);
            });
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        pauseDropdownHover: function(time) {
            var date = new Date();

            the.pauseDropdownHoverTime = date.getTime() + time;
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        resumeDropdownHover: function() {
            var date = new Date();

            return (date.getTime() > the.pauseDropdownHoverTime ? true : false);
        },

        /**
         * Reset menu's current active item
         * @returns {KTMenu}
         */
        resetActiveItem: function(item) {
            var list;
            var parents;

            list = element.querySelectorAll('.menu-item-active');

            for (var i = 0, len = list.length; i < len; i++) {
                var el = list[0];
                KTUtil.removeClass(el, 'menu-item-active');
                KTUtil.hide( KTUtil.child(el, '.menu-submenu') );
                parents = KTUtil.parents(el, '.menu-item-submenu') || [];

                for (var i_ = 0, len_ = parents.length; i_ < len_; i_++) {
                    var el_ = parents[i];
                    KTUtil.removeClass(el_, 'menu-item-open');
                    KTUtil.hide( KTUtil.child(el_, '.menu-submenu') );
                }
            }

            // close open submenus
            if ( the.options.accordion.expandAll === false ) {
                if ( list = element.querySelectorAll('.menu-item-open') ) {
                    for (var i = 0, len = list.length; i < len; i++) {
                        KTUtil.removeClass(parents[0], 'menu-item-open');
                    }
                }
            }
        },

        /**
         * Sets menu's active item
         * @returns {KTMenu}
         */
        setActiveItem: function(item) {
            // reset current active item
            Plugin.resetActiveItem();

            var parents = KTUtil.parents(item, '.menu-item-submenu') || [];
            for (var i = 0, len = parents.length; i < len; i++) {
                KTUtil.addClass(parents[i], 'menu-item-open');
            }

            KTUtil.addClass(item, 'menu-item-active');
        },

        /**
         * Returns page breadcrumbs for the menu's active item
         * @returns {KTMenu}
         */
        getBreadcrumbs: function(item) {
            var query;
            var breadcrumbs = [];
            var link = KTUtil.child(item, '.menu-link');

            breadcrumbs.push({
                text: (query = KTUtil.child(link, '.menu-text') ? query.innerHTML : ''),
                title: link.getAttribute('title'),
                href: link.getAttribute('href')
            });

            var parents = KTUtil.parents(item, '.menu-item-submenu');
            for (var i = 0, len = parents.length; i < len; i++) {
                var submenuLink = KTUtil.child(parents[i], '.menu-link');

                breadcrumbs.push({
                    text: (query = KTUtil.child(submenuLink, '.menu-text') ? query.innerHTML : ''),
                    title: submenuLink.getAttribute('title'),
                    href: submenuLink.getAttribute('href')
                });
            }

            return  breadcrumbs.reverse();
        },

        /**
         * Returns page title for the menu's active item
         * @returns {KTMenu}
         */
        getPageTitle: function(item) {
            var query;

            return (query = KTUtil.child(item, '.menu-text') ? query.innerHTML : '');
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, target, e) {
            for (var i = 0; i < the.events.length; i++ ) {
                var event = the.events[i];
                if ( event.name == name ) {
                    if ( event.one == true ) {
                        if ( event.fired == false ) {
                            the.events[i].fired = true;
                            return event.handler.call(this, target, e);
                        }
                    } else {
                        return event.handler.call(this, target, e);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        },

        removeEvent: function(name) {
            if (the.events[name]) {
                delete the.events[name];
            }
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Update scroll
     */
    the.scrollUpdate = function() {
        return Plugin.scrollUpdate();
    };

    /**
     * Re-init scroll
     */
    the.scrollReInit = function() {
        return Plugin.scrollInit();
    };

    /**
     * Scroll top
     */
    the.scrollTop = function() {
        return Plugin.scrollTop();
    };

    /**
     * Set active menu item
     */
    the.setActiveItem = function(item) {
        return Plugin.setActiveItem(item);
    };

    the.reload = function() {
        return Plugin.reload();
    };

    the.update = function(options) {
        return Plugin.update(options);
    };

    /**
     * Set breadcrumb for menu item
     */
    the.getBreadcrumbs = function(item) {
        return Plugin.getBreadcrumbs(item);
    };

    /**
     * Set page title for menu item
     */
    the.getPageTitle = function(item) {
        return Plugin.getPageTitle(item);
    };

    /**
     * Get submenu mode
     */
    the.getSubmenuMode = function(el) {
        return Plugin.getSubmenuMode(el);
    };

    /**
     * Hide dropdown
     * @returns {Object}
     */
    the.hideDropdown = function(item) {
        Plugin.hideSubmenuDropdown(item, true);
    };

    /**
     * Hide dropdowns
     * @returns {Object}
     */
    the.hideDropdowns = function() {
        Plugin.hideSubmenuDropdowns();
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.pauseDropdownHover = function(time) {
        Plugin.pauseDropdownHover(time);
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.resumeDropdownHover = function() {
        return Plugin.resumeDropdownHover();
    };

    /**
     * Register event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    the.off = function(name) {
        return Plugin.removeEvent(name);
    };

    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Handle plugin on window resize
    KTUtil.addResizeHandler(function() {
        if (init) {
            the.reload();
        }
    });

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTMenu;
}

// Plugin global lazy initialization
document.addEventListener("click", function (e) {
    var body = KTUtil.getByTagName('body')[0];
    var query;
    if ( query = body.querySelectorAll('.menu-nav .menu-item.menu-item-submenu.menu-item-hover:not(.menu-item-tabs)[data-menu-toggle="click"]') ) {
        for (var i = 0, len = query.length; i < len; i++) {
            var element = query[i].closest('.menu-nav').parentNode;

            if ( element ) {
                var the = KTUtil.data(element).get('menu');

                if ( !the ) {
                    break;
                }

                if ( !the || the.getSubmenuMode() !== 'dropdown' ) {
                    break;
                }

                if ( e.target !== element && element.contains(e.target) === false ) {
                    the.hideDropdowns();
                }
            }
        }
    }
});

"use strict";

// Component Definition
var KTOffcanvas = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        attrCustom: ''
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        construct: function(options) {
            if (KTUtil.data(element).has('offcanvas')) {
                the = KTUtil.data(element).get('offcanvas');
            } else {
                // Reset offcanvas
                Plugin.init(options);

                // Build offcanvas
                Plugin.build();

                KTUtil.data(element).set('offcanvas', the);
            }

            return the;
        },

        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            the.classBase = the.options.baseClass;
            the.attrCustom = the.options.attrCustom;
            the.classShown = the.classBase + '-on';
            the.classOverlay = the.classBase + '-overlay';
            the.target;

            the.state = KTUtil.hasClass(element, the.classShown) ? 'shown' : 'hidden';
        },

        build: function() {
            // offcanvas toggle
            if (the.options.toggleBy) {
                if (typeof the.options.toggleBy === 'string') {
                    KTUtil.addEvent(KTUtil.getById(the.options.toggleBy), 'click', function(e) {
                        e.preventDefault();
                        the.target = this;
                        Plugin.toggle();
                    });
                } else if (the.options.toggleBy && the.options.toggleBy[0]) {
                    if (the.options.toggleBy[0].target) {
                        for (var i in the.options.toggleBy) {
                            KTUtil.addEvent(KTUtil.getById(the.options.toggleBy[i].target), 'click', function(e) {
                                e.preventDefault();
                                the.target = this;
                                Plugin.toggle();
                            });
                        }
                    } else {
                        for (var i in the.options.toggleBy) {
                            KTUtil.addEvent(KTUtil.getById(the.options.toggleBy[i]), 'click', function(e) {
                                e.preventDefault();
                                the.target = this;
                                Plugin.toggle();
                            });
                        }
                    }

                } else if (the.options.toggleBy && the.options.toggleBy.target) {
                    KTUtil.addEvent( KTUtil.getById(the.options.toggleBy.target), 'click', function(e) {
                        e.preventDefault();
                        the.target = this;
                        Plugin.toggle();
                    });
                }
            }

            // offcanvas close
            var closeBy = KTUtil.getById(the.options.closeBy);
            if (closeBy) {
                KTUtil.addEvent(closeBy, 'click', function(e) {
                    e.preventDefault();
                    the.target = this;
                    Plugin.hide();
                });
            }
        },

        isShown: function() {
            return (the.state == 'shown' ? true : false);
        },

        toggle: function() {;
            Plugin.eventTrigger('toggle');

            if (the.state == 'shown') {
                Plugin.hide();
            } else {
                Plugin.show();
            }
        },

        show: function() {
            if (the.state == 'shown') {
                return;
            }

            Plugin.eventTrigger('beforeShow');

            Plugin.toggleClass('show');

            // Offcanvas panel
            KTUtil.attr(body, 'data-offcanvas-' + the.classBase, 'on');
            KTUtil.addClass(element, the.classShown);

            if (the.attrCustom.length > 0) {
                KTUtil.attr(body, 'data-offcanvas-' + the.classCustom, 'on');
                //KTUtil.addClass(body, the.classCustom);
            }

            the.state = 'shown';

            if (the.options.overlay) {
                the.overlay = KTUtil.insertAfter(document.createElement('DIV') , element );
                KTUtil.addClass(the.overlay, the.classOverlay);

                KTUtil.addEvent(the.overlay, 'click', function(e) {
                    //e.stopPropagation();
                    e.preventDefault();
                    Plugin.hide(the.target);
                });
            }

            Plugin.eventTrigger('afterShow');
        },

        hide: function() {
            if (the.state == 'hidden') {
                return;
            }

            Plugin.eventTrigger('beforeHide');

            Plugin.toggleClass('hide');

            KTUtil.removeAttr(body, 'data-offcanvas-' + the.classBase);
            KTUtil.removeClass(element, the.classShown);

            if (the.attrCustom.length > 0) {
                KTUtil.removeAttr(body, 'data-offcanvas-' + the.attrCustom);
            }

            the.state = 'hidden';

            if (the.options.overlay && the.overlay) {
                KTUtil.remove(the.overlay);
            }

            Plugin.eventTrigger('afterHide');
        },

        toggleClass: function(mode) {
            var id = KTUtil.attr(the.target, 'id');
            var toggleBy;

            if (the.options.toggleBy && the.options.toggleBy[0] && the.options.toggleBy[0].target) {
                for (var i in the.options.toggleBy) {
                    if (the.options.toggleBy[i].target === id) {
                        toggleBy = the.options.toggleBy[i];
                    }
                }
            } else if (the.options.toggleBy && the.options.toggleBy.target) {
                toggleBy = the.options.toggleBy;
            }

            if (toggleBy) {
                var el = KTUtil.getById(toggleBy.target);

                if (mode === 'show') {
                    KTUtil.addClass(el, toggleBy.state);
                }

                if (mode === 'hide') {
                    KTUtil.removeClass(el, toggleBy.state);
                }
            }
        },

        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the, args);
                        }
                    } else {
                        return event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     * @param options
     */
    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Check if canvas is shown
     * @returns {boolean}
     */
    the.isShown = function() {
        return Plugin.isShown();
    };

    /**
     * Set to hide the canvas
     */
    the.hide = function() {
        return Plugin.hide();
    };

    /**
     * Set to show the canvas
     */
    the.show = function() {
        return Plugin.show();
    };

    /**
     * Attach event
     * @param name
     * @param handler
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @param name
     * @param handler
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTOffcanvas;
}

"use strict";

// Component Definition
var KTScrolltop = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        offset: 300,
        speed: 6000
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {mscrolltop}
         */
        construct: function(options) {
            if (KTUtil.data(element).has('scrolltop')) {
                the = KTUtil.data(element).get('scrolltop');
            } else {
                // reset scrolltop
                Plugin.init(options);

                // build scrolltop
                Plugin.build();

                KTUtil.data(element).set('scrolltop', the);
            }

            return the;
        },

        /**
         * Handles subscrolltop click toggle
         * @returns {mscrolltop}
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        build: function() {
            var timer;

            window.addEventListener('scroll', function() {
                KTUtil.throttle(timer, function() {
                    Plugin.handle();
                }, 200);
            });

            // handle button click
            KTUtil.addEvent(element, 'click', Plugin.scroll);
        },

        /**
         * Handles scrolltop click scrollTop
         */
        handle: function() {
            var pos = KTUtil.getScrollTop(); // current vertical position

            if (pos > the.options.offset) {
                if (body.hasAttribute('data-scrolltop') === false) {
                    body.setAttribute('data-scrolltop', 'on');
                }
            } else {
                if (body.hasAttribute('data-scrolltop') === true) {
                    body.removeAttribute('data-scrolltop');
                }
            }
        },

        /**
         * Handles scrolltop click scrollTop
         */
        scroll: function(e) {
            e.preventDefault();

            KTUtil.scrollTop(0, the.options.speed);
        },


        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the, args);
                        }
                    } else {
                       return event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Get subscrolltop mode
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Set scrolltop content
     * @returns {mscrolltop}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTScrolltop;
}

"use strict";

// Component Definition
var KTToggle = function(toggleElement, targetElement, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = toggleElement;
    var target = targetElement;

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        targetToggleMode: 'class' // class|attribute
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('toggle')) {
                the = KTUtil.data(element).get('toggle');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('toggle', the);
            }

            return the;
        },

        /**
         * Handles subtoggle click toggle
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // Merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            //alert(the.options.target.tagName);
            the.target = target;

            the.targetState = the.options.targetState;
            the.toggleState = the.options.toggleState;

            if (the.options.targetToggleMode == 'class') {
                the.state = KTUtil.hasClasses(the.target, the.targetState) ? 'on' : 'off';
            } else {
                the.state = KTUtil.hasAttr(the.target, 'data-' + the.targetState) ? KTUtil.attr(the.target, 'data-' + the.targetState) : 'off';
            }
        },

        /**
         * Setup toggle
         */
        build: function() {
            KTUtil.addEvent(element, 'mouseup', Plugin.toggle);
        },

        /**
         * Handles offcanvas click toggle
         */
        toggle: function(e) {
            Plugin.eventTrigger('beforeToggle');

            if (the.state == 'off') {
                Plugin.toggleOn();
            } else {
                Plugin.toggleOff();
            }

            Plugin.eventTrigger('afterToggle');

            e.preventDefault();

            return the;
        },

        /**
         * Handles toggle click toggle
         */
        toggleOn: function() {
            Plugin.eventTrigger('beforeOn');

            if (the.options.targetToggleMode == 'class') {
                KTUtil.addClass(the.target, the.targetState);
            } else {
                KTUtil.attr(the.target, 'data-' + the.targetState, 'on');
            }

            if (the.toggleState) {
                KTUtil.addClass(element, the.toggleState);
            }

            the.state = 'on';

            Plugin.eventTrigger('afterOn');

            Plugin.eventTrigger('toggle');

            return the;
        },

        /**
         * Handles toggle click toggle
         */
        toggleOff: function() {
            Plugin.eventTrigger('beforeOff');

            if (the.options.targetToggleMode == 'class') {
                KTUtil.removeClass(the.target, the.targetState);
            } else {
                KTUtil.removeAttr(the.target, 'data-' + the.targetState);
            }

            if (the.toggleState) {
                KTUtil.removeClass(element, the.toggleState);
            }

            the.state = 'off';

            Plugin.eventTrigger('afterOff');

            Plugin.eventTrigger('toggle');

            return the;
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];

                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Get toggle state
     */
    the.getState = function() {
        return the.state;
    };

    /**
     * Toggle
     */
    the.toggle = function() {
        return Plugin.toggle();
    };

    /**
     * Toggle on
     */
    the.toggleOn = function() {
        return Plugin.toggleOn();
    };

    /**
     * Toggle off
     */
    the.toggleOff = function() {
        return Plugin.toggleOff();
    };

    /**
     * Attach event
     * @returns {KTToggle}
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @returns {KTToggle}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTToggle;
}

"use strict";

/**
 * @class KTUtil  base utilize class that privides helper functions
 */

// Polyfills
/**
 * Element.matches() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	}
	Element.prototype.closest = function (s) {
		var el = this;
		var ancestor = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (ancestor.matches(s)) return ancestor;
			ancestor = ancestor.parentElement;
		} while (ancestor !== null);
		return null;
	};
}

/**
 * ChildNode.remove() polyfill
 * https://gomakethings.com/removing-an-element-from-the-dom-the-es6-way/
 * @author Chris Ferdinandi
 * @license MIT
 */
(function (elem) {
	for (var i = 0; i < elem.length; i++) {
		if (!window[elem[i]] || 'remove' in window[elem[i]].prototype) continue;
		window[elem[i]].prototype.remove = function () {
			this.parentNode.removeChild(this);
		};
	}
})(['Element', 'CharacterData', 'DocumentType']);


//
// requestAnimationFrame polyfill by Erik Möller.
//  With fixes from Paul Irish and Tino Zijdel
//
//  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
//  http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
//
//  MIT license
//
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('prepend')) {
            return;
        }
        Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

// getAttributeNames
if (Element.prototype.getAttributeNames == undefined) {
  Element.prototype.getAttributeNames = function () {
    var attributes = this.attributes;
    var length = attributes.length;
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
      result[i] = attributes[i].name;
    }
    return result;
  };
}

// Global variables
window.KTUtilElementDataStore = {};
window.KTUtilElementDataStoreID = 0;
window.KTUtilDelegatedEventHandlers = {};

var KTUtil = function() {
    var resizeHandlers = [];

    /** @type {object} breakpoints The device width breakpoints **/
    var breakpoints = {
        sm: 544, // Small screen / phone
        md: 768, // Medium screen / tablet
        lg: 992, // Large screen / desktop
        xl: 1200 // Extra large screen / wide desktop
    };

    /**
     * Handle window resize event with some
     * delay to attach event handlers upon resize complete
     */
    var _windowResizeHandler = function() {
        var _runResizeHandlers = function() {
            // reinitialize other subscribed elements
            for (var i = 0; i < resizeHandlers.length; i++) {
                var each = resizeHandlers[i];
                each.call();
            }
        };

        var timer;

        window.addEventListener('resize', function() {
            KTUtil.throttle(timer, function() {
                _runResizeHandlers();
            }, 200);
        });
    };

    return {
        /**
         * Class main initializer.
         * @param {object} settings.
         * @returns null
         */
        //main function to initiate the theme
        init: function(settings) {
            if (settings && settings.breakpoints) {
                breakpoints = settings.breakpoints;
            }

            _windowResizeHandler();
        },

        /**
         * Adds window resize event handler.
         * @param {function} callback function.
         */
        addResizeHandler: function(callback) {
            resizeHandlers.push(callback);
        },

        /**
         * Removes window resize event handler.
         * @param {function} callback function.
         */
        removeResizeHandler: function(callback) {
            for (var i = 0; i < resizeHandlers.length; i++) {
                if (callback === resizeHandlers[i]) {
                    delete resizeHandlers[i];
                }
            }
        },

        /**
         * Trigger window resize handlers.
         */
        runResizeHandlers: function() {
            _runResizeHandlers();
        },

        resize: function() {
            if (typeof(Event) === 'function') {
                // modern browsers
                window.dispatchEvent(new Event('resize'));
            } else {
                // for IE and other old browsers
                // causes deprecation warning on modern browsers
                var evt = window.document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            }
        },

        /**
         * Get GET parameter value from URL.
         * @param {string} paramName Parameter name.
         * @returns {string}
         */
        getURLParam: function(paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }

            return null;
        },

        /**
         * Checks whether current device is mobile touch.
         * @returns {boolean}
         */
        isMobileDevice: function() {
            var test = (this.getViewPort().width < this.getBreakpoint('lg') ? true : false);

            if (test === false) {
                // For use within normal web clients
                test = navigator.userAgent.match(/iPad/i) != null;
            }

            return test;
        },

        /**
         * Checks whether current device is desktop.
         * @returns {boolean}
         */
        isDesktopDevice: function() {
            return KTUtil.isMobileDevice() ? false : true;
        },

        /**
         * Gets browser window viewport size. Ref:
         * http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
         * @returns {object}
         */
        getViewPort: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        /**
         * Checks whether given device mode is currently activated.
         * @param {string} mode Responsive mode name(e.g: desktop,
         *     desktop-and-tablet, tablet, tablet-and-mobile, mobile)
         * @returns {boolean}
         */
        isInResponsiveRange: function(mode) {
            var breakpoint = this.getViewPort().width;

            if (mode == 'general') {
                return true;
            } else if (mode == 'desktop' && breakpoint >= (this.getBreakpoint('lg') + 1)) {
                return true;
            } else if (mode == 'tablet' && (breakpoint >= (this.getBreakpoint('md') + 1) && breakpoint < this.getBreakpoint('lg'))) {
                return true;
            } else if (mode == 'mobile' && breakpoint <= this.getBreakpoint('md')) {
                return true;
            } else if (mode == 'desktop-and-tablet' && breakpoint >= (this.getBreakpoint('md') + 1)) {
                return true;
            } else if (mode == 'tablet-and-mobile' && breakpoint <= this.getBreakpoint('lg')) {
                return true;
            } else if (mode == 'minimal-desktop-and-below' && breakpoint <= this.getBreakpoint('xl')) {
                return true;
            }

            return false;
        },

		/**
         * Checks whether given device mode is currently activated.
         * @param {string} mode Responsive mode name(e.g: desktop,
         *     desktop-and-tablet, tablet, tablet-and-mobile, mobile)
         * @returns {boolean}
         */
        isBreakpointUp: function(mode) {
            var width = this.getViewPort().width;
			var breakpoint = this.getBreakpoint(mode);

			return (width >= breakpoint);
        },

		isBreakpointDown: function(mode) {
            var width = this.getViewPort().width;
			var breakpoint = this.getBreakpoint(mode);

			return (width < breakpoint);
        },

        /**
         * Generates unique ID for give prefix.
         * @param {string} prefix Prefix for generated ID
         * @returns {boolean}
         */
        getUniqueID: function(prefix) {
            return prefix + Math.floor(Math.random() * (new Date()).getTime());
        },

        /**
         * Gets window width for give breakpoint mode.
         * @param {string} mode Responsive mode name(e.g: xl, lg, md, sm)
         * @returns {number}
         */
        getBreakpoint: function(mode) {
            return breakpoints[mode];
        },

        /**
         * Checks whether object has property matchs given key path.
         * @param {object} obj Object contains values paired with given key path
         * @param {string} keys Keys path seperated with dots
         * @returns {object}
         */
        isset: function(obj, keys) {
            var stone;

            keys = keys || '';

            if (keys.indexOf('[') !== -1) {
                throw new Error('Unsupported object path notation.');
            }

            keys = keys.split('.');

            do {
                if (obj === undefined) {
                    return false;
                }

                stone = keys.shift();

                if (!obj.hasOwnProperty(stone)) {
                    return false;
                }

                obj = obj[stone];

            } while (keys.length);

            return true;
        },

        /**
         * Gets highest z-index of the given element parents
         * @param {object} el jQuery element object
         * @returns {number}
         */
        getHighestZindex: function(el) {
            var position, value;

            while (el && el !== document) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = KTUtil.css(el, 'position');

                if (position === "absolute" || position === "relative" || position === "fixed") {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt(KTUtil.css(el, 'z-index'));

                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }

                el = el.parentNode;
            }

            return null;
        },

        /**
         * Checks whether the element has any parent with fixed positionfreg
         * @param {object} el jQuery element object
         * @returns {boolean}
         */
        hasFixedPositionedParent: function(el) {
            var position;

            while (el && el !== document) {
                position = KTUtil.css(el, 'position');

                if (position === "fixed") {
                    return true;
                }

                el = el.parentNode;
            }

            return false;
        },

        /**
         * Simulates delay
         */
        sleep: function(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        },

        /**
         * Gets randomly generated integer value within given min and max range
         * @param {number} min Range start value
         * @param {number} max Range end value
         * @returns {number}
         */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Checks whether Angular library is included
         * @returns {boolean}
         */
        isAngularVersion: function() {
            return window.Zone !== undefined ? true : false;
        },

        // Deep extend:  $.extend(true, {}, objA, objB);
        deepExtend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];
                if (!obj) continue;

                for (var key in obj) {
                    if (!obj.hasOwnProperty(key)) {
                        continue;
                    }

                    // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
                    if ( Object.prototype.toString.call(obj[key]) === '[object Object]' ) {
                        out[key] = KTUtil.deepExtend(out[key], obj[key]);
                        continue;
                    }

                    out[key] = obj[key];
                }
            }

            return out;
        },

        // extend:  $.extend({}, objA, objB);
        extend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;

                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key))
                        out[key] = arguments[i][key];
                }
            }

            return out;
        },

        getById: function(el) {
            if (typeof el === 'string') {
                return document.getElementById(el);
            } else {
                return el;
            }
        },

        getByTag: function(query) {
            return document.getElementsByTagName(query);
        },

        getByTagName: function(query) {
            return document.getElementsByTagName(query);
        },

        getByClass: function(query) {
            return document.getElementsByClassName(query);
        },

        getBody: function() {
            return document.getElementsByTagName('body')[0];
        },

        /**
         * Checks whether the element has given classes
         * @param {object} el jQuery element object
         * @param {string} Classes string
         * @returns {boolean}
         */
        hasClasses: function(el, classes) {
            if (!el) {
                return;
            }

            var classesArr = classes.split(" ");

            for (var i = 0; i < classesArr.length; i++) {
                if (KTUtil.hasClass(el, KTUtil.trim(classesArr[i])) == false) {
                    return false;
                }
            }

            return true;
        },

        hasClass: function(el, className) {
            if (!el) {
                return;
            }

            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        },

        addClass: function(el, className) {
            if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    if (classNames[i] && classNames[i].length > 0) {
                        el.classList.add(KTUtil.trim(classNames[i]));
                    }
                }
            } else if (!KTUtil.hasClass(el, className)) {
                for (var x = 0; x < classNames.length; x++) {
                    el.className += ' ' + KTUtil.trim(classNames[x]);
                }
            }
        },

        removeClass: function(el, className) {
          if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    el.classList.remove(KTUtil.trim(classNames[i]));
                }
            } else if (KTUtil.hasClass(el, className)) {
                for (var x = 0; x < classNames.length; x++) {
                    el.className = el.className.replace(new RegExp('\\b' + KTUtil.trim(classNames[x]) + '\\b', 'g'), '');
                }
            }
        },

        triggerCustomEvent: function(el, eventName, data) {
            var event;
            if (window.CustomEvent) {
                event = new CustomEvent(eventName, {
                    detail: data
                });
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
            }

            el.dispatchEvent(event);
        },

        triggerEvent: function(node, eventName) {
            // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
            var doc;
            if (node.ownerDocument) {
                doc = node.ownerDocument;
            } else if (node.nodeType == 9) {
                // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                doc = node;
            } else {
                throw new Error("Invalid node passed to fireEvent: " + node.id);
            }

            if (node.dispatchEvent) {
                // Gecko-style approach (now the standard) takes more work
                var eventClass = "";

                // Different events have different event classes.
                // If this switch statement can't map an eventName to an eventClass,
                // the event firing is going to fail.
                switch (eventName) {
                case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                case "mouseenter":
                case "mouseleave":
                case "mousedown":
                case "mouseup":
                    eventClass = "MouseEvents";
                    break;

                case "focus":
                case "change":
                case "blur":
                case "select":
                    eventClass = "HTMLEvents";
                    break;

                default:
                    throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                    break;
                }
                var event = doc.createEvent(eventClass);

                var bubbles = eventName == "change" ? false : true;
                event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

                event.synthetic = true; // allow detection of synthetic events
                // The second parameter says go ahead with the default action
                node.dispatchEvent(event, true);
            } else if (node.fireEvent) {
                // IE-old school style
                var event = doc.createEventObject();
                event.synthetic = true; // allow detection of synthetic events
                node.fireEvent("on" + eventName, event);
            }
        },

        index: function( el ){
            var c = el.parentNode.children, i = 0;
            for(; i < c.length; i++ )
                if( c[i] == el ) return i;
        },

        trim: function(string) {
            return string.trim();
        },

        eventTriggered: function(e) {
            if (e.currentTarget.dataset.triggered) {
                return true;
            } else {
                e.currentTarget.dataset.triggered = true;

                return false;
            }
        },

        remove: function(el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        },

        find: function(parent, query) {
            parent = KTUtil.getById(parent);
            if (parent) {
                return parent.querySelector(query);
            }
        },

        findAll: function(parent, query) {
            parent = KTUtil.getById(parent);
            if (parent) {
                return parent.querySelectorAll(query);
            }
        },

        insertAfter: function(el, referenceNode) {
            return referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
        },

        parents: function(elem, selector) {
            // Element.matches() polyfill
            if (!Element.prototype.matches) {
                Element.prototype.matches =
                    Element.prototype.matchesSelector ||
                    Element.prototype.mozMatchesSelector ||
                    Element.prototype.msMatchesSelector ||
                    Element.prototype.oMatchesSelector ||
                    Element.prototype.webkitMatchesSelector ||
                    function(s) {
                        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                            i = matches.length;
                        while (--i >= 0 && matches.item(i) !== this) {}
                        return i > -1;
                    };
            }

            // Set up a parent array
            var parents = [];

            // Push each parent element to the array
            for ( ; elem && elem !== document; elem = elem.parentNode ) {
                if (selector) {
                    if (elem.matches(selector)) {
                        parents.push(elem);
                    }
                    continue;
                }
                parents.push(elem);
            }

            // Return our parent array
            return parents;
        },

        children: function(el, selector, log) {
            if (!el || !el.childNodes) {
                return;
            }

            var result = [],
                i = 0,
                l = el.childNodes.length;

            for (var i; i < l; ++i) {
                if (el.childNodes[i].nodeType == 1 && KTUtil.matches(el.childNodes[i], selector, log)) {
                    result.push(el.childNodes[i]);
                }
            }

            return result;
        },

        child: function(el, selector, log) {
            var children = KTUtil.children(el, selector, log);

            return children ? children[0] : null;
        },

        matches: function(el, selector, log) {
            var p = Element.prototype;
            var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };

            if (el && el.tagName) {
                return f.call(el, selector);
            } else {
                return false;
            }
        },

        data: function(el) {
            return {
                set: function(name, data) {
                    if (!el) {
                        return;
                    }

                    if (el.customDataTag === undefined) {
                        window.KTUtilElementDataStoreID++;
                        el.customDataTag = window.KTUtilElementDataStoreID;
                    }

                    if (window.KTUtilElementDataStore[el.customDataTag] === undefined) {
                        window.KTUtilElementDataStore[el.customDataTag] = {};
                    }

                    window.KTUtilElementDataStore[el.customDataTag][name] = data;
                },

                get: function(name) {
                    if (!el) {
                        return;
                    }

                    if (el.customDataTag === undefined) {
                        return null;
                    }

                    return this.has(name) ? window.KTUtilElementDataStore[el.customDataTag][name] : null;
                },

                has: function(name) {
                    if (!el) {
                        return false;
                    }

                    if (el.customDataTag === undefined) {
                        return false;
                    }

                    return (window.KTUtilElementDataStore[el.customDataTag] && window.KTUtilElementDataStore[el.customDataTag][name]) ? true : false;
                },

                remove: function(name) {
                    if (el && this.has(name)) {
                        delete window.KTUtilElementDataStore[el.customDataTag][name];
                    }
                }
            };
        },

        outerWidth: function(el, margin) {
            var width;

            if (margin === true) {
                width = parseFloat(el.offsetWidth);
                width += parseFloat(KTUtil.css(el, 'margin-left')) + parseFloat(KTUtil.css(el, 'margin-right'));

                return parseFloat(width);
            } else {
                width = parseFloat(el.offsetWidth);

                return width;
            }
        },

        offset: function(el) {
            var rect, win;

            if ( !el ) {
                return;
            }

            // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
            // Support: IE <=11 only
            // Running getBoundingClientRect on a
            // disconnected node in IE throws an error

            if ( !el.getClientRects().length ) {
                return { top: 0, left: 0 };
            }

            // Get document-relative position by adding viewport scroll to viewport-relative gBCR
            rect = el.getBoundingClientRect();
            win = el.ownerDocument.defaultView;

            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            };
        },

        height: function(el) {
            return KTUtil.css(el, 'height');
        },

        outerHeight: function(el, withMargin) {
            var height = el.offsetHeight;
            var style;

            if (typeof withMargin !== 'undefined' && withMargin === true) {
                style = getComputedStyle(el);
                height += parseInt(style.marginTop) + parseInt(style.marginBottom);

                return height;
            } else {
                return height;
            }
        },

        visible: function(el) {
            return !(el.offsetWidth === 0 && el.offsetHeight === 0);
        },

        attr: function(el, name, value) {
            if (el == undefined) {
                return;
            }

            if (value !== undefined) {
                el.setAttribute(name, value);
            } else {
                return el.getAttribute(name);
            }
        },

        hasAttr: function(el, name) {
            if (el == undefined) {
                return;
            }

            return el.getAttribute(name) ? true : false;
        },

        removeAttr: function(el, name) {
            if (el == undefined) {
                return;
            }

            el.removeAttribute(name);
        },

        animate: function(from, to, duration, update, easing, done) {
            /**
             * TinyAnimate.easings
             *  Adapted from jQuery Easing
             */
            var easings = {};
            var easing;

            easings.linear = function(t, b, c, d) {
                return c * t / d + b;
            };

            easing = easings.linear;

            // Early bail out if called incorrectly
            if (typeof from !== 'number' ||
                typeof to !== 'number' ||
                typeof duration !== 'number' ||
                typeof update !== 'function') {
                return;
            }

            // Create mock done() function if necessary
            if (typeof done !== 'function') {
                done = function() {};
            }

            // Pick implementation (requestAnimationFrame | setTimeout)
            var rAF = window.requestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 50);
            };

            // Animation loop
            var canceled = false;
            var change = to - from;

            function loop(timestamp) {
                var time = (timestamp || +new Date()) - start;

                if (time >= 0) {
                    update(easing(time, from, change, duration));
                }
                if (time >= 0 && time >= duration) {
                    update(to);
                    done();
                } else {
                    rAF(loop);
                }
            }

            update(from);

            // Start animation loop
            var start = window.performance && window.performance.now ? window.performance.now() : +new Date();

            rAF(loop);
        },

        actualCss: function(el, prop, cache) {
            var css = '';

            if (el instanceof HTMLElement === false) {
                return;
            }

            if (!el.getAttribute('kt-hidden-' + prop) || cache === false) {
                var value;

                // the element is hidden so:
                // making the el block so we can meassure its height but still be hidden
                css = el.style.cssText;
                el.style.cssText = 'position: absolute; visibility: hidden; display: block;';

                if (prop == 'width') {
                    value = el.offsetWidth;
                } else if (prop == 'height') {
                    value = el.offsetHeight;
                }

                el.style.cssText = css;

                // store it in cache
                el.setAttribute('kt-hidden-' + prop, value);

                return parseFloat(value);
            } else {
                // store it in cache
                return parseFloat(el.getAttribute('kt-hidden-' + prop));
            }
        },

        actualHeight: function(el, cache) {
            return KTUtil.actualCss(el, 'height', cache);
        },

        actualWidth: function(el, cache) {
            return KTUtil.actualCss(el, 'width', cache);
        },

        getScroll: function(element, method) {
            // The passed in `method` value should be 'Top' or 'Left'
            method = 'scroll' + method;
            return (element == window || element == document) ? (
                self[(method == 'scrollTop') ? 'pageYOffset' : 'pageXOffset'] ||
                (browserSupportsBoxModel && document.documentElement[method]) ||
                document.body[method]
            ) : element[method];
        },

        css: function(el, styleProp, value) {
            if (!el) {
                return;
            }

            if (value !== undefined) {
                el.style[styleProp] = value;
            } else {
                var defaultView = (el.ownerDocument || document).defaultView;
                // W3C standard way:
                if (defaultView && defaultView.getComputedStyle) {
                    // sanitize property name to css notation
                    // (hyphen separated words eg. font-Size)
                    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
                    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
                } else if (el.currentStyle) { // IE
                    // sanitize property name to camelCase
                    styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
                        return letter.toUpperCase();
                    });
                    value = el.currentStyle[styleProp];
                    // convert other units to pixels on IE
                    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                        return (function(value) {
                            var oldLeft = el.style.left,
                                oldRsLeft = el.runtimeStyle.left;
                            el.runtimeStyle.left = el.currentStyle.left;
                            el.style.left = value || 0;
                            value = el.style.pixelLeft + "px";
                            el.style.left = oldLeft;
                            el.runtimeStyle.left = oldRsLeft;
                            return value;
                        })(value);
                    }
                    return value;
                }
            }
        },

        slide: function(el, dir, speed, callback, recalcMaxHeight) {
            if (!el || (dir == 'up' && KTUtil.visible(el) === false) || (dir == 'down' && KTUtil.visible(el) === true)) {
                return;
            }

            speed = (speed ? speed : 600);
            var calcHeight = KTUtil.actualHeight(el);
            var calcPaddingTop = false;
            var calcPaddingBottom = false;

            if (KTUtil.css(el, 'padding-top') && KTUtil.data(el).has('slide-padding-top') !== true) {
                KTUtil.data(el).set('slide-padding-top', KTUtil.css(el, 'padding-top'));
            }

            if (KTUtil.css(el, 'padding-bottom') && KTUtil.data(el).has('slide-padding-bottom') !== true) {
                KTUtil.data(el).set('slide-padding-bottom', KTUtil.css(el, 'padding-bottom'));
            }

            if (KTUtil.data(el).has('slide-padding-top')) {
                calcPaddingTop = parseInt(KTUtil.data(el).get('slide-padding-top'));
            }

            if (KTUtil.data(el).has('slide-padding-bottom')) {
                calcPaddingBottom = parseInt(KTUtil.data(el).get('slide-padding-bottom'));
            }

            if (dir == 'up') { // up
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {
                        el.style.paddingTop = (calcPaddingTop - value) + 'px';
                    }, 'linear');
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = (calcPaddingBottom - value) + 'px';
                    }, 'linear');
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = (calcHeight - value) + 'px';
                }, 'linear', function() {
                    el.style.height = '';
                    el.style.display = 'none';

                    if (typeof callback === 'function') {
                        callback();
                    }
                });


            } else if (dir == 'down') { // down
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {//
                        el.style.paddingTop = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingTop = '';
                    });
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingBottom = '';
                    });
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = value + 'px';
                }, 'linear', function() {
                    el.style.height = '';
                    el.style.display = '';
                    el.style.overflow = '';

                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            }
        },

        slideUp: function(el, speed, callback) {
            KTUtil.slide(el, 'up', speed, callback);
        },

        slideDown: function(el, speed, callback) {
            KTUtil.slide(el, 'down', speed, callback);
        },

        show: function(el, display) {
            if (typeof el !== 'undefined') {
                el.style.display = (display ? display : 'block');
            }
        },

        hide: function(el) {
            if (typeof el !== 'undefined') {
                el.style.display = 'none';
            }
        },

        addEvent: function(el, type, handler, one) {
            if (typeof el !== 'undefined' && el !== null) {
                el.addEventListener(type, handler);
            }
        },

        removeEvent: function(el, type, handler) {
            if (el !== null) {
                el.removeEventListener(type, handler);
            }
        },

        on: function(element, selector, event, handler) {
            if (!selector) {
                return;
            }

            var eventId = KTUtil.getUniqueID('event');

            window.KTUtilDelegatedEventHandlers[eventId] = function(e) {
                var targets = element.querySelectorAll(selector);
                var target = e.target;

                while (target && target !== element) {
                    for (var i = 0, j = targets.length; i < j; i++) {
                        if (target === targets[i]) {
                            handler.call(target, e);
                        }
                    }

                    target = target.parentNode;
                }
            }

            KTUtil.addEvent(element, event, window.KTUtilDelegatedEventHandlers[eventId]);

            return eventId;
        },

        off: function(element, event, eventId) {
            if (!element || !window.KTUtilDelegatedEventHandlers[eventId]) {
                return;
            }

            KTUtil.removeEvent(element, event, window.KTUtilDelegatedEventHandlers[eventId]);

            delete window.KTUtilDelegatedEventHandlers[eventId];
        },

        one: function onetime(el, type, callback) {
            el.addEventListener(type, function callee(e) {
                // remove event
                if (e.target && e.target.removeEventListener) {
                    e.target.removeEventListener(e.type, callee);
                }

                // need to verify from https://themeforest.net/author_dashboard#comment_23615588
                if (el && el.removeEventListener) {
				    e.currentTarget.removeEventListener(e.type, callee);
			    }

                // call handler
                return callback(e);
            });
        },

        hash: function(str) {
            var hash = 0,
                i, chr;

            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        },

        animateClass: function(el, animationName, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.addClass(el, 'animated ' + animationName);

            KTUtil.one(el, animation, function() {
                KTUtil.removeClass(el, 'animated ' + animationName);
            });

            if (callback) {
                KTUtil.one(el, animation, callback);
            }
        },

        transitionEnd: function(el, callback) {
            var transition;
            var transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'mozTransitionEnd',
                WebkitTransition: 'webkitTransitionEnd',
                msTransition: 'msTransitionEnd'
            };

            for (var t in transitions) {
                if (el.style[t] !== undefined) {
                    transition = transitions[t];
                }
            }

            KTUtil.one(el, transition, callback);
        },

        animationEnd: function(el, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd'
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.one(el, animation, callback);
        },

        animateDelay: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-delay', value);
            }
        },

        animateDuration: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-duration', value);
            }
        },

        scrollTo: function(target, offset, duration) {
            var duration = duration ? duration : 500;
            var targetPos = target ? KTUtil.offset(target).top : 0;
            var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var from, to;

            if (offset) {
                scrollPos += offset;
            }

            from = scrollPos;
            to = targetPos;

            KTUtil.animate(from, to, duration, function(value) {
                document.documentElement.scrollTop = value;
                document.body.parentNode.scrollTop = value;
                document.body.scrollTop = value;
            }); //, easing, done
        },

        scrollTop: function(offset, duration) {
            KTUtil.scrollTo(null, offset, duration);
        },

        isArray: function(obj) {
            return obj && Array.isArray(obj);
        },

        ready: function(callback) {
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
                callback();
            } else {
                document.addEventListener('DOMContentLoaded', callback);
            }
        },

        isEmpty: function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true;
        },

        numberString: function(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },

        detectIE: function() {
            var ua = window.navigator.userAgent;

            // Test values; Uncomment to check result …

            // IE 10
            // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

            // IE 11
            // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

            // Edge 12 (Spartan)
            // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

            // Edge 13
            // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        },

        isRTL: function() {
            var html = KTUtil.getByTagName('html')[0];

            if (html) {
                return (KTUtil.attr(html, 'direction') == 'rtl');
            }
        },

        // Scroller
        scrollInit: function(element, options) {
            if (!element) {
                return;
            }

            // Learn more: https://github.com/mdbootstrap/perfect-scrollbar#options
            var pluginDefOptions = {
                wheelSpeed: 0.5,
                swipeEasing: true,
                wheelPropagation: false,
                minScrollbarLength: 40,
                maxScrollbarLength: 300,
                suppressScrollX: true
            };

            options = KTUtil.deepExtend({}, pluginDefOptions, options);

            // Define init function
            function init() {
                var ps;
                var height;

                // Get extra options via data attributes
                var attrs = element.getAttributeNames();
                if (attrs.length > 0) {
                    attrs.forEach(function(attrName) {
            			// more options; https://github.com/ganlanyuan/tiny-slider#options
            			if ((/^data-.*/g).test(attrName)) {
                            if (['scroll', 'height', 'mobile-height'].includes(optionName) == false) {
                                var optionName = attrName.replace('data-', '').toLowerCase().replace(/(?:[\s-])\w/g, function(match) {
                					return match.replace('-', '').toUpperCase();
                				});

                                options[optionName] = KTUtil.filterBoolean(element.getAttribute(attrName));
                            }
            			}
            		});
                }

                if (options.height instanceof Function) {
                    height = options.height.call();
                } else {
                    if (KTUtil.isMobileDevice() === true && options.mobileHeight) {
                        height = parseInt(options.mobileHeight);
                    } else if (options.height) {
                        height = parseInt(options.height);
                    } else {
                        height = parseInt(KTUtil.css(element, 'height'));
                    }
                }

                if (height === false) {
                    KTUtil.scrollDestroy(element, true);

                    return;
                }

                height = parseInt(height);

                // Destroy scroll on table and mobile modes
                if ((options.mobileNativeScroll || options.disableForMobile) && KTUtil.isMobileDevice() === true) {
                    ps = KTUtil.data(element).get('ps');
                    if (ps) {
                        if (options.resetHeightOnDestroy) {
                            KTUtil.css(element, 'height', 'auto');
                        } else {
                            KTUtil.css(element, 'overflow', 'auto');
                            if (height > 0) {
                                KTUtil.css(element, 'height', height + 'px');
                            }
                        }

                        ps.destroy();
                        ps = KTUtil.data(element).remove('ps');
                    } else if (height > 0){
                        KTUtil.css(element, 'overflow', 'auto');
                        KTUtil.css(element, 'height', height + 'px');
                    }

                    return;
                }

                if (height > 0) {
                    KTUtil.css(element, 'height', height + 'px');
                }

                if (options.desktopNativeScroll) {
                    KTUtil.css(element, 'overflow', 'auto');
                    return;
                }

                // Pass options via HTML Attributes
                if (KTUtil.attr(element, 'data-window-scroll') == 'true') {
                     options.windowScroll = true;
                }

                // Init scroll
                ps = KTUtil.data(element).get('ps');

                if (ps) {
                    ps.update();
                } else {
                    KTUtil.css(element, 'overflow', 'hidden');
                    KTUtil.addClass(element, 'scroll');

                    ps = new PerfectScrollbar(element, options);

                    KTUtil.data(element).set('ps', ps);
                }

                // Remember scroll position in cookie
                var uid = KTUtil.attr(element, 'id');

                // Todo:Consider using Localstorage
                if (options.rememberPosition === true && KTCookie && uid) {
                    if (KTCookie.getCookie(uid)) {
                        var pos = parseInt(KTCookie.getCookie(uid));

                        if (pos > 0) {
                            element.scrollTop = pos;
                        }
                    }

                    element.addEventListener('ps-scroll-y', function() {
                        KTCookie.setCookie(uid, element.scrollTop);
                    });
                }
            }

            // Init
            init();

            // Handle window resize
            if (options.handleWindowResize) {
                KTUtil.addResizeHandler(function() {
                    init();
                });
            }
        },

        scrollUpdate: function(element) {
            var ps = KTUtil.data(element).get('ps');
            if (ps) {
                ps.update();
            }
        },

        scrollUpdateAll: function(parent) {
            var scrollers = KTUtil.findAll(parent, '.ps');
            for (var i = 0, len = scrollers.length; i < len; i++) {
                KTUtil.scrollUpdate(scrollers[i]);
            }
        },

        scrollDestroy: function(element, resetAll) {
            var ps = KTUtil.data(element).get('ps');

            if (ps) {
                ps.destroy();
                ps = KTUtil.data(element).remove('ps');
            }

            if (element && resetAll) {
                element.style.setProperty('overflow', '');
                element.style.setProperty('height', '');
            }
        },

        filterBoolean: function(val) {
            // Convert string boolean
			if (val === true || val === 'true') {
				return true;
			}

			if (val === false || val === 'false') {
				return false;
			}

            return val;
        },

        setHTML: function(el, html) {
            el.innerHTML = html;
        },

        getHTML: function(el) {
            if (el) {
                return el.innerHTML;
            }
        },

        getDocumentHeight: function() {
            var body = document.body;
            var html = document.documentElement;

            return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        },

        getScrollTop: function() {
            return  (document.scrollingElement || document.documentElement).scrollTop;
        },

        changeColor: function(col, amt) {

            var usePound = false;

            if (col[0] == "#") {
                col = col.slice(1);
                usePound = true;
            }

            var num = parseInt(col,16);

            var r = (num >> 16) + amt;

            if (r > 255) r = 255;
            else if  (r < 0) r = 0;

            var b = ((num >> 8) & 0x00FF) + amt;

            if (b > 255) b = 255;
            else if  (b < 0) b = 0;

            var g = (num & 0x0000FF) + amt;

            if (g > 255) g = 255;
            else if (g < 0) g = 0;

            return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

        },

        // Throttle function: Input as function which needs to be throttled and delay is the time interval in milliseconds
        throttle:  function (timer, func, delay) {
        	// If setTimeout is already scheduled, no need to do anything
        	if (timer) {
        		return;
        	}

        	// Schedule a setTimeout after delay seconds
        	timer  =  setTimeout(function () {
        		func();

        		// Once setTimeout function execution is finished, timerId = undefined so that in <br>
        		// the next scroll event function execution can be scheduled by the setTimeout
        		timer  =  undefined;
        	}, delay);
        },

        // Debounce function: Input as function which needs to be debounced and delay is the debounced time in milliseconds
        debounce: function (timer, func, delay) {
        	// Cancels the setTimeout method execution
        	clearTimeout(timer)

        	// Executes the func after delay time.
        	timer  =  setTimeout(func, delay);
        },

        btnWait: function(el, cls, message, disable) {
            if (!el) {
                return;
            }

            if (typeof disable !== 'undefined' && disable === true) {
                KTUtil.attr(el, "disabled", true);
            }

            if (cls) {
                KTUtil.addClass(el, cls);
                KTUtil.attr(el, "wait-class", cls);
            }

            if (message) {
                var caption = KTUtil.find(el, '.btn-caption');

                if (caption) {
                    KTUtil.data(caption).set('caption', KTUtil.getHTML(caption));
                    KTUtil.setHTML(caption, message);
                } else {
                    KTUtil.data(el).set('caption', KTUtil.getHTML(el));
                    KTUtil.setHTML(el, message);
                }
            }
        },

        btnRelease: function(el) {
            if (!el) {
                return;
            }

            /// Show loading state on button
            KTUtil.removeAttr(el, "disabled");

            if (KTUtil.hasAttr(el, "wait-class")) {
                KTUtil.removeClass(el, KTUtil.attr(el, "wait-class"));
            }

            var caption = KTUtil.find(el, '.btn-caption');

            if (caption && KTUtil.data(caption).has('caption')) {
                KTUtil.setHTML(caption, KTUtil.data(caption).get('caption'));
            } else if (KTUtil.data(el).has('caption')) {
                KTUtil.setHTML(el, KTUtil.data(el).get('caption'));
            }
        },

        isOffscreen: function(el, direction, offset) {
            offset = offset || 0;

            var windowWidth = KTUtil.getViewPort().width;
            var windowHeight = KTUtil.getViewPort().height;

            var top = KTUtil.offset(el).top;
            var height = KTUtil.outerHeight(el) + offset;
            var left = KTUtil.offset(el).left;
            var width = KTUtil.outerWidth(el) + offset;

            if (direction == 'bottom') {
                if (windowHeight < top + height) {
                    return true;
                } else if (windowHeight > top + height * 1.5) {
                    return true;
                }
            }

            if (direction == 'top') {
                if (top < 0) {
                    return true;
                } else if (top > height) {
                    return true;
                }
            }

            if (direction == 'left') {
                if (left < 0) {
                    return true;
                } else if (left * 2 > width) {
                    //console.log('left 2');
                    //return true;
                }
            }

            if (direction == 'right') {
                if (windowWidth < left + width) {
                    return true;
                } else {
                    //console.log('right 2');
                    //return true;
                }
            }

            return false;
        }
    }
}();

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTUtil;
}

// Initialize KTUtil class on document ready
KTUtil.ready(function() {
	if (typeof KTAppSettings !== 'undefined') {
		KTUtil.init(KTAppSettings);
	} else {
		KTUtil.init();
	}
});

"use strict";

// Component Definition
var KTWizard = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        startStep: 1,
        clickableSteps: false // to make steps clickable this set value true and add data-wizard-clickable="true" in HTML for class="wizard" element
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('wizard')) {
                the = KTUtil.data(element).get('wizard');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('wizard', the);
            }

            return the;
        },

        /**
         * Init wizard
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // Elements
            the.steps = KTUtil.findAll(element, '[data-wizard-type="step"]');

            the.btnNext = KTUtil.find(element, '[data-wizard-type="action-next"]');
            the.btnPrev = KTUtil.find(element, '[data-wizard-type="action-prev"]');
            the.btnSubmit = KTUtil.find(element, '[data-wizard-type="action-submit"]');

            // Variables
            the.events = [];
            the.lastStep = 0;
            the.currentStep = 1;
            the.newStep = 0;
            the.stopped = false;
            the.totalSteps = the.steps.length;

            // Init current step
            if (the.options.startStep > 1) {
                Plugin.goTo(the.options.startStep);
            }

            // Init UI
            Plugin.updateUI();
        },

        /**
         * Build Form Wizard
         */
        build: function() {
            // Next button event handler
            KTUtil.addEvent(the.btnNext, 'click', function(e) {
                e.preventDefault();

                // Set new step number
                Plugin.setNewStep(Plugin.getNextStep());

                // Trigger change event
                if (Plugin.eventTrigger('change') !== false) {
                    Plugin.goTo(Plugin.getNextStep());
                }
            });

            // Prev button event handler
            KTUtil.addEvent(the.btnPrev, 'click', function(e) {
                e.preventDefault();

                // Set new step number
                Plugin.setNewStep(Plugin.getPrevStep());

                // Trigger change event
                if (Plugin.eventTrigger('change') !== false) {
                    Plugin.goTo(Plugin.getPrevStep());
                }
            });

            if (the.options.clickableSteps === true) {
                KTUtil.on(element, '[data-wizard-type="step"]', 'click', function() {
                    var index = KTUtil.index(this) + 1;

                    if (index !== the.currentStep) {
                        Plugin.setNewStep(index);

                        // Trigger change event
                        if (Plugin.eventTrigger('change') !== false) {
                            Plugin.goTo(index);
                        }
                    }
                });
            }

            // Submit button event handler
            KTUtil.addEvent(the.btnSubmit, 'click', function(e) {
                e.preventDefault();

                Plugin.eventTrigger('submit');
            });
        },

        /**
         * Handles wizard click wizard
         */
        goTo: function(number) {
            // Skip if stopped
            if (the.stopped === true) {
                the.stopped = false;
                return;
            }

            // Skip if this step is already shown
            if (number === the.currentStep || number > the.totalSteps || number < 0) {
                return;
            }

            // Validate step number
            number = parseInt(number);

            // Set current step
            the.lastStep = the.currentStep;
            the.currentStep = number;
            the.newStep = 0;

            Plugin.updateUI();

            Plugin.eventTrigger('changed');

            return the;
        },

        /**
         * Stop wizard
         */
        stop: function() {
            the.stopped = true;
        },

        /**
         * Resume wizard
         */
        resume: function() {
            the.stopped = false;
        },

        /**
         * Check last step
         */
        isLastStep: function() {
            return the.currentStep === the.totalSteps;
        },

        /**
         * Check first step
         */
        isFirstStep: function() {
            return the.currentStep === 1;
        },

        /**
         * Check between step
         */
        isBetweenStep: function() {
            return Plugin.isLastStep() === false && Plugin.isFirstStep() === false;
        },

        /**
         * Update wizard UI after step change
         */
        updateUI: function() {
            var stepType = '';
            var index = the.currentStep - 1;

            if (Plugin.isLastStep()) {
                stepType = 'last';
            } else if (Plugin.isFirstStep()) {
                stepType = 'first';
            } else {
                stepType = 'between';
            }

            KTUtil.attr(the.element, 'data-wizard-state', stepType);

            // Steps
            var steps = KTUtil.findAll(the.element, '[data-wizard-type="step"]');

            if (steps && steps.length > 0) {
                for (var i = 0, len = steps.length; i < len; i++) {
                    if (i == index) {
                        KTUtil.attr(steps[i], 'data-wizard-state', 'current');
                    } else {
                        if (i < index) {
                            KTUtil.attr(steps[i], 'data-wizard-state', 'done');
                        } else {
                            KTUtil.attr(steps[i], 'data-wizard-state', 'pending');
                        }
                    }
                }
            }

            // Steps Info
            var stepsInfo = KTUtil.findAll(the.element, '[data-wizard-type="step-info"]');
            if (stepsInfo &&stepsInfo.length > 0) {
                for (var i = 0, len = stepsInfo.length; i < len; i++) {
                    if (i == index) {
                        KTUtil.attr(stepsInfo[i], 'data-wizard-state', 'current');
                    } else {
                        KTUtil.removeAttr(stepsInfo[i], 'data-wizard-state');
                    }
                }
            }

            // Steps Content
            var stepsContent = KTUtil.findAll(the.element, '[data-wizard-type="step-content"]');
            if (stepsContent&& stepsContent.length > 0) {
                for (var i = 0, len = stepsContent.length; i < len; i++) {
                    if (i == index) {
                        KTUtil.attr(stepsContent[i], 'data-wizard-state', 'current');
                    } else {
                        KTUtil.removeAttr(stepsContent[i], 'data-wizard-state');
                    }
                }
            }
        },

        /**
         * Get next step number
         */
        getNextStep: function() {
            if (the.totalSteps >= (the.currentStep + 1)) {
                return the.currentStep + 1;
            } else {
                return the.totalSteps;
            }
        },

        /**
         * Get prev step number
         */
        getPrevStep: function() {
            if ((the.currentStep - 1) >= 1) {
                return the.currentStep - 1;
            } else {
                return 1;
            }
        },

        /**
         * Get new step number
         */
        getNewStep: function() {
            return the.newStep;
        },

        /**
         * Set new step
         */
        setNewStep: function(step) {
            the.newStep = step;
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, nested) {
            //KTUtil.triggerCustomEvent(name);
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Go to the next step
     */
    the.goNext = function() {
        return Plugin.goTo(Plugin.getNextStep());
    };

    /**
     * Go to the prev step
     */
    the.goPrev = function() {
        return Plugin.goTo(Plugin.getPrevStep());
    };

    /**
     * Go to the last step
     */
    the.goLast = function() {
        return Plugin.goTo(Plugin.getLastStep());
    };

    /**
     * Go to the first step
     */
    the.goFirst = function() {
        return Plugin.goTo(Plugin.getFirstStep());
    };

    /**
     * Go to a step
     */
    the.goTo = function(number) {
        return Plugin.goTo(number);
    };

    /**
     * Stop wizard
     */
    the.stop = function() {
        return Plugin.stop();
    };

    /**
     * Resume wizard
     */
    the.resume = function() {
        return Plugin.resume();
    };

    /**
     * Get current step number
     */
    the.getStep = function() {
        return the.currentStep;
    };

    /**
     * Get new step number
     */
    the.getNewStep = function() {
        return Plugin.getNewStep();
    };

    /**
     * Set new step number
     */
    the.setNewStep = function(number) {
        Plugin.setNewStep(number);
    };

    /**
     * Check last step
     */
    the.isLastStep = function() {
        return Plugin.isLastStep();
    };

    /**
     * Check first step
     */
    the.isFirstStep = function() {
        return Plugin.isFirstStep();
    };

    /**
     * Attach event("change", "changed", "submit")
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTWizard;
}

"use strict";

var KTLayoutAsideMenu = function() {
    // Private properties
    var _body;
    var _element;
    var _menuObject;

	// Initialize
	var _init = function() {
		var menuDesktopMode = (KTUtil.attr(_element, 'data-menu-dropdown') === '1' ? 'dropdown' : 'accordion');
        var scroll;

		if (KTUtil.attr(_element, 'data-menu-scroll') === '1') {
			scroll = {
				rememberPosition: true, // remember position on page reload
				height: function() { // calculate available scrollable area height
					var height = parseInt(KTUtil.getViewPort().height);

					if (KTUtil.isBreakpointUp('lg')) {
						height = height - KTLayoutBrand.getHeight();
					}

					height = height - (parseInt(KTUtil.css(_element, 'marginBottom')) + parseInt(KTUtil.css(_element, 'marginTop')));

					return height;
				}
			};
		}

		_menuObject = new KTMenu(_element, {
			// Vertical scroll
			scroll: scroll,

			// Submenu setup
			submenu: {
				desktop: menuDesktopMode,
				tablet: 'accordion', // menu set to accordion in tablet mode
				mobile: 'accordion' // menu set to accordion in mobile mode
			},

			// Accordion setup
			accordion: {
				expandAll: false // allow having multiple expanded accordions in the menu
			}
		});
	}

    var _initHover = function() {
        // Handle Minimized Aside Hover
		if (KTUtil.hasClass(_body, 'aside-fixed') && KTUtil.hasClass(_body, 'aside-minimize-hoverable')) {
			var insideTm;
			var outsideTm;

            // Handle Aside Hover Mode
			KTUtil.addEvent(_element, 'mouseenter', function(e) {
				e.preventDefault();

				if (KTUtil.isBreakpointUp('lg') === false) {
					return;
				}

				if (outsideTm) {
					clearTimeout(outsideTm);
					outsideTm = null;
				}

                if (insideTm) {
					clearTimeout(insideTm);
					insideTm = null;
				}

				insideTm = setTimeout(function() {
					if (KTUtil.hasClass(_body, 'aside-minimize') && KTUtil.isBreakpointUp('lg')) {
						// Hover class
						KTUtil.addClass(_body, 'aside-minimize-hover');

						KTLayoutAsideMenu.getMenu().scrollUpdate();
						KTLayoutAsideMenu.getMenu().scrollTop();
					}
				}, 50);
			});

			KTUtil.addEvent(KTLayoutAside.getElement(), 'mouseleave', function(e) {
				e.preventDefault();

				if (KTUtil.isBreakpointUp('lg') === false) {
					return;
				}

				if (insideTm) {
					clearTimeout(insideTm);
					insideTm = null;
				}

                if (outsideTm) {
					clearTimeout(outsideTm);
					outsideTm = null;
				}

				outsideTm = setTimeout(function() {
				    if (KTUtil.hasClass(_body, 'aside-minimize-hover') && KTUtil.isBreakpointUp('lg')) {
					    KTUtil.removeClass(_body, 'aside-minimize-hover');

						// Hover class
                        KTLayoutAsideMenu.getMenu().scrollUpdate();
						KTLayoutAsideMenu.getMenu().scrollTop();
					}
				}, 100);
			});
		}
	}

    // Public methods
	return {
		init: function(id) {
            _body = KTUtil.getBody();
            _element = KTUtil.getById(id);

            if (!_element) {
                return;
            }

            // Initialize menu
            _init();
            _initHover();
		},

		getElement: function() {
			return _element;
		},

        getMenu: function() {
			return _menuObject;
		},

        pauseDropdownHover: function(time) {
			if (_menuObject) {
				_menuObject.pauseDropdownHover(time);
			}
		},

		closeMobileOffcanvas: function() {
			if (_menuObject && KTUtil.isMobileDevice()) {
				_menuObject.hide();
			}
		}
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutAsideMenu;
}

"use strict";

var KTLayoutAsideToggle = function() {
    // Private properties
    var _body;
    var _element;
    var _toggleObject;

	// Initialize
	var _init = function() {
		_toggleObject = new KTToggle(_element, _body, {
			targetState: 'aside-minimize',
			toggleState: 'active'
		});

		_toggleObject.on('toggle', function(toggle) {
            // Update sticky card
            if (typeof KTLayoutStickyCard !== 'undefined') {
                KTLayoutStickyCard.update();
            }

            // Pause header menu dropdowns
            if (typeof KTLayoutHeaderMenu !== 'undefined') {
                KTLayoutHeaderMenu.pauseDropdownHover(800);
            }

            // Pause aside menu dropdowns
            if (typeof KTLayoutAsideMenu !== 'undefined') {
                KTLayoutAsideMenu.pauseDropdownHover(800);
            }

            // Remember state in cookie
			KTCookie.setCookie('kt_aside_toggle_state', toggle.getState());
			// to set default minimized left aside use this cookie value in your
			// server side code and add "kt-primary--minimize aside-minimize" classes to
			// the body tag in order to initialize the minimized left aside mode during page loading.
		});

		_toggleObject.on('beforeToggle', function(toggle) {
			if (KTUtil.hasClass(_body, 'aside-minimize') === false && KTUtil.hasClass(_body, 'aside-minimize-hover')) {
				KTUtil.removeClass(_body, 'aside-minimize-hover');
			}
		});
	}

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);
            _body = KTUtil.getBody();

            if (!_element) {
                return;
            }

            // Initialize
            _init();
		},

        getElement: function() {
            return _element;
        },

        getToggle: function() {
			return _toggleObject;
		},

		onToggle: function(handler) {
			if (typeof _toggleObject.element !== 'undefined') {
				_toggleObject.on('toggle', handler);
			}
		}
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutAsideToggle;
}

"use strict";

var KTLayoutAside = function() {
    // Private properties
    var _body;
    var _element;
    var _offcanvasObject;

    // Private functions
	// Initialize
	var _init = function() {
		var offcanvasClass = KTUtil.hasClass(_element, 'aside-offcanvas-default') ? 'aside-offcanvas-default' : 'aside';

        // Initialize mobile aside offcanvas
		_offcanvasObject = new KTOffcanvas(_element, {
			baseClass: offcanvasClass,
			overlay: true,
			closeBy: 'kt_aside_close_btn',
			toggleBy: {
				target: 'kt_aside_mobile_toggle',
				state: 'mobile-toggle-active'
			}
		});
	}

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);
            _body = KTUtil.getBody();

            if (!_element) {
                return;
            }

            // Initialize
            _init();
        },

        getElement: function() {
            return _element;
        },

        getOffcanvas: function() {
            return _offcanvasObject;
        },

        isFixed: function() {
            return KTUtil.hasClass(_body, 'aside-fixed');
        },

        isMinimized: function() {
            return (KTUtil.hasClass(_body, 'aside-fixed') && KTUtil.hasClass(_body, 'aside-minimize'));
        },

        isHoverable: function() {
            return (KTUtil.hasClass(_body, 'aside-fixed') && KTUtil.hasClass(_body, 'aside-minimize-hoverable'));
        }
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutAside;
}

"use strict";

var KTLayoutBrand = function() {
    // Private properties
    var _element;

    // Private functions
    var _getHeight = function() {
        var height = 0;

        if (_element) {
            height = KTUtil.actualHeight(_element);
        }

        return height;
    }

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);

            if (!_element) {
                return;
            }
		},

        getElement: function() {
            return _element;
        },

        getHeight: function() {
            return _getHeight();
        }
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutBrand;
}

"use strict";

var KTLayoutContent = function() {
    // Private properties
    var _element;

	// Private functions
	var _getHeight = function() {
		var height;

		height = KTUtil.getViewPort().height;

        if (_element) {
            height = height - parseInt(KTUtil.css(_element, 'paddingTop')) - parseInt(KTUtil.css(_element, 'paddingBottom'));
        }

        height = height - KTLayoutHeader.getHeight();
        height = height - KTLayoutSubheader.getHeight();
        height = height - KTLayoutFooter.getHeight();
		return height;
	}

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);
		},

		getHeight: function() {
			return _getHeight();
		},

        getElement: function() {
            return _element;
        }
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutContent;
}

"use strict";

var KTLayoutFooter = function() {
    // Private properties
    var _element;

	// Private functions
	var _getHeight = function() {
		var height = 0;

        if (_element) {
            height = KTUtil.actualHeight(_element);
        }

		return height;
	}

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);
		},

		getHeight: function() {
			return _getHeight();
		},

        getElement: function() {
            return _element;
        }
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutFooter;
}

"use strict";

var KTLayoutHeaderDropdowns = function() {
    // Private properties
	var _toggleElement;
    var _toggleObject;

    // Private functions
    var _init = function() {
        _toggleObject = new KTToggle(_toggleElement, KTUtil.getBody(), {
            targetState: 'topbar-mobile-on',
            toggleState: 'active',
        });
    }
	var _getHeight = function() {
        var height = 0;

        if (_toggleObject) {
            height = KTUtil.actualHeight(_element) + 1;
        }

        return height;
    }


    /**
     * 
     * 
     	KTLayoutHeaderDropdowns.init("dropdown-head");
		var el = KTLayoutHeaderDropdowns.getToggleElement();
		var outerHeight = KTUtil.outerHeight(el);
		var height = outerHeight - 30;
		var isInit = false;
		if (outerHeight > 0) {
			$("#main-container").css("margin-top", height);
		}
		function hideShow() {
			// var el=KTLayoutHeaderDropdowns.getToggleElement();
			// var height=KTUtil.height(el);
			if (isInit) {
				$("#main-container").css("margin-top", height);
				isInit = false;
			} else {
				$("#main-container").css("margin-top", "-30px");
				isInit = true;
			}
			$("#dropdown-head").toggle();
		}
     */
    // Public methods
	return {
		init: function(id) {
            _toggleElement = KTUtil.getById(id);

			if (!_toggleElement) {
                return;
            }

            // Initialize
            _init();
		},

        getToggleElement: function() {
            return _toggleElement;
        },
		getHeight: function() {
            return _getHeight();
        }
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutHeaderTopbar;
}

"use strict";

var KTLayoutHeaderMenu = function() {
    // Private properties
	var _menuElement;
    var _menuObject;
    var _offcanvasElement;
    var _offcanvasObject;

    // Private functions
	var _init = function() {
		_offcanvasObject = new KTOffcanvas(_offcanvasElement, {
			overlay: true,
			baseClass: 'header-menu-wrapper',
			closeBy: 'kt_header_menu_mobile_close_btn',
			toggleBy: {
				target: 'kt_header_mobile_toggle',
				state: 'mobile-toggle-active'
			}
		});
		
		_menuObject = new KTMenu(_menuElement, {
			submenu: {
				desktop: 'dropdown',
				tablet: 'accordion',
				mobile: 'accordion'
			},
			accordion: {
				slideSpeed: 200, // accordion toggle slide speed in milliseconds
				expandAll: false // allow having multiple expanded accordions in the menu
			}
		});

		// Close aside offcanvas panel before page reload On tablet and mobile
        _menuObject.on('linkClick', function(menu) {
            if (KTUtil.isBreakpointDown('lg')) { // Tablet and mobile mode
                _offcanvasObject.hide(); // Hide offcanvas after general link click
            }
        });
	}

    // Public methods
	return {
        init: function(menuId, offcanvasId) {
            _menuElement = KTUtil.getById(menuId);
            _offcanvasElement = KTUtil.getById(offcanvasId);

            if (!_menuElement) {
                return;
            }

            // Initialize menu
            _init();
		},

		getMenuElement: function() {
			return _menuElement;
		},

        getOffcanvasElement: function() {
			return _offcanvasElement;
		},

        getMenu: function() {
			return _menuObject;
		},

		pauseDropdownHover: function(time) {
			if (_menuObject) {
				_menuObject.pauseDropdownHover(time);
			}
		},

        getOffcanvas: function() {
			return _offcanvasObject;
		},

		closeMobileOffcanvas: function() {
			if (_menuObject && KTUtil.isMobileDevice()) {
				_offcanvasObject.hide();
			}
		}
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutHeaderMenu;
}

"use strict";

var KTLayoutHeaderTopbar = function() {
    // Private properties
	var _toggleElement;
    var _toggleObject;

    // Private functions
    var _init = function() {
        _toggleObject = new KTToggle(_toggleElement, KTUtil.getBody(), {
            targetState: 'topbar-mobile-on',
            toggleState: 'active',
        });
    }

    // Public methods
	return {
		init: function(id) {
            _toggleElement = KTUtil.getById(id);

			if (!_toggleElement) {
                return;
            }

            // Initialize
            _init();
		},

        getToggleElement: function() {
            return _toggleElement;
        }
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutHeaderTopbar;
}

"use strict";

var KTLayoutHeader = function() {
    // Private properties
    var _element;
    var _elementForMobile;
    var _object;

	// Private functions
    // Get Height
    var _getHeight = function() {
        var height = 0;

        if (_element) {
            height = KTUtil.actualHeight(_element) + 1;
        }

        return height;
    }

    // Get Height
    var _getHeightForMobile = function() {
        var height;

        height = KTUtil.actualHeight(_elementForMobile);

        return height;
    }

    // Public Methods
	return {
		init: function(id, idForMobile) {
            _element = KTUtil.getById(id);
            _elementForMobile = KTUtil.getById(idForMobile);

            if (!_element) {
                return;
            }
		},

        isFixed: function() {
            return KTUtil.hasClass(KTUtil.getBody(), 'header-fixed')
        },

        isFixedForMobile: function() {
            return KTUtil.hasClass(KTUtil.getBody(), 'header-mobile-fixed')
        },

        getElement: function() {
            return _element;
        },

        getElementForMobile: function() {
            return _elementForMobile;
        },

        getHeader: function() {
            return _object;
        },

        getHeight: function() {
            return _getHeight();
        },

        getHeightForMobile: function() {
            return _getHeightForMobile();
        }
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutHeader;
}

"use strict";

var KTLayoutStickyCard = function() {
    // Private properties
	var _element;
    var _object;

	// Private functions
	var _init = function() {
		var offset = 300;

		if (typeof KTLayoutHeader !== 'undefined') {
			offset = KTLayoutHeader.getHeight();
		}

        _object = new KTCard(_element, {
			sticky: {
				offset: offset,
				zIndex: 90,
				position: {
					top: function() {
						var pos = 0;
                        var body = KTUtil.getBody();

						if (KTUtil.isBreakpointUp('lg')) {
							if (typeof KTLayoutHeader !== 'undefined' && KTLayoutHeader.isFixed()) {
								pos = pos + KTLayoutHeader.getHeight();
							}

							if (typeof KTLayoutSubheader !== 'undefined' && KTLayoutSubheader.isFixed()) {
								pos = pos + KTLayoutSubheader.getHeight();
							}
						} else {
							if (typeof KTLayoutHeader !== 'undefined' && KTLayoutHeader.isFixedForMobile()) {
								pos = pos + KTLayoutHeader.getHeightForMobile();
							}
						}

						pos = pos - 1; // remove header border width

						return pos;
					},
					left: function(card) {
						return KTUtil.offset(_element).left;
					},
					right: function(card) {
						var body = KTUtil.getBody();

						var cardWidth = parseInt(KTUtil.css(_element, 'width'));
						var bodyWidth = parseInt(KTUtil.css(body, 'width'));
						var cardOffsetLeft = KTUtil.offset(_element).left;

						return bodyWidth - cardWidth - cardOffsetLeft;
					}
				}
			}
		});

		_object.initSticky();

		KTUtil.addResizeHandler(function() {
			_object.updateSticky();
		});
	}

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);

            if (!_element) {
                return;
            }

            // Initialize
			_init();
		},

		update: function() {
			if (_object) {
				_object.updateSticky();
			}
		}
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutStickyCard;
}

"use strict";

var KTLayoutStretchedCard = function() {
    // Private properties
	var _element;

	// Private functions
	var _init = function() {
		var scroll = KTUtil.find(_element, '.card-scroll');
		var cardBody = KTUtil.find(_element, '.card-body');
		var cardHeader = KTUtil.find(_element, '.card-header');

		var height = KTLayoutContent.getHeight();

		height = height - parseInt(KTUtil.actualHeight(cardHeader));

		height = height - parseInt(KTUtil.css(_element, 'marginTop')) - parseInt(KTUtil.css(_element, 'marginBottom'));
		height = height - parseInt(KTUtil.css(_element, 'paddingTop')) - parseInt(KTUtil.css(_element, 'paddingBottom'));

		height = height - parseInt(KTUtil.css(cardBody, 'paddingTop')) - parseInt(KTUtil.css(cardBody, 'paddingBottom'));
		height = height - parseInt(KTUtil.css(cardBody, 'marginTop')) - parseInt(KTUtil.css(cardBody, 'marginBottom'));

		height = height - 3;

		KTUtil.css(scroll, 'height', height + 'px');
	}

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);

            if (!_element) {
                return;
            }

            // Initialize
			_init();

            // Re-calculate on window resize
            KTUtil.addResizeHandler(function() {
				_init();
			});
		},

		update: function() {
			_init();
		}
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutStretchedCard;
}

"use strict";

var KTLayoutSubheader = function() {
    // Private properties
    var _element;

    // Private functions
    var _getHeight = function() {
        var height = 0;

        if (_element) {
            height = KTUtil.actualHeight(_element);
        }

        return height;
    }

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);

            if (!_element) {
                return;
            }
		},

        isFixed: function() {
            return KTUtil.hasClass(KTUtil.getBody(), 'subheader-fixed');
        },

        getElement: function() {
            return _element;
        },

        getHeight: function() {
            return _getHeight();
        }
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutSubheader;
}

// "use strict";

// // Class definition
// var KTLayoutChat = function () {
// 	// Private functions
// 	var _init = function (element) {
// 		var scrollEl = KTUtil.find(element, '.scroll');
// 		var cardBodyEl = KTUtil.find(element, '.card-body');
// 		var cardHeaderEl = KTUtil.find(element, '.card-header');
// 		var cardFooterEl = KTUtil.find(element, '.card-footer');

// 		if (!scrollEl) {
// 			return;
// 		}

// 		// initialize perfect scrollbar(see:  https://github.com/utatti/perfect-scrollbar)
// 		KTUtil.scrollInit(scrollEl, {
// 			windowScroll: false, // allow browser scroll when the scroll reaches the end of the side
// 			mobileNativeScroll: true,  // enable native scroll for mobile
// 			desktopNativeScroll: false, // disable native scroll and use custom scroll for desktop
// 			resetHeightOnDestroy: true,  // reset css height on scroll feature destroyed
// 			handleWindowResize: true, // recalculate hight on window resize
// 			rememberPosition: true, // remember scroll position in cookie
// 			height: function() {  // calculate height
// 				var height;

// 				if (KTUtil.isBreakpointDown('lg')) { // Mobile mode
// 					return KTUtil.hasAttr(scrollEl, 'data-mobile-height') ? parseInt(KTUtil.attr(scrollEl, 'data-mobile-height')) : 400;
// 				} else if (KTUtil.isBreakpointUp('lg') && KTUtil.hasAttr(scrollEl, 'data-height')) { // Desktop Mode
// 					return parseInt(KTUtil.attr(scrollEl, 'data-height'));
// 				} else {
// 					height = KTLayoutContent.getHeight();

// 					if (scrollEl) {
// 						height = height - parseInt(KTUtil.css(scrollEl, 'margin-top')) - parseInt(KTUtil.css(scrollEl, 'margin-bottom'));
// 					}

// 					if (cardHeaderEl) {
// 						height = height - parseInt(KTUtil.css(cardHeaderEl, 'height'));
// 						height = height - parseInt(KTUtil.css(cardHeaderEl, 'margin-top')) - parseInt(KTUtil.css(cardHeaderEl, 'margin-bottom'));
// 					}

// 					if (cardBodyEl) {
// 						height = height - parseInt(KTUtil.css(cardBodyEl, 'padding-top')) - parseInt(KTUtil.css(cardBodyEl, 'padding-bottom'));
// 					}

// 					if (cardFooterEl) {
// 						height = height - parseInt(KTUtil.css(cardFooterEl, 'height'));
// 						height = height - parseInt(KTUtil.css(cardFooterEl, 'margin-top')) - parseInt(KTUtil.css(cardFooterEl, 'margin-bottom'));
// 					}
// 				}

// 				// Remove additional space
// 				height = height - 2;

// 				return height;
// 			}
// 		});

// 		// attach events
// 		KTUtil.on(element, '.card-footer textarea', 'keydown', function(e) {
// 			if (e.keyCode == 13) {
// 				_handeMessaging(element);
// 				e.preventDefault();

// 				return false;
// 			}
// 		});

// 		KTUtil.on(element, '.card-footer .chat-send', 'click', function(e) {
// 			_handeMessaging(element);
// 		});
// 	}

// 	var _handeMessaging = function(element) {
// 		var messagesEl = KTUtil.find(element, '.messages');
// 		var scrollEl = KTUtil.find(element, '.scroll');
//         var textarea = KTUtil.find(element, 'textarea');

//         if (textarea.value.length === 0 ) {
//             return;
//         }

// 		var node = document.createElement("DIV");
// 		KTUtil.addClass(node, 'd-flex flex-column mb-5 align-items-end');

// 		var html = '';
// 		html += '<div class="d-flex align-items-center">';
// 		html += '	<div>';
// 		html += '		<span class="text-muted font-size-sm">2 Hours</span>';
// 		html += '		<a href="#" class="text-dark-75 text-hover-primary font-weight-bold font-size-h6">You</a>';
// 		html += '	</div>';
// 		html += '	<div class="symbol symbol-circle symbol-40 ml-3">';
// 		html += '		<img alt="Pic" src="assets/media/users/300_12.jpg"/>';
// 		html += '	</div>';
// 		html += '</div>';
// 		html += '<div class="mt-2 rounded p-5 bg-light-primary text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">' + textarea.value + '</div>';

// 		KTUtil.setHTML(node, html);
// 		messagesEl.appendChild(node);
// 		textarea.value = '';
// 		scrollEl.scrollTop = parseInt(KTUtil.css(messagesEl, 'height'));

// 		var ps;
// 		if (ps = KTUtil.data(scrollEl).get('ps')) {
// 			ps.update();
// 		}

// 		setTimeout(function() {
// 			var node = document.createElement("DIV");
// 			KTUtil.addClass(node, 'd-flex flex-column mb-5 align-items-start');

// 			var html = '';
// 			html += '<div class="d-flex align-items-center">';
// 			html += '	<div class="symbol symbol-circle symbol-40 mr-3">';
// 			html += '		<img alt="Pic" src="assets/media/users/300_12.jpg"/>';
// 			html += '	</div>';
// 			html += '	<div>';
// 			html += '		<a href="#" class="text-dark-75 text-hover-primary font-weight-bold font-size-h6">Matt Pears</a>';
// 			html += '		<span class="text-muted font-size-sm">Just now</span>';
// 			html += '	</div>';
// 			html += '</div>';
// 			html += '<div class="mt-2 rounded p-5 bg-light-success text-dark-50 font-weight-bold font-size-lg text-left max-w-400px">';
// 			html += 'Right before vacation season we have the next Big Deal for you.';
// 			html += '</div>';

// 			KTUtil.setHTML(node, html);
// 			messagesEl.appendChild(node);
// 			textarea.value = '';
// 			scrollEl.scrollTop = parseInt(KTUtil.css(messagesEl, 'height'));

// 			var ps;
// 			if (ps = KTUtil.data(scrollEl).get('ps')) {
// 				ps.update();
// 			}
// 		}, 2000);
// 	}

// 	// Public methods
// 	return {
// 		init: function(id) {
// 			// Init modal chat example
// 			_init(KTUtil.getById(id));

// 			// Trigger click to show popup modal chat on page load
// 			if (encodeURI(window.location.hostname) == 'keenthemes.com' || encodeURI(window.location.hostname) == 'www.keenthemes.com') {
// 				setTimeout(function() {
// 		            if (!KTCookie.getCookie('kt_app_chat_shown')) {
// 		                var expires = new Date(new Date().getTime() + 60 * 60 * 1000); // expire in 60 minutes from now

// 						KTCookie.setCookie('kt_app_chat_shown', 1, { expires: expires });

// 						if (KTUtil.getById('kt_app_chat_launch_btn')) {
// 							KTUtil.getById('kt_app_chat_launch_btn').click();
// 						}
// 		            }
// 		        }, 2000);
// 	        }
//         },

//         setup: function(element) {
//             _init(element);
//         }
// 	};
// }();

// // Webpack support
// if (typeof module !== 'undefined') {
// 	module.exports = KTLayoutChat;
// }

// "use strict";

// var KTLayoutDemoPanel = function() {
//     // Private properties
//     var _element;
//     var _offcanvasObject;

//     // Private functions
//     var _init = function() {
//         _offcanvasObject = new KTOffcanvas(_element, {
//             overlay: true,
//             baseClass: 'offcanvas',
//             placement: 'right',
//             closeBy: 'kt_demo_panel_close',
//             toggleBy: 'kt_demo_panel_toggle'
//         });

//         var header = KTUtil.find(_element, '.offcanvas-header');
//         var content = KTUtil.find(_element, '.offcanvas-content');
//         var wrapper = KTUtil.find(_element, '.offcanvas-wrapper');
//         var footer = KTUtil.find(_element, '.offcanvas-footer');

//         KTUtil.scrollInit(wrapper, {
//             disableForMobile: true,
//             resetHeightOnDestroy: true,
//             handleWindowResize: true,
//             height: function() {
//                 var height = parseInt(KTUtil.getViewPort().height);

//                 if (header) {
//                     height = height - parseInt(KTUtil.actualHeight(header));
//                     height = height - parseInt(KTUtil.css(header, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(header, 'marginBottom'));
//                 }

//                 if (content) {
//                     height = height - parseInt(KTUtil.css(content, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(content, 'marginBottom'));
//                 }

//                 if (wrapper) {
//                     height = height - parseInt(KTUtil.css(wrapper, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(wrapper, 'marginBottom'));
//                 }

//                 if (footer) {
//                     height = height - parseInt(KTUtil.actualHeight(footer));
//                     height = height - parseInt(KTUtil.css(footer, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(footer, 'marginBottom'));
//                 }

//                 height = height - parseInt(KTUtil.css(_element, 'paddingTop'));
//                 height = height - parseInt(KTUtil.css(_element, 'paddingBottom'));

//                 height = height - 2;

//                 return height;
//             }
//         });

//         if (typeof offcanvas !== 'undefined' && offcanvas.length === 0) {
//             offcanvas.on('hide', function() {
//                 var expires = new Date(new Date().getTime() + 60 * 60 * 1000); // expire in 60 minutes from now
//                 KTCookie.setCookie('kt_demo_panel_shown', 1, {expires: expires});
//             });
//         }
//     }

//     var _remind = function() {
//         if (!(encodeURI(window.location.hostname) == 'keenthemes.com' || encodeURI(window.location.hostname) == 'www.keenthemes.com')) {
//             return;
//         }

//         setTimeout(function() {
//             if (!KTCookie.getCookie('kt_demo_panel_shown')) {
//                 var expires = new Date(new Date().getTime() + 15 * 60 * 1000); // expire in 15 minutes from now
//                 KTCookie.setCookie('kt_demo_panel_shown', 1, { expires: expires });
//                 if (typeof _offcanvasObject !== 'undefined') {
//                     _offcanvasObject.show();
//                 }
//             }
//         }, 4000);
//     }

//     // Public methods
//     return {
//         init: function(id) {
//             _element = KTUtil.getById(id);

//             if (!_element) {
//                 return;
//             }

//             // Initialize
//             _init();

//             // Remind
//             _remind();
//         }
//     };
// }();

// // Webpack support
// if (typeof module !== 'undefined') {
// 	module.exports = KTLayoutDemoPanel;
// }

// "use strict";

// var KTLayoutExamples = function() {

//     var initDefaultMode = function(element) {
//         var elements = element;
//         if (typeof elements === 'undefined') {
//             elements = document.querySelectorAll('.example:not(.example-compact):not(.example-hover):not(.example-basic)');
//         }

//         if (elements && elements.length > 0 ) {
//             for (var i = 0; i < elements.length; ++i) {
//                 var example = elements[i];
//                 var copy = KTUtil.find(example, '.example-copy');

//                 if (copy) {
//                     var clipboard = new ClipboardJS(copy, {
//                         target: function(trigger) {
//                             var example = trigger.closest('.example');
//                             var el = KTUtil.find(example, '.example-code .tab-pane.active');

//                             if (!el) {
//                                 el = KTUtil.find(example, '.example-code');
//                             }

//                             return el;
//                         }
//                     });

//                     clipboard.on('success', function(e) {
//                         KTUtil.addClass(e.trigger, 'example-copied');
//                         e.clearSelection();

//                         setTimeout(function() {
//                             KTUtil.removeClass(e.trigger, 'example-copied');
//                         }, 2000);
//                     });
//                 }
//             }
//         }
//     }

//     var initCompactMode = function(element) {
//         var example,code,toggle,copy, clipboard;

//         var elements = element;
//         if (typeof elements === 'undefined') {
//             var elements = document.querySelectorAll('.example.example-compact');
//         }

//         if (elements && elements.length > 0 ) {
//             for (var i = 0; i < elements.length; ++i) {
//                 var example = elements[i];
//                 var toggle = KTUtil.find(example, '.example-toggle');
//                 var copy = KTUtil.find(example, '.example-copy');

//                 // Handle toggle
//                 KTUtil.addEvent(toggle, 'click', function() {
//                     var example = this.closest('.example');
//                     var code =  KTUtil.find(example, '.example-code');
//                     var the = this;

//                     if (KTUtil.hasClass(this, 'example-toggled')) {
//                         KTUtil.slideUp(code, 300, function() {
//                             KTUtil.removeClass(the, 'example-toggled');
//                             KTUtil.removeClass(code, 'example-code-on');
//                             KTUtil.hide(code);
//                         });
//                     } else {
//                         KTUtil.addClass(code, 'example-code-on');
//                         KTUtil.addClass(this, 'example-toggled');
//                         KTUtil.slideDown(code, 300, function() {
//                             KTUtil.show(code);
//                         });
//                     }
//                 });

//                 // Handle copy
//                 if (copy) {
//                     var clipboard = new ClipboardJS(copy, {
//                         target: function(trigger) {
//                             var example = trigger.closest('.example');
//                             var el = KTUtil.find(example, '.example-code .tab-pane.active');

//                             if (!el) {
//                                 el = KTUtil.find(example, '.example-code');
//                             }

//                             return el;
//                         }
//                     });

//                     clipboard.on('success', function(e) {
//                         KTUtil.addClass(e.trigger, 'example-copied');
//                         e.clearSelection();

//                         setTimeout(function() {
//                             KTUtil.removeClass(e.trigger, 'example-copied');
//                         }, 2000);
//                     });
//                 }
//             }
//         }
//     }

//     return {
//         init: function(element, options) {
//             initDefaultMode(element);
//             initCompactMode(element);
//         }
//     };
// }();

// // webpack support
// if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
//     module.exports = KTLayoutExamples;
// }

// "use strict";

// var KTLayoutQuickActions = function() {
//     // Private properties
//     var _element;
//     var _offcanvasObject;

//     // Private functions
//     var _init = function() {
//         var header = KTUtil.find(_element, '.offcanvas-header');
//         var content = KTUtil.find(_element, '.offcanvas-content');

//         _offcanvasObject = new KTOffcanvas(_element, {
//             overlay: true,
//             baseClass: 'offcanvas',
//             placement: 'right',
//             closeBy: 'kt_quick_actions_close',
//             toggleBy: 'kt_quick_actions_toggle'
//         });

//         KTUtil.scrollInit(content, {
//             disableForMobile: true,
//             resetHeightOnDestroy: true,
//             handleWindowResize: true,
//             height: function() {
//                 var height = parseInt(KTUtil.getViewPort().height);

//                 if (header) {
//                     height = height - parseInt(KTUtil.actualHeight(header));
//                     height = height - parseInt(KTUtil.css(header, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(header, 'marginBottom'));
//                 }

//                 if (content) {
//                     height = height - parseInt(KTUtil.css(content, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(content, 'marginBottom'));
//                 }

//                 height = height - parseInt(KTUtil.css(_element, 'paddingTop'));
//                 height = height - parseInt(KTUtil.css(_element, 'paddingBottom'));

//                 height = height - 2;

//                 return height;
//             }
//         });
//     }

//     // Public methods
//     return {
//         init: function(id) {
//             _element = KTUtil.getById(id);

//             if (!_element) {
//                 return;
//             }

//             // Initialize
//             _init();
//         },

//         getElement: function() {
//             return _element;
//         }
//     };
// }();

// // Webpack support
// if (typeof module !== 'undefined') {
// 	module.exports = KTLayoutQuickActions;
// }

// "use strict";

// var KTLayoutQuickCartPanel = function() {
//     // Private properties
//     var _element;
//     var _offcanvasObject;

//     // Private functions
//     var _init = function() {
//         _offcanvasObject = new KTOffcanvas(_element, {
//             overlay: true,
//             baseClass: 'offcanvas',
//             placement: 'right',
//             closeBy: 'kt_quick_cart_close',
//             toggleBy: 'kt_quick_cart_toggle'
//         });

//         var header = KTUtil.find(_element, '.offcanvas-header');
//         var content = KTUtil.find(_element, '.offcanvas-content');
//         var wrapper = KTUtil.find(_element, '.offcanvas-wrapper');
//         var footer = KTUtil.find(_element, '.offcanvas-footer');

//         KTUtil.scrollInit(wrapper, {
//             disableForMobile: true,
//             resetHeightOnDestroy: true,
//             handleWindowResize: true,
//             height: function() {
//                 var height = parseInt(KTUtil.getViewPort().height);

//                 if (header) {
//                     height = height - parseInt(KTUtil.actualHeight(header));
//                     height = height - parseInt(KTUtil.css(header, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(header, 'marginBottom'));
//                 }

//                 if (content) {
//                     height = height - parseInt(KTUtil.css(content, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(content, 'marginBottom'));
//                 }

//                 if (wrapper) {
//                     height = height - parseInt(KTUtil.css(wrapper, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(wrapper, 'marginBottom'));
//                 }

//                 if (footer) {
//                     height = height - parseInt(KTUtil.actualHeight(footer));
//                     height = height - parseInt(KTUtil.css(footer, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(footer, 'marginBottom'));
//                 }

//                 height = height - parseInt(KTUtil.css(_element, 'paddingTop'));
//                 height = height - parseInt(KTUtil.css(_element, 'paddingBottom'));

//                 height = height - 2;

//                 return height;
//             }
//         });
//     }

//     // Public methods
//     return {
//         init: function(id) {
//             _element = KTUtil.getById(id);

//             if (!_element) {
//                 return;
//             }

//             // Initialize
//             _init();
//         }
//     };
// }();

// // Webpack support
// if (typeof module !== 'undefined') {
// 	module.exports = KTLayoutQuickCartPanel;
// }

"use strict";

var KTLayoutQuickNotifications = function() {
    // Private properties
    var _element;
    var _offcanvasObject;

    // Private functions
    var _init = function() {
        var header = KTUtil.find(_element, '.offcanvas-header');
        var content = KTUtil.find(_element, '.offcanvas-content');

        _offcanvasObject = new KTOffcanvas(_element, {
            overlay: true,
            baseClass: 'offcanvas',
            placement: 'right',
            closeBy: 'kt_quick_notifications_close',
            toggleBy: 'kt_quick_notifications_toggle'
        });

        KTUtil.scrollInit(content, {
            disableForMobile: true,
            resetHeightOnDestroy: true,
            handleWindowResize: true,
            height: function() {
                var height = parseInt(KTUtil.getViewPort().height);

                if (header) {
                    height = height - parseInt(KTUtil.actualHeight(header));
                    height = height - parseInt(KTUtil.css(header, 'marginTop'));
                    height = height - parseInt(KTUtil.css(header, 'marginBottom'));
                }

                if (content) {
                    height = height - parseInt(KTUtil.css(content, 'marginTop'));
                    height = height - parseInt(KTUtil.css(content, 'marginBottom'));
                }

                height = height - parseInt(KTUtil.css(_element, 'paddingTop'));
                height = height - parseInt(KTUtil.css(_element, 'paddingBottom'));

                height = height - 2;

                return height;
            }
        });
    }

    // Public methods
    return {
        init: function(id) {
            _element = KTUtil.getById(id);

            if (!_element) {
                return;
            }

            // Initialize
            _init();
        },

        getElement: function() {
            return _element;
        }
    };
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutQuickNotifications;
}

// "use strict";

// var KTLayoutQuickPanel = function() {
//     // Private properties
//     var _element;
//     var _offcanvasObject;
//     var _notificationsElement;
//     var _logsElement;
//     var _settingsElement;

//     // Private functions
//     var _getContentHeight = function() {
//         var height;

//         var header = KTUtil.find(_element, '.offcanvas-header');
//         var content = KTUtil.find(_element, '.offcanvas-content');

//         var height = parseInt(KTUtil.getViewPort().height);

//         if (header) {
//             height = height - parseInt(KTUtil.actualHeight(header));
//             height = height - parseInt(KTUtil.css(header, 'marginTop'));
//             height = height - parseInt(KTUtil.css(header, 'marginBottom'));
//         }

//         if (content) {
//             height = height - parseInt(KTUtil.css(content, 'marginTop'));
//             height = height - parseInt(KTUtil.css(content, 'marginBottom'));
//         }

//         height = height - parseInt(KTUtil.css(_element, 'paddingTop'));
//         height = height - parseInt(KTUtil.css(_element, 'paddingBottom'));

//         height = height - 2;

//         return height;
//     }

//     var _init = function() {
//         _offcanvasObject = new KTOffcanvas(_element, {
//             overlay: true,
//             baseClass: 'offcanvas',
//             placement: 'right',
//             closeBy: 'kt_quick_panel_close',
//             toggleBy: 'kt_quick_panel_toggle'
//         });
//     }

//     var _initNotifications = function() {
//         KTUtil.scrollInit(_notificationsElement, {
//             mobileNativeScroll: true,
//             resetHeightOnDestroy: true,
//             handleWindowResize: true,
//             height: function() {
//                 return _getContentHeight();
//             }
//         });
//     }

//     var _initLogs = function() {
//         KTUtil.scrollInit(_logsElement, {
//             mobileNativeScroll: true,
//             resetHeightOnDestroy: true,
//             handleWindowResize: true,
//             height: function() {
//                 return _getContentHeight();
//             }
//         });
//     }

//     var _initSettings = function() {
//         KTUtil.scrollInit(_settingsElement, {
//             mobileNativeScroll: true,
//             resetHeightOnDestroy: true,
//             handleWindowResize: true,
//             height: function() {
//                 return _getContentHeight();
//             }
//         });
//     }

//     var _updateScrollbars = function() {
//         $(_element).find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//             KTUtil.scrollUpdate(_notificationsElement);
//             KTUtil.scrollUpdate(_logsElement);
//             KTUtil.scrollUpdate(_settingsElement);
//         });
//     }

//     // Public methods
//     return {
//         init: function(id) {
//             _element = KTUtil.getById(id);
//             _notificationsElement = KTUtil.getById('kt_quick_panel_notifications');
//             _logsElement = KTUtil.getById('kt_quick_panel_logs');
//             _settingsElement = KTUtil.getById('kt_quick_panel_settings');

//             _init();
//             _initNotifications();
//             _initLogs();
//             _initSettings();

//             _updateScrollbars();
//         }
//     };
// }();

// // Webpack support
// if (typeof module !== 'undefined') {
// 	module.exports = KTLayoutQuickPanel;
// }

// "use strict";

// var KTLayoutQuickSearch = function() {
//     // Private properties
//     var _element;
//     var _offcanvasObject;

//     // Private functions
//     var _init = function() {
//         var header = KTUtil.find(_element, '.offcanvas-header');
//         var content = KTUtil.find(_element, '.offcanvas-content');
//         var form = KTUtil.find(_element, '.quick-search-form');
//         var results = KTUtil.find(_element, '.quick-search-wrapper');

//         _offcanvasObject = new KTOffcanvas(_element, {
//             overlay: true,
//             baseClass: 'offcanvas',
//             placement: 'right',
//             closeBy: 'kt_quick_search_close',
//             toggleBy: 'kt_quick_search_toggle'
//         });

//         KTUtil.scrollInit(results, {
//             disableForMobile: true,
//             resetHeightOnDestroy: true,
//             handleWindowResize: true,
//             height: function() {
//                 var height = parseInt(KTUtil.getViewPort().height);

//                 if (header) {
//                     height = height - parseInt(KTUtil.actualHeight(header));
//                     height = height - parseInt(KTUtil.css(header, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(header, 'marginBottom'));
//                 }

//                 if (content) {
//                     height = height - parseInt(KTUtil.css(content, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(content, 'marginBottom'));
//                 }

//                 if (results) {
//                     height = height - parseInt(KTUtil.actualHeight(form));
//                     height = height - parseInt(KTUtil.css(form, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(form, 'marginBottom'));

//                     height = height - parseInt(KTUtil.css(results, 'marginTop'));
//                     height = height - parseInt(KTUtil.css(results, 'marginBottom'));
//                 }

//                 height = height - parseInt(KTUtil.css(_element, 'paddingTop'));
//                 height = height - parseInt(KTUtil.css(_element, 'paddingBottom'));

//                 height = height - 2;

//                 return height;
//             }
//         });
//     }

//     // Public methods
//     return {
//         init: function(id) {
//             _element = KTUtil.getById(id);

//             if (!_element) {
//                 return;
//             }

//             // Initialize
//             _init();
//         },

//         getElement: function() {
//             return _element;
//         }
//     };
// }();

// // Webpack support
// if (typeof module !== 'undefined') {
// 	module.exports = KTLayoutQuickSearch;
// }

"use strict";

var KTLayoutQuickUser = function() {
    // Private properties
    var _element;
    var _offcanvasObject;

    // Private functions
    var _init = function() {
        var header = KTUtil.find(_element, '.offcanvas-header');
        var content = KTUtil.find(_element, '.offcanvas-content');

        _offcanvasObject = new KTOffcanvas(_element, {
            overlay: true,
            baseClass: 'offcanvas',
            placement: 'right',
            closeBy: 'kt_quick_user_close',
            toggleBy: 'kt_quick_user_toggle'
        });

        KTUtil.scrollInit(content, {
            disableForMobile: true,
            resetHeightOnDestroy: true,
            handleWindowResize: true,
            height: function() {
                var height = parseInt(KTUtil.getViewPort().height);

                if (header) {
                    height = height - parseInt(KTUtil.actualHeight(header));
                    height = height - parseInt(KTUtil.css(header, 'marginTop'));
                    height = height - parseInt(KTUtil.css(header, 'marginBottom'));
                }

                if (content) {
                    height = height - parseInt(KTUtil.css(content, 'marginTop'));
                    height = height - parseInt(KTUtil.css(content, 'marginBottom'));
                }

                height = height - parseInt(KTUtil.css(_element, 'paddingTop'));
                height = height - parseInt(KTUtil.css(_element, 'paddingBottom'));

                height = height - 2;

                return height;
            }
        });
    }

    // Public methods
    return {
        init: function(id) {
            _element = KTUtil.getById(id);

            if (!_element) {
                return;
            }

            // Initialize
            _init();
        },

        getElement: function() {
            return _element;
        }
    };
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutQuickUser;
}

"use strict";

var KTLayoutScrolltop = function() {
    // Private properties
    var _element;
    var _object;

    // Private functions
    var _init = function() {
        _object = new KTScrolltop(_element, {
          offset: 300,
          speed: 600,
        });
    }

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);

            if (!_element) {
                return;
            }

            // Initialize
            _init();
		},

        getElement: function() {
            return _element;
        }
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	module.exports = KTLayoutScrolltop;
}

// "use strict";
// //
// // Handle User Quick Search For Dropdown, Inline and Offcanvas Search Panels
// //

// var KTLayoutSearch = function() {
//     // Private properties
//     var _target;
//     var _form;
//     var _input;
//     var _closeIcon;
//     var _resultWrapper;
//     var _resultDropdown;
//     var _resultDropdownToggle;
//     var _closeIconContainer;
//     var _inputGroup;
//     var _query = '';

//     var _hasResult = false;
//     var _timeout = false;
//     var _isProcessing = false;
//     var _requestTimeout = 200; // ajax request fire timeout in milliseconds
//     var _spinnerClass = 'spinner spinner-sm spinner-primary';
//     var _resultClass = 'quick-search-has-result';
//     var _minLength = 2;

//     // Private functions
//     var _showProgress = function() {
//         _isProcessing = true;
//         KTUtil.addClass(_closeIconContainer, _spinnerClass);

//         if (_closeIcon) {
//             KTUtil.hide(_closeIcon);
//         }
//     }

//     var _hideProgress = function() {
//         _isProcessing = false;
//         KTUtil.removeClass(_closeIconContainer, _spinnerClass);

//         if (_closeIcon) {
//             if (_input.value.length < _minLength) {
//                 KTUtil.hide(_closeIcon);
//             } else {
//                 KTUtil.show(_closeIcon, 'flex');
//             }
//         }
//     }

//     var _showDropdown = function() {
//         if (_resultDropdownToggle && !KTUtil.hasClass(_resultDropdown, 'show')) {
//             $(_resultDropdownToggle).dropdown('toggle');
//             $(_resultDropdownToggle).dropdown('update');
//         }
//     }

//     var _hideDropdown = function() {
//         if (_resultDropdownToggle && KTUtil.hasClass(_resultDropdown, 'show')) {
//             $(_resultDropdownToggle).dropdown('toggle');
//         }
//     }

//     var _processSearch = function() {
//         if (_hasResult && _query === _input.value) {
//             _hideProgress();
//             KTUtil.addClass(_target, _resultClass);
//             _showDropdown();
//             KTUtil.scrollUpdate(_resultWrapper);

//             return;
//         }

//         _query = _input.value;

//         KTUtil.removeClass(_target, _resultClass);
//         _showProgress();
//         _hideDropdown();

//         setTimeout(function() {
//             $.ajax({
//                 url: HOST_URL + '/api/quick_search.php',
//                 data: {
//                     query: _query
//                 },
//                 dataType: 'html',
//                 success: function(res) {
//                     _hasResult = true;
//                     _hideProgress();
//                     KTUtil.addClass(_target, _resultClass);
//                     KTUtil.setHTML(_resultWrapper, res);
//                     _showDropdown();
//                     KTUtil.scrollUpdate(_resultWrapper);
//                 },
//                 error: function(res) {
//                     _hasResult = false;
//                     _hideProgress();
//                     KTUtil.addClass(_target, _resultClass);
//                     KTUtil.setHTML(_resultWrapper, '<span class="font-weight-bold text-muted">Connection error. Please try again later..</div>');
//                     _showDropdown();
//                     KTUtil.scrollUpdate(_resultWrapper);
//                 }
//             });
//         }, 1000);
//     }

//     var _handleCancel = function(e) {
//         _input.value = '';
//         _query = '';
//         _hasResult = false;
//         KTUtil.hide(_closeIcon);
//         KTUtil.removeClass(_target, _resultClass);
//         _hideDropdown();
//     }

//     var _handleSearch = function() {
//         if (_input.value.length < _minLength) {
//             _hideProgress();
//             _hideDropdown();

//             return;
//         }

//         if (_isProcessing == true) {
//             return;
//         }

//         if (_timeout) {
//             clearTimeout(_timeout);
//         }

//         _timeout = setTimeout(function() {
//             _processSearch();
//         }, _requestTimeout);
//     }

//     // Public methods
//     return {
//         init: function(id) {
//             _target = KTUtil.getById(id);

//             if (!_target) {
//                 return;
//             }

//             _form = KTUtil.find(_target, '.quick-search-form');
//             _input = KTUtil.find(_target, '.form-control');
//             _closeIcon = KTUtil.find(_target, '.quick-search-close');
//             _resultWrapper = KTUtil.find(_target, '.quick-search-wrapper');
//             _resultDropdown = KTUtil.find(_target, '.dropdown-menu');
//             _resultDropdownToggle = KTUtil.find(_target, '[data-toggle="dropdown"]');
//             _inputGroup = KTUtil.find(_target, '.input-group');
//             _closeIconContainer = KTUtil.find(_target, '.input-group .input-group-append');

//             // Attach input keyup handler
//             KTUtil.addEvent(_input, 'keyup', _handleSearch);
//             KTUtil.addEvent(_input, 'focus', _handleSearch);

//             // Prevent enter click
//             _form.onkeypress = function(e) {
//                 var key = e.charCode || e.keyCode || 0;
//                 if (key == 13) {
//                     e.preventDefault();
//                 }
//             }

//             KTUtil.addEvent(_closeIcon, 'click', _handleCancel);
//         }
//     };
// };

// // Webpack support
// if (typeof module !== 'undefined') {
//     module.exports = KTLayoutSearch;
// }

// var KTLayoutSearchInline = KTLayoutSearch;
// var KTLayoutSearchOffcanvas = KTLayoutSearch;

"use strict";

// Initialization
KTUtil.ready(function() {
    ////////////////////////////////////////////////////
    // Layout Base Partials(mandatory for core layout)//
    ////////////////////////////////////////////////////

    // Init Desktop & Mobile Headers
    if (typeof KTLayoutHeader !== 'undefined') {
        KTLayoutHeader.init('kt_header', 'kt_header_mobile');
    }

    // Init Header Menu
    if (typeof KTLayoutHeaderMenu !== 'undefined') {
        KTLayoutHeaderMenu.init('kt_header_menu', 'kt_header_menu_wrapper');
    }

    // Init Header Topbar For Mobile Mode
    if (typeof KTLayoutHeaderTopbar !== 'undefined') {
        KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
    }

    // Init Brand Panel For Logo
    if (typeof KTLayoutBrand !== 'undefined') {
        KTLayoutBrand.init('kt_brand');
    }

    // Init Aside
    if (typeof KTLayoutAside !== 'undefined') {
        KTLayoutAside.init('kt_aside');
    }

    // Init Aside Menu Toggle
    if (typeof KTLayoutAsideToggle !== 'undefined') {
        KTLayoutAsideToggle.init('kt_aside_toggle');
    }

    // Init Aside Menu
    if (typeof KTLayoutAsideMenu !== 'undefined') {
        KTLayoutAsideMenu.init('kt_aside_menu');
    }

    // Init Subheader
    if (typeof KTLayoutSubheader !== 'undefined') {
        KTLayoutSubheader.init('kt_subheader');
    }

    // Init Content
    if (typeof KTLayoutContent !== 'undefined') {
        KTLayoutContent.init('kt_content');
    }

    // Init Footer
    if (typeof KTLayoutFooter !== 'undefined') {
        KTLayoutFooter.init('kt_footer');
    }


    //////////////////////////////////////////////
    // Layout Extended Partials(optional to use)//
    //////////////////////////////////////////////

    // Init Scrolltop
    if (typeof KTLayoutScrolltop !== 'undefined') {
        KTLayoutScrolltop.init('kt_scrolltop');
    }

    // Init Sticky Card
    if (typeof KTLayoutStickyCard !== 'undefined') {
        KTLayoutStickyCard.init('kt_page_sticky_card');
    }

    // Init Stretched Card
    if (typeof KTLayoutStretchedCard !== 'undefined') {
        KTLayoutStretchedCard.init('kt_page_stretched_card');
    }

    // Init Code Highlighter & Preview Blocks(used to demonstrate the theme features)
    if (typeof KTLayoutExamples !== 'undefined') {
        KTLayoutExamples.init();
    }

    // Init Demo Selection Panel
    if (typeof KTLayoutDemoPanel !== 'undefined') {
        KTLayoutDemoPanel.init('kt_demo_panel');
    }

    // Init Chat App(quick modal chat)
    if (typeof KTLayoutChat !== 'undefined') {
        KTLayoutChat.init('kt_chat_modal');
    }

    // Init Quick Actions Offcanvas Panel
    if (typeof KTLayoutQuickActions !== 'undefined') {
        KTLayoutQuickActions.init('kt_quick_actions');
    }

    // Init Quick Notifications Offcanvas Panel
    if (typeof KTLayoutQuickNotifications !== 'undefined') {
        KTLayoutQuickNotifications.init('kt_quick_notifications');
    }

    // Init Quick Offcanvas Panel
    if (typeof KTLayoutQuickPanel!== 'undefined') {
        KTLayoutQuickPanel.init('kt_quick_panel');
    }

    // Init Quick User Panel
    if (typeof KTLayoutQuickUser !== 'undefined') {
        KTLayoutQuickUser.init('kt_quick_user');
    }

    // Init Quick Search Panel
    if (typeof KTLayoutQuickSearch !== 'undefined') {
        KTLayoutQuickSearch.init('kt_quick_search');
    }

    // Init Quick Cart Panel
    if (typeof KTLayoutQuickCartPanel !== 'undefined') {
        KTLayoutQuickCartPanel.init('kt_quick_cart');
    }

    // Init Search For Quick Search Dropdown
    if (typeof KTLayoutSearch !== 'undefined') {
        KTLayoutSearch().init('kt_quick_search_dropdown');
    }

    // Init Search For Quick Search Offcanvas Panel
    if (typeof KTLayoutSearchOffcanvas !== 'undefined') {
        KTLayoutSearchOffcanvas().init('kt_quick_search_offcanvas');
    }
});
