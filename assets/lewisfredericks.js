$(document).ready(function() {
    if ($('#content').length) {
        clipHero();
        // clipLogo();
        highlightNav();
        // pushBrand();
        colorAbout();
    }
    Theme.AddToCart.updateCart();

    // SMOOTH SCROLL
    //$('a[href^=#]').click(function(){
    //    if ($.attr(this, 'href') === "#") {
    //        return true; // Allows the tabbed panes to work
    //   } else {
    //        var current = $(window).scrollTop();
    //        var target = $( $.attr(this, 'href') ).offset().top;
    //        var duration = Math.abs(target - current) / 1.5;
    //        $('html, body').animate({
    //            scrollTop: target
    //        }, duration);
    //        return false;
    //    }
    //});

    $('#modal-contact').on('show.bs.modal', function () {
        $('body').addClass('modal-backdrop-blue');
    });

    $('#modal-contact').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-backdrop-blue');
    });

    $('.btn-add-to-cart').click(function() {
        Theme.AddToCart.addToCart($(this));
    });

    $('.navbar-toggle').click(function() {
        $('#navigation').toggleClass("expanded");
    });

    $('#navigation a').click(function() {
        $('#navigation').removeClass("expanded");
    });
});

$(window).load(function() {
    $('#modal-success').modal('show');
    $('#modal-failure').modal('show');
});

function addToCart(button) {
    var productID = button.data("id");
    var wrapperID = button.closest('.product').attr("id");
    var modalID = button.closest('.modal-shop').attr("id");
    console.log(modalID);
    
    jQuery.ajax({
        url: '/cart/add.js',
        dataType: 'json',
        data: {
            quantity: 1,
            id: productID
        },
        method: "POST",
        success: function(data, textStatus, jqXHR) {
            updateCart();
            // Make the check out button visible
            $('#' + wrapperID + ' .btn-check-out').addClass("visible");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Close the modal if we're in one
            if(modalID) {
                $('#' + modalID).modal('hide');
            }
            var response = JSON.parse(jqXHR.responseText);
            var status = response.status;
            var label = response.message;
            var description = response.description;
            if (status == 422) {
                $('#modal-alert-status').text("Available stock allocated.");
            } else {
                $('#modal-alert-status').text("");
            }
            $('#modal-alert-label').text(label);
            $('#modal-alert-description').text(description);
            $('#modal-alert').modal('show');
        }
    });
}

function updateCart() {
    jQuery.ajax({
        url: '/cart.js',
        dataType: 'json',
        method: "GET",
        success: function(data, textStatus, jqXHR) {
            var itemsInCart = data.item_count;
            if (itemsInCart) {
                $('.items-in-cart').text("" + itemsInCart);
            } else {
                $('.items-in-cart').text("0");
            }
        }
    });
}

$(window).scroll(function() {
    if ($('#content').length) {
        clipHero();
        // clipLogo();
        highlightNav();
        // pushBrand();
        colorAbout();
    }
});

$(window).resize(function() {
    if ($('#content').length) {
        clipHero();
        // clipLogo();
        highlightNav();
        // pushBrand();
        colorAbout();
    }
});

function clipHero() {
    var heroImage = $('#hero-light .center-image');
    var top = heroImage.offset().top;
    var bottom = top + heroImage.height();
    var height = heroImage.height();
    var width = heroImage.width();

    var greySectionTop = $('#hero-dark').offset().top;

    if (greySectionTop < top) {
        heroImage.css("opacity", "0");
    } else if (greySectionTop < bottom) {
        var clipAmount = height - bottom + greySectionTop;
        var clipString = "rect(0px, " + width + "px, " + clipAmount + "px, 0px)"
        heroImage.css("opacity", "1");
        heroImage.css("clip", clipString);
    } else {
        var clipString = "rect(0px, " + width + "px, " + height + "px, 0px)"
        heroImage.css("opacity", "1");
        heroImage.css("clip", clipString);
    }
}

function clipLogo() {
    var logo = $('#logo-1');
    var top = logo.offset().top;
    var bottom = top + logo.height();
    var height = logo.height();
    var width = logo.width();

    var contentTop = $('#content').offset().top;

    if (contentTop < top) {
        logo.css("opacity", "0");
    } else if (contentTop < bottom) {
        var clipAmount = height - bottom + contentTop;
        var clipString = "rect(0px, " + width + "px, " + clipAmount + "px, 0px)"
        logo.css("opacity", "1");
        logo.css("clip", clipString);
    } else {
        var clipString = "rect(0px, " + width + "px, " + height + "px, 0px)"
        logo.css("opacity", "1");
        logo.css("clip", clipString);
    }
}

function highlightNav() {
    $('.anchor').removeClass("active");
    var top = $('#brand-top').offset().top;
    var list = $('.anchor');
    for (i = list.length - 1; i >= 0; i--) {
        var targetTop = $($(list[i]).attr("href")).offset().top;
        if (top > targetTop ) {
            if ($(list[i]).is(":visible")) {
                $(list[i]).addClass("active");
                return false;
            }
        }
    }

}

function colorAbout() {
    var top = $('#brand-top').offset().top;
    var aboutTop = $('#about').offset().top;
    var aboutBottom = $('#about').height() + aboutTop;
    if (top > aboutTop && top < aboutBottom) {
        $('#content').addClass("lilac");
    } else {
        $('#content').removeClass("lilac");
    }
}

function pushBrand() {
    var brand = $('#brand-wrapper');
    var brandTop = brand.offset().top;
    var brandBottom = brandTop + brand.height();
    var top = $('#brand-top').offset().top;
    var bottom = $('#brand-bottom').offset().top;

    var heroDark = $('#hero-dark .center-image');

    var pushBrand = $('#content').offset().top;

    var scroll = $(window).scrollTop();

    if (pushBrand < top) {
        brand.css("position", "fixed");
        brand.css("top", top - scroll + "px");
    } else if (pushBrand < bottom) {
        brand.css("position", "absolute");
        brand.css("top", "0px");
    } else {
        brand.css("position", "fixed");
        brand.css("top", bottom - scroll + "px");
    }
}