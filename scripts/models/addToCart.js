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