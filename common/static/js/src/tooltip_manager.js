(function() {
    'use strict';
    var TooltipManager = function (element) {
        this.element = $(element);
        // If tooltip container already exist, use it.
        this.tooltip = $('div.' + this.className.split(/\s+/).join('.'));
        if (this.tooltip.length) {
            this.content = this.tooltip.find('> .tooltip-content');
            this.arrow = this.tooltip.find('> .tooltip-arrow');
        // Otherwise, create new one.
        } else {
            this.tooltip = $('<div />', {
                'class': this.className
            }).appendTo(this.element);
            this.content = $('<div class="tooltip-content" />').appendTo(this.tooltip);
            this.arrow = $('<div class="tooltip-arrow">▾</div>').appendTo(this.tooltip);
        }

        this.hide();
        _.bindAll(this, 'show', 'hide', 'showTooltip', 'hideTooltip', 'click');
        this.bindEvents();
    };

    TooltipManager.prototype = {
        // Space separated list of class names for the tooltip container.
        className: 'tooltip',
        SELECTOR: '[data-tooltip]',

        bindEvents: function () {
            this.element.on({
                'mouseenter.TooltipManager': this.prepareAndShowTooltip,
                'focus.TooltipManager': this.prepareAndShowTooltip,
                'mouseleave.TooltipManager': this.hideTooltip,
                'click.TooltipManager': this.click
            }, this.SELECTOR);

            // Ensure that the tooltip stays visible when the user mouses over it
            this.tooltip.on({
                'mouseenter.TooltipManager': this.showTooltip,
                'mouseleave.TooltipManager': this.hideTooltip
            });
        },

        show: function () {
            this.tooltip.show().css('opacity', 1);
        },

        hide: function () {
            this.tooltip.hide().css('opacity', 0);
        },

        getCoords: function(pageX, pageY) {
            var width = this.tooltip.outerWidth();
            return {
                'left': Math.min(Math.max(0, pageX - width / 2),
                                 this.element.outerWidth() - width),
                'top': pageY - 15
            };
        },

        update: function (content, pageX, pageY) {
            // Move the tooltip all the way to the left first so the width is
            // calculated correctly
            this.tooltip.css({left: 0});
            this.content.html(content);
            var coords = this.getCoords(pageX, pageY);
            this.tooltip.css(coords);
            // If the tooltip is offset to the right by the left edge of the
            // viewport, move the arrow so it stays over the element
            this.arrow.css({left: pageX - coords.left});
        },

        showTooltip: function() {
            if (this.tooltipTimer) {
                clearTimeout(this.tooltipTimer);
            }
            this.tooltipTimer = setTimeout(this.show, 500);
        },

        prepareTooltip: function(element) {
            var $element = $(element),
                pageX = $element.offset().left + $element.outerWidth() / 2,
                pageY = $element.offset().top,
                tooltipText = $element.attr('data-tooltip');
            this.update(tooltipText, pageX, pageY);
        },

        prepareAndShowTooltip: function(event) {
            this.prepareTooltip(event.currentTarget);
            this.showTooltip();
        },

        // To manually trigger a tooltip to reveal, other than through user mouse movement:
        openTooltip: function(element) {
            this.prepareTooltip(element);
            this.show();
            if (this.tooltipTimer) {
                clearTimeout(this.tooltipTimer);
            }
        },

        hideTooltip: function() {
            clearTimeout(this.tooltipTimer);
            this.tooltipTimer = setTimeout(this.hide, 500);
        },

        click: function(event) {
            var showOnClick = !!$(event.currentTarget).data('tooltip-show-on-click'); // Default is false
            if (this.tooltipTimer) {
                clearTimeout(this.tooltipTimer);
            }
            if (showOnClick) {
                this.show();
            } else {
                this.hide();
            }
        },

        destroy: function () {
            this.tooltip.remove();
            // Unbind all delegated event handlers in the ".TooltipManager"
            // namespace.
            this.element.off('.TooltipManager', this.SELECTOR);
            this.tooltip.off('.TooltipManager');
        }
    };

    window.TooltipManager = TooltipManager;
    $(document).ready(function () {
        window.globalTooltipManager = new TooltipManager(document.body);
    });
}());
