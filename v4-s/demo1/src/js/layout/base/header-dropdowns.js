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
