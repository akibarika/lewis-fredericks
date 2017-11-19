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
