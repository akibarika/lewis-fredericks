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
