(function ($) {
    $(function () {
        var jcarousel = $('.jcarousel');

        jcarousel
            .on('jcarousel:reload jcarousel:create', function () {
                var carousel = $(this),
                    width = carousel.innerWidth();

                if (width >= 900) {
                    width = width / 4;
                } else if (width >= 640) {
                    width = width / 3;
                } else if (width >= 320) {
                    width = width / 2;
                }

                carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
            })

            .jcarousel({
                wrap: 'circular'

            }).jcarouselAutoscroll({
                interval: 6000,
                target: '+=1',
                autostart: false
            });



        $('.jcarousel-control-prev')
            .jcarouselControl({
                target: '-=1'
            });

        $('.jcarousel-control-next')
            .jcarouselControl({
                target: '+=1'
            });

        $('.jcarousel-pagination')
            .on('jcarouselpagination:active', 'a', function () {
                $(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function () {
                $(this).removeClass('active');
            })
            .on('click', function (e) {
                e.preventDefault();
            })
            .jcarouselPagination({
                perPage: 1,
                item: function (page) {
                    return '<a href="#' + page + '">' + page + '</a>';
                }
            });
    });
})(jQuery);

(function ($) {
    $(function () {
        var jcarousel = $('.jcarousel_2');

        jcarousel
            .on('jcarousel:reload jcarousel:create', function () {
                var carousel = $(this),
                    width = carousel.innerWidth();

                if (width >= 900) {
                    width = width / 6;
                } else if (width >= 640) {
                    width = width / 2;
                } else if (width >= 320) {
                    width = width / 2;
                }

                carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
            })

            .jcarousel({
                wrap: 'circular'

            }).jcarouselAutoscroll({
                interval: 6000,
                target: '+=1',
                autostart: false
            });



        $('.jcarousel_2-control-prev')
            .jcarouselControl({
                target: '-=1'
            });

        $('.jcarousel_2-control-next')
            .jcarouselControl({
                target: '+=1'
            });

        $('.jcarousel_2-pagination')
            .on('jcarouselpagination:active', 'a', function () {
                $(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function () {
                $(this).removeClass('active');
            })
            .on('click', function (e) {
                e.preventDefault();
            })
            .jcarouselPagination({
                perPage: 1,
                item: function (page) {
                    return '<a href="#' + page + '">' + page + '</a>';
                }
            });
    });
})(jQuery);