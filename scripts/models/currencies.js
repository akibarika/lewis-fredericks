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