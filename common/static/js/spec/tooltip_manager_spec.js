describe('TooltipManager', function () {
    'use strict';
    var PAGE_X = 100, PAGE_Y = 100, WIDTH = 100, HEIGHT = 100, DELTA = 10,
        showTooltip;

    beforeEach(function () {
        setFixtures(sandbox({
          'id': 'test-id',
          'data-tooltip': 'some text here.'
        }));
        this.element = $('#test-id');

        this.tooltip = new TooltipManager(document.body);
        jasmine.Clock.useMock();
        // Set default dimensions to make testing easer.
        $('.tooltip').height(HEIGHT).width(WIDTH);

        // Re-write default jasmine-jquery to consider opacity.
        this.addMatchers({
            toBeVisible: function() {
              return this.actual.is(':visible') || parseFloat(this.actual.css('opacity'));
            },

            toBeHidden: function() {
              return this.actual.is(':hidden') || !parseFloat(this.actual.css('opacity'));
            },
        });
    });

    afterEach(function () {
        this.tooltip.destroy();
    });

    showTooltip = function (element) {
        element.trigger('mouseenter');
        jasmine.Clock.tick(500);
    };

    it('can destroy itself', function () {
        showTooltip(this.element);
        expect($('.tooltip')).toBeVisible();
        this.tooltip.destroy();
        expect($('.tooltip')).not.toExist();
        showTooltip(this.element);
        expect($('.tooltip')).not.toExist();
    });

    it('should be shown when mouse is over the element', function () {
        showTooltip(this.element);
        expect($('.tooltip')).toBeVisible();
        expect($('.tooltip-content').text()).toBe('some text here.');
    });

    it('should be hidden when mouse is out of the element', function () {
        showTooltip(this.element);
        expect($('.tooltip')).toBeVisible();
        this.element.trigger('mouseleave');
        jasmine.Clock.tick(500);
        expect($('.tooltip')).toBeHidden();
    });

    it('should stay visible when mouse is over the tooltip', function () {
        showTooltip(this.element);
        expect($('.tooltip')).toBeVisible();
        this.element.trigger('mouseleave');
        jasmine.Clock.tick(100);
        this.tooltip.tooltip.trigger('mouseenter');
        jasmine.Clock.tick(500);
        expect($('.tooltip')).toBeVisible();
        this.tooltip.tooltip.trigger('mouseleave');
        jasmine.Clock.tick(500);
        expect($('.tooltip')).toBeHidden();
    });

    it('should be shown when the element gets focus', function () {
        this.element.trigger('focus');
        jasmine.Clock.tick(500);
        expect($('.tooltip')).toBeVisible();
    });

    it('should be hidden when user clicks on the element', function () {
        showTooltip(this.element);
        expect($('.tooltip')).toBeVisible();
        this.element.trigger('click');
        expect($('.tooltip')).toBeHidden();
    });

    it('can be configured to show when user clicks on the element', function () {
        this.element.attr('data-tooltip-show-on-click', true);
        this.element.trigger('click');
        expect($('.tooltip')).toBeVisible();
    });

    it('can be be triggered manually', function () {
        this.tooltip.openTooltip(this.element);
        expect($('.tooltip')).toBeVisible();
    });
});
