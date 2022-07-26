/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);
;
(function ($) {

	$(function() {
		$('#faset-filters').click(function() {
			$(this).next().toggle();
		});
	});

	//Disable double click on submit form
  $(document).on('submit', 'form', function(){
    if($(this).find('button[type=submit]').length > 0){
      buttonOverlay('button[type=submit]', this.id, $(this));
    }else if($(this).find('input[type=submit]').length > 0){
      buttonOverlay('input[type=submit]', this.id, $(this));
    }
  });

  function buttonOverlay(submitted, id, form){
    var $height = $(submitted).outerHeight();
    $("<div id='form-loader'></div>").insertAfter('form#' + id + ' ' + ' .form-actions ' + submitted).css('margin-top', '-' + $height + 'px').css('height', $height + 'px');
    form.find(submitted).css('opacity', '0.5').parent().css('position', 'relative');
  }


  $( document ).ready(function() {

    var $addToLinkedIn = $('a.add-to-linkedin');
    if($addToLinkedIn.length) {
      var ajax_settings = {
        url: '/ajax/get-certificate-id',
        submit: {
          uid: $addToLinkedIn.data('uid'),
          qid: $addToLinkedIn.data('qid'),
          rid: $addToLinkedIn.data('rid'),
        }
      };
      var ajax = new Drupal.ajax(false, false, ajax_settings);
      ajax.options.type = 'POST';
      ajax.options.complete = function() {
        $addToLinkedIn.attr('href', $addToLinkedIn.attr('href').replace('certId=00000000', 'certId='+$addToLinkedIn.data('certid')));
      };
      ajax.eventResponse(ajax, {});
    }

    $(document).ready(function(){
      if($("article[about='/documents/common/7-10/obzor-bpmonline']").length){
        $("article[about='/documents/common/7-10/obzor-bpmonline']").prev().hide();
      }
    });
    //new style dgl-4367
    jQuery("dl .def-term").each(function() {
      if(jQuery(this).text() == 'objects_collection (required)'){
        jQuery(this).replaceWith( "<dt class='def-term'>objects_collection  <span class='red-required'>required</span></dt>" );
      }
    });
    var arr = [
      '204 No Content', '3xx Redirection','404 Not Found', '405 Method Not Allowed', '406 Not Acceptable',
      '410 Gone', '412 Precondition Failed', '424 Failed Dependency', '501 Not Implemented', '304 Not Modified'
    ];

    jQuery("a").each(function() {
      if(jQuery(this).text() == '200 OK' || jQuery(this).text() == '201 Created' || jQuery(this).text() == '202 Accepted'){
        jQuery(this).addClass('green-link');
        jQuery(this).after('<span class="doc-menu-ico-link"></span>');
        jQuery('.hs-expanded').css('display', 'block').css('margin-left','0px');
      }

      if(jQuery.inArray(jQuery(this).text(),  arr) != -1){
        jQuery(this).addClass('red-link');
        jQuery(this).after('<span class="doc-menu-ico-link"></span>');
        jQuery('.hs-expanded').css('display', 'block');
      }
    });


    $('.doc-menu-ico-link').on('click', function(e) {
      var target = $( e.target );
      if (target.is( ".doc-menu-ico-link" )) {
        target.parent().find('.doc-menu-ico-link').toggleClass('active');
        if(target.parent().find('.doc-menu-ico-link').hasClass('active')) {
          target.parent().find('.hs-collapsed').removeClass('hs-collapsed').addClass('hs-expanded');
          jQuery('.hs-expanded').css('margin-left', '0px');
        } else {
          target.parent().find('.hs-expanded').removeClass('hs-expanded').addClass('hs-collapsed');
        }
      }
    });

  	$(document).ajaxComplete(function() {
			$('.calendar-title form').each(function() {
				var $form = $(this);
				$form.find('.form-radios .Sydney').first().addClass('first');
				$form.find('.form-radios .London').first().addClass('first');
				$form.find('.form-radios .Boston').first().addClass('first');
			});
		});

		$('.product-version select').select2().on('select2:open', function() {
			$('body > .select2-container').width($(this).next().width() + 1);
		});
		$('.product-version .select2-selection__rendered').removeAttr('title');

    $('.navbar-toggle').on('click', function() {
      if ($('header#navbar').hasClass('active')) {
        $('header#navbar').removeClass('active');
      } else {
        $('header#navbar').addClass('active');
      }
    });

  	$('header#navbar').on('click', '.tb-megamenu-item.dropdown', function() {
      if ($('header#navbar').hasClass('active') ) {
        menuToggle(this);
      }
    });
    $('header#navbar').on('click', '.tb-megamenu-item.mega-group', function() {
      if ($('header#navbar').hasClass('active') ) {
        menuToggle(this);
      }
    });
    $('.arrow-back').on('click', function() {
      var back = $(this).attr("data-back");
      if(back == 'all') {
        $('nav').removeClass('parent-container');
        $('#custom-sub-menu').hide();
        $('.arrow-back').hide();
        $('.menu-title').hide();
        $('.navbar-toggle').show();
        $('.mobile-logo').addClass('active');
      } else {
        $('#navbar-collapse nav .tb-megamenu').find("li[data-id='" + back + "']").click().click();
      }
    });

	$(".block-facetapi .block-title").click(function (e) {
		e.preventDefault();
		var link = jQuery(this).parent();
        var closest_ul = link.closest(".accordion__element");
        var parallel_active_links = closest_ul.find(".active");
        var closest_li = link.find(".facetapi-facetapi-checkbox-links");
        var link_status = closest_li.hasClass("in-active");
        var count = 0;

		if (!link_status) {
			closest_li.addClass("in-active");
			closest_li.slideUp('slow',function () {
				}
			);
			closest_li.parent().find(".block-title").addClass('closed')
		} else {
			closest_li.removeClass("in-active");
			closest_li.slideDown('slow',function () {
			});
			closest_li.parent().find(".block-title").removeClass('closed')
		}
	});
	$('.page-search input[type="text"]').attr('autocomplete','off');
	if($(window).width() < 768){
		$(".page-search .block-facetapi .block-title").click();
	}
    var link, hrefs, href, attribute;
      $(".zone_ru .show-u").remove();
      $(".zone_ua .show-r").remove();

	setTimeout(
		function(){
			var location = document.location.href, compare_1, compare_2;
			location = location.split("#");
            compare_1 = location[0].split("&");
            $("#documentation-content .field-name-body p").each(
                function(){
                    hrefs = $(this).find("a");
                    for(var i=0; i<hrefs.length;i++) {
                        href = hrefs[i];
                        if (href.getAttribute("href") !== undefined && href.getAttribute("href") !== null){
                            attribute=href.getAttribute("href");
                            if(href.getAttribute("href").indexOf("#") > 0) {
                                link = href.getAttribute("href");
                                if (link != undefined) {
                                    link = link.split("#");
                                    compare_2 = link[0].split("&");
                                    if(compare_1[0] === compare_2[0]){
                                        href.setAttribute("href", "#" + link[1]);
									}
                                }
                            }
                        }
                    }
                }
            );
		},500
	)
  });

  function menuToggle($this) {
    if ($($this).hasClass('active')) {
        $($this).removeClass('active');

    } else {
      //$($this).addClass('active');

      if ($($this).data('level') == 1) {
        $('nav').addClass('parent-container');
        $('.arrow-back').attr("data-back",  'all');
      } else {
        //$($this).addClass('parent-container');
        $('.arrow-back').attr("data-back",  $($this).data('id'));
      }
        $('.menu-title').text($($this).find('> a').text());
        $('.menu-title').show();


      $('#custom-sub-menu').html('');
      var level = 'li.level-' + (1+ +$($this).data('level'));
      var content = $($this).find(level);
      $('#custom-sub-menu').html(content.clone()).show();
      $('.arrow-back').show();
      $('.navbar-toggle').hide();
      $('.mobile-logo').removeClass('active');
    }
  }

  function calcPageHeight(){
    var initial_height = window.innerHeight;
    var window_position = $(window).scrollTop();
    var pure_height = initial_height - 190;
    if(window_position < 120){
      $("#documentation-menu-body").height(pure_height);
    }else{
      pure_height = initial_height - 70;
      $("#documentation-menu-body").height(pure_height);
    }
    var footer = document.getElementById("block-block-2").getBoundingClientRect();
    var footer_position = footer.top - 100;
    if(footer_position < initial_height){
      var pure_height = pure_height - initial_height + footer_position + 100;
      $("#documentation-menu-body").height(pure_height);
    }
  }

/**********************************************************
****
     Scripts from old theme
****
***********************************************************/

var currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;

  $(document).ready(function() {
		$(window).on('scroll', function() {
			var st = $(window).scrollTop();
			var dif = 0;
			if(st < 170) {
				dif = 260 - st;
			}
			if(st > $('.footer').offset().top - $(window).height() - 40) {
				dif = st - $('.footer').offset().top + $(window).height() + 105;
			}
			$('#documentation-menu-body').css('max-height', $(window).height() - dif);
		});

		$(window).on('resize', function() {
			if($('#documentation-menu-body').length) {
				$(window).trigger('scroll');
			};
      if($('body').hasClass('page-requirements') && !$('#ts-req-calculator-form').length) {
        calcPageHeight();
        $('#documentation-menu-body').perfectScrollbar('update');
      }
		});

		$('#sdk-documentation .FM_Picture').each(function() {
			var $this = $(this);
			if(!$this.text()) {
				$this.addClass('fill');
			}
		});

		var $slider = $('.FM_Slider');
		if($slider.length) {
			var $autoplay = true;
			if(typeof $slider.data('autoplay') !== 'undefined' && $slider.data('autoplay') === 0) {
				$autoplay = false;
			}
			$slider.slick({
				autoplay: $autoplay,
				autoplaySpeed: 5000,
				arrows: false,
				dots: true
			});
		}

  	var fmCode = $('.FM_Code');
  	if(fmCode.length) {
			fmCode.wrap('<pre class="prettyprint lang-sql"></pre>');
			prettyPrint();
		}

    $('#documentation-node-tpl .node .SimpleTabContainer').each(function() {
      var $this = $(this);
      var $elem = $this;
      var flag = true;
      $this.nextAll().each(function() {
        if($(this).hasClass('SimpleTabContainer')) {
          if(flag) {
            $elem = $elem.add($(this));
          }
        } else {
          flag = false;
        }
      });
      if(!$elem.closest('.SimpleTabs').length) {
        $elem.wrapAll('<div class="SimpleTabs"></div>');
      }
    });
    $('#documentation-node-tpl .node .SimpleTabs').each(function() {
      var $this = $(this);
      var $tabsMenu = '<div class="SimpleTabsMenu">';
      $this.find('.SimpleTabContainer').first().addClass('active');
      $this.find('.SimpleTabContainer').each(function (i) {
        var $tab = $(this);
        var cl = '';
        if(!i) {
          cl = ' active';
        }
        var tabTitle = $tab.find('.SimpleTabStripContainer').text().trim();
        var $tabsMenuItem = '<div class="SimpleTabsMenuItem'+cl+'" data-index="'+i+'">'+tabTitle+'</div>';
        $tab.find('.SimpleTabStripContainer').remove();
        $tab.before($tabsMenuItem);
        $tabsMenu += $tabsMenuItem;
      });
      $tabsMenu += '</div>';
      $this.prepend($tabsMenu);
    });
    $(document).on('click', '.SimpleTabsMenuItem', function() {
      var $this = $(this);
      var $tabs = $this.closest('.SimpleTabs');
      if($this.hasClass('active')) {
        if(!$this.closest('.SimpleTabsMenu').length) {
          $this.add($tabs.find('.SimpleTabContainer').eq($this.data('index'))).removeClass('active');
        }
      } else {
        $tabs.find('.SimpleTabsMenuItem, .SimpleTabContainer').removeClass('active');
        $this.add($tabs.find('.SimpleTabContainer').eq($this.data('index'))).addClass('active');
      }
    });

    $('#documentation-node-tpl .node dt.def-term').each(function() {
      var $this = $(this);
      $this.html($this.html().replace(/\((.*)\)/g, '<span>$1</span>'));
      if($this.find('span').text().toLowerCase() === 'required') {
        $this.find('span').addClass('red');
      }
    });
    $('#documentation-node-tpl .node dd').each(function() {
      var $this = $(this);
      var $dl = $this.closest('dl');
      if($this.find('pre').length) {
        $this.addClass('offset');
        if($this.prev().length && $this.prev()[0].tagName === 'DD') {
          $this.addClass('offset-top');
        }
      }
      if($dl.next().length && $dl.next()[0].tagName === 'DL' && $dl.next().find('pre').length) {
        $dl.addClass('no-bg');
      }
    });

    $('#documentation-node-tpl .node .hs-collapsed').each(function() {
      var $elem = $(this).parent();
      $elem.html($elem.html().replace(/ &nbsp;/, ''));
      var $this = $elem.find('.hs-collapsed');
      $this.nextAll().remove();
      $this.html($this.html().replace(/&nbsp; /, ''));
      $elem.addClass('status-collapse');
      $this.wrap('<div class="collapse-content"></div>');
      var $link = $elem.find('> a');
      var status_code = $link.text().match(/\d+/);
      if(status_code == 200 || status_code == 201 || status_code == 202) {
        $link.addClass('success');
      }
    });
    $(document).on('click', '.status-collapse > a', function() {
      var $this = $(this);
      $this.toggleClass('collapsed');
      var $elem = $this.closest('.status-collapse');
      $elem.find('.collapse-content').slideToggle();
      return false;
    });

		$('.FM_Subheadingcollapse').each(function() {
			var $this = $(this);
			$this.addClass('FM_Subheading collapse');
			var flag = true;
			var $elems = null;
			$this.nextAll().each(function() {
				var $elem = $(this);
				if($elem.hasClass('FM_Subheading')) {
					flag = false;
				}
				if(!$elem.hasClass('FM_Subheadingcollapse') && !$elem.hasClass('content-container') && !$elem.hasClass('FM_Seealsoheading') && !$elem.hasClass('FM_Seealsotext') && flag) {
					if($elems === null) {
						$elems = $elem;
					} else {
						$elems = $elems.add($elem);
					}
				} else {
					if($elems !== null) {
						$elems.wrapAll('<div class="content-container"></div>');
						$elems = null;
					}
				}
			});
			$this.after('<div class="separator"></div>');
		});

		$('.FM_Heading3').each(function() {
			var $this = $(this);
			if($this.find('img').length) {
				$this.addClass('with-image');
			}
		});

		$('.FM_Seealsoheading').each(function() {
			var $this = $(this);
			if($this.text() === 'Contents' || $this.text() === 'Содержание') {
				$this.addClass('contents');
			}

			if($this.text() === 'Video tutorials' || $this.text() === 'Обучающее видео') {
				$this.addClass('video');
			}

			if($this.text() === 'See also' || $this.text() === 'Смотрите также') {
				$this.addClass('see-also');
			}
		});

  	$('.FM_Seealsotext, .FM_Seealsotext2').each(function() {
			var $this = $(this);
			$this.find('a').append('<span class="arr"></span>');
			if(!$this.prev().hasClass('FM_Seealsoheading') && !$this.prev().hasClass('FM_Seealsotext') && !$this.prev().hasClass('FM_Seealsotext2')) {
				$this.addClass('first');
			}
			if(!$this.next().hasClass('FM_Seealsotext') && !$this.next().hasClass('FM_Seealsotext2')) {
				$this.addClass('last');
			}
			if($this.prev().hasClass('video')) {
				$this.addClass('video');
			}
			if($this.prev().hasClass('contents')) {
				$this.addClass('contents');
			}
		});

  	$('.FM_Normal').each(function() {
			var $this = $(this);
			$this.html($this.html().replace(/(\[.*?[^\d\"]\])/g, '<span class="bold">$1</span>'));
		});

  	$('.FM_Noteheading').each(function() {
			var $this = $(this);
			var $elem = $this;
			var $flag1 = 1;
			var $flag2 = 1;
			var $flag3 = 1;
			var $count1 = 0;
			var $count2 = 0;
			var $class = 'note';
			$this.nextAll('p').each(function() {
				if($(this).hasClass('FM_Notetext')) {
					if($flag1) {
						$elem = $elem.add($(this));
						$count1++;
					}
				} else {
					if($(this).hasClass('FM_Normalindent')) {
						if($flag2 && !$count1) {
							$class = 'note example';
							$elem = $elem.add($(this));
							$count2++;
						}
					} else {
						$flag2 = 0;
					}
					$flag1 = 0;
				}
			});
			if(!$count1 && !$count2) {
				$this.nextAll().each(function() {
					if($(this).hasClass('prettyprint')) {
						if($flag3) {
							$class = 'note example';
							$elem = $elem.add($(this));
						}
					} else {
						$flag3 = 0;
					}
				});
			}
			$elem.wrapAll('<div class="'+$class+'"></div>');
		});

  	$('.FM_Warningheading').each(function() {
			var $this = $(this);
			var $elem = $this;
			var $flag = 1;
			$this.nextAll('p').each(function() {
				if($(this).hasClass('FM_Notetext')) {
					if($flag) {
						$elem = $elem.add($(this));
					}
				} else {
					$flag = 0;
				}
			});
			$elem.wrapAll('<div class="note warning"></div>');
		});

		$('#sdk-documentation .note').each(function() {
			var $this= $(this);
			if(!$this.find('.FM_Notetext').text()) {
				var $class = $this.attr('class');
				$this.find('p').unwrap('<div>').parent().addClass($class);
			}
		});

  	$('.FM_Listnumberedinexample').each(function() {
			var $this = $(this);
			if($this.text().length) {
				var html = $this.html().replace(/(\d+\.)/, '<span class="num">$1</span>');
				$(this).html(html);
			}
		});

		$('#sdk-documentation .FM_Seealsoheading').each(function() {
			var $this = $(this);
			$this.next('ul').find('a').append('<span class="arr"></span>');
		});


		$('#sdk-documentation h4').each(function() {
			var $this = $(this);
			if($this.text() === 'Пример' || $this.text() === 'Example') {
				var $elem = $this;
				var $flag = true;
				$this.nextAll().each(function() {
					if($flag) {
						$elem = $elem.add($(this));
						if(typeof $(this).attr('id') !== 'undefined' && $(this).attr('id').indexOf('Syntax_') > -1) {
							$flag = false;
						}
					}
				});
				if(!$flag) {
					$elem.wrapAll('<div class="note example">');
				}
			}
		});

		$('#sdk-documentation p:not(.FM_Picture)').each(function() {
			var $this = $(this);
			if($this.text().length) {
				var html = $this.html().replace(/^(\d+\.\s)/, '<span class="num">$1</span>');
				$this.html(html);
				if($this.find('.num').length) {
					$this.addClass('FM_Listnumberedinexample');
				}
			}
		});

  	$(document).on('click', '#documentation-node-tpl #documentation-menu .menu-icon', function() {
  		var docMenu = $(this).closest('#documentation-menu');
  		docMenu.toggleClass('show');
		});

    if($("#documentation-menu").length > 0) {


      if(!jQuery('body').hasClass('node-type-bpmonline-release-notes') && !$('#ts-req-calculator-form').length) {
        $("#documentation-menu").sticky();
      }
      if(!$('body').hasClass('page-requirements')){
        ajaxGetMenu();
        heightStructure();
      }else{
        calcPageHeight();
      }
      if(!$('#ts-req-calculator-form').length) {
        $('#documentation-menu-body').perfectScrollbar();
        $('#documentation-menu-body')[0].addEventListener('ps-scroll-y', function () {
          $('.doc-menu-title').removeClass('hover').removeClass('full-width');
        });
      }
   }

      if ($(document).find('.linkedin-form').length > 0) {
        $(".default_popup").popup({
          show        : function($popup, $back){
            var plugin = this,
              center = plugin.getCenter();

            $popup
              .css({
                top     : - $popup.children().outerHeight(),
                left    : center.left,
                opacity : 1
              })
              .animate({top : center.top}, 500, 'easeOutBack', function(){
                // Call the open callback
                plugin.o.afterOpen.call(plugin);
              });
          }
        });

        $('form.linkedin-certification-form').submit(function(event) {
         event.preventDefault();
        });

        var clipboard = new Clipboard(".btn");
        clipboard.on("success", function(e) {
          console.log(e);
        });
        clipboard.on("error", function(e) {
          console.log(e);
        });
      }


      if($('body').hasClass('en')) {
        var open = 'Collapse all';
        var close = 'Expand all';
      } else {
        var open = 'Скрыть все';
        var close = 'Раскрыть все';
      }

      $('.expand-all').click(function() {
        if($(this).hasClass('active')) {
          $(this).text(close);
          $(this).removeClass('active');
          $('#documentation-content .collapse').removeClass('active');
          $('#documentation-content .content-container').slideUp();
        } else {
          $(this).addClass('active');
          $(this).text(open);
          $('#documentation-content .collapse').addClass('active');
          $('#documentation-content .content-container').slideDown();
        }
      });

      $('#documentation-content .collapse').click(function() {
        var content = $(this).next('.content-container');
        var content2 = $(this).next().next('.content-container');
        if(content.hasClass('content-container')) {
          $(this).toggleClass('active');
          content.slideToggle();
        } else if(content2.hasClass('content-container')) {
          $(this).toggleClass('active');
          content2.slideToggle();
        }
        if($slider.length) {
        	$slider.slick('refresh');
				}
      });

        $('.device-time').on('click', function() {
          if ($('.device-time').hasClass('active')) {
            $.each($('.views-field-field-training-data-1 .time'), function(index, item) {
              var timeZone = $(item).attr('data-utc');
              if (timeZone != '') {
                var originTime = $(item).attr('data-origin-time');
                if (originTime != '') {
                  $(item).html(originTime);
                }

                var $row = $(item).parents('.views-row');
                var $day = $($row).find('.views-field-field-training-data .day');
                var $month = $($row).find('.views-field-field-training-data .month');

                $($day).text($($day).attr('data-day'));
                $($month).text($($month).attr('data-month'));
              }
            });

            $('.device-time').removeClass('active')
          } else {
            $.each($('.views-field-field-training-data-1 .time'), function(index, item) {
              var timeZone = $(item).attr('data-utc');
              if (timeZone != '') {
                var $row = $(item).parents('.views-row');
                var $day = $($row).find('.views-field-field-training-data .day');
                var $month = $($row).find('.views-field-field-training-data .month');

                var startTime = $(item).attr('data-start-t');
                var endTime = $(item).attr('data-end-t');
                var d_start = new Date(startTime);
                var d_end = new Date(endTime);


                d_start.setHours(d_start.getHours() - currentTimeZoneOffsetInHours - timeZone);
                d_end.setHours(d_end.getHours() - currentTimeZoneOffsetInHours - timeZone);

                $($day).text(getTrainingDay(d_start.toLocaleString('de-DE', {day:'2-digit'}), d_end.toLocaleString('de-DE', {day:'2-digit'})));
                $($month).text(getTrainingMonth(d_start.toLocaleString('en-US', {month:'long'}), d_end.toLocaleString('en-US', {month:'long'})));

                var options = {
                  hour: 'numeric',
                  minute: '2-digit'
                };

                var newStartTime = startTime.substring(0, 2) - currentTimeZoneOffsetInHours - timeZone;
                var newEndTime = endTime.substring(0, 2) - currentTimeZoneOffsetInHours - timeZone;

                $(item).html('Time: ' + d_start.toLocaleString('de-DE', options) + ' - ' + d_end.toLocaleString('de-DE', options) + ' (your current timezone<span style="color:#f00;">*</span>)');

              }
            });
            $('.device-time').addClass('active');
          }
        }) ;


    });


    function getTrainingDay($start, $end) {
      return ($start == $end) ? $start : $start +'-'+ $end;
    }
    function getTrainingMonth($start, $end) {
      return ($start == $end) ? $start : $start +'/'+ $end;
    }

    window.onscroll = function() {
      if($('body').hasClass('node-type-documentation') || $('body').hasClass('node-type-bpmn') || $('body').hasClass('node-type-sdk')) {
        heightStructure();
        $('#documentation-menu-body').perfectScrollbar('update');
      }
      if($('body').hasClass('page-requirements') && !$('#ts-req-calculator-form').length) {
        calcPageHeight();
        $('#documentation-menu-body').perfectScrollbar('update');
      }
    }

  function heightStructure() {
    if(!$('body').hasClass('page-requirements')) {
      var scrolled = window.pageYOffset || document.documentElement.scrollTop;
      var scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );

      var correction = 200;
      if ($('body').hasClass('page-requirements')) {
        correction = 400;
      }
      var adminMenu = $('body').hasClass('admin-menu') ? 0 : 50;
      var footerHeight = $('#footer').parent().innerHeight();
      if (footerHeight == null) {
        footerHeight = $('.footer.container').innerHeight();
      }
      // console.log(footerHeight,$('.footer.container').innerHeight());
      var j_window = $(window);
      if (((scrollHeight - j_window.height()) - (footerHeight)) <= scrolled) {

        $('#documentation-menu-body').height(j_window.height() - ((footerHeight + 90) - ((scrollHeight - j_window.height()) - scrolled)));
      } else if ((scrollHeight - j_window.height()) - ((scrollHeight - j_window.height()) - scrolled) <= 300) {
        var position = $('#documentation-menu').position();
        var menuHeight = j_window.height() - (position.top + correction - (scrolled) - adminMenu);
        if ($('#documentation-menu-body').height() > menuHeight) {
          $('#documentation-menu-body').height(menuHeight);
        }

      } else {
        $('#documentation-menu-body').height(j_window.height() - 110);
      }
    }
  }


  function ajaxGetMenu() {
    var baseUrl = !Drupal.settings.basePath?document.location.origin+'/':Drupal.settings.basePath;
    $('#documentation-menu-body').on('click', '.doc-menu-title', function(e) {
    	if($(e.target).hasClass('doc-menu-ico')) {
    		return false;
    	}
		});
    $('#documentation-menu-body').on('click', '.doc-menu-ico', function() {
      var $this = $( this ).closest('.doc-menu-item')
      if($this.find('.doc-menu-item-children').length != 0) {
        menuAction($this);
        return;
      } else {
        menuAction($this);
      }

      $this.addClass('load');

      var $tid = $this.data( "tid" );
      var $document_key = '';
      if(window.product_key) {
        $document_key = "&document=" + window.product_key;
      }
      $.ajax({
        type: "POST",
        url: baseUrl + 'ajax/docs/load',
        data: "tid="+$tid+$document_key,
        success: function (msg) {
          $this.removeClass('load');
          $this.append('<div class="doc-menu-item-children">' + msg + '</div>');

          $('#documentation-menu-body').perfectScrollbar('update');
          $this.find('> .doc-link-item .doc-menu-title').trigger('mouseenter');
        }
      });
    });
  }

  function menuAction($item) {
    var $parent = $item.parent();
    $parent = $parent.children();

    if ($item.hasClass('open')) {
      $item.removeClass('open');
    } else {
      /*for (var i = $parent.length - 1; i >= 0; i--) {
        $($parent[i]).removeClass('open');
      }*/
      $item.addClass('open');
    }
    $('#documentation-menu-body').perfectScrollbar('update');
  }

  Drupal.behaviors.bpmonline = {
    attach: function (context, settings) {
      $('.show-more-tags').once().click(function(e) {
        $(this).parent().addClass('open');
      });

      $('.widget-title').once().on('click', function(e){
        $($(this)[0].nextElementSibling).slideToggle();
        if ($(this).hasClass('close-filter')) {
          $(this).removeClass('close-filter');
        } else {
          $(this).addClass('close-filter');
        }
      });

      if ($('.device-time').hasClass('active')) {
        $.each($('.views-field-field-training-data-1 .time'), function(index, item) {
          var timeZone = $(item).attr('data-utc');
          if (timeZone != '') {
            var $row = $(item).parents('.views-row');
            var $day = $($row).find('.views-field-field-training-data .day');
            var $month = $($row).find('.views-field-field-training-data .month');

            var startTime = $(item).attr('data-start-t');
            var endTime = $(item).attr('data-end-t');
            var d_start = new Date(startTime);
            var d_end = new Date(endTime);


            d_start.setHours(d_start.getHours() - currentTimeZoneOffsetInHours - timeZone);
            d_end.setHours(d_end.getHours() - currentTimeZoneOffsetInHours - timeZone);

            $($day).text(getTrainingDay(d_start.toLocaleString('de-DE', {day:'2-digit'}), d_end.toLocaleString('de-DE', {day:'2-digit'})));
            $($month).text(getTrainingMonth(d_start.toLocaleString('en-US', {month:'long'}), d_end.toLocaleString('en-US', {month:'long'})));

            var options = {
              hour: 'numeric',
              minute: '2-digit'
            };

            var newStartTime = startTime.substring(0, 2) - currentTimeZoneOffsetInHours - timeZone;
            var newEndTime = endTime.substring(0, 2) - currentTimeZoneOffsetInHours - timeZone;

            $(item).html('Time: ' + d_start.toLocaleString('de-DE', options) + ' - ' + d_end.toLocaleString('de-DE', options) + ' (your current timezone<span style="color:#f00;">*</span>)');
          }
        });
      }

    },
  };
})(jQuery);

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]).replace(/\+/g, ' ');
        }
    }
};

function wrapToLink(el, substr, newSubstr){
  var text = el.html();
  text = text.replace(substr, newSubstr);
  el.html(text);
  el.attr('data-before',' ');
  el.attr('data-after',' ');
}

jQuery(document).ready(function() {
  jQuery(document).on('click', '[data-class="collapse-title"]', function() {
    var $this = jQuery(this);
    var $content = $this.next('[data-class="collapse-content"]');
    $this.toggleClass('closed');
    $content.slideToggle(300);
  });

  if(jQuery('body').hasClass('page-webinars')) {
    jQuery('#views-exposed-form-video-archive-page select').select2({
      minimumResultsForSearch: Infinity,
      dropdownAutoWidth : true
    });
    if (getUrlParameter('tag') != undefined && getUrlParameter('tag') != '') {
      jQuery('#block-views-exp-video-archive-page .views-widget-filter-term_node_tid_depth').after(
        '<div class="webinar-tag-filter views-widget-filter-term_node_tid_depth"><label>'
        +Drupal.t("Tag")+':</label><div class="views-widget tag-name">'+getUrlParameter('tag')+
        '</div><i class="fa fa-times close-tags" aria-hidden="true"></i></div>');
      jQuery('.webinar-tag-filter .close-tags').click(function(e) {
        window.location.href = "/webinars";
      });
    }
  }

  if(jQuery('body').hasClass('page-video-courses')) {
    jQuery('#views-exposed-form-video-courses-page select').select2({
      minimumResultsForSearch: Infinity,
      dropdownAutoWidth : true
    });
    if (getUrlParameter('tag') != undefined && getUrlParameter('tag') != '') {
      if (jQuery('#block-views-exp-video-courses-page').find('.views-widget-filter-term_node_tid_depth').length > 0 ) {
        var elem = '.views-widget-filter-term_node_tid_depth';
      } else {
        var elem = '.views-widget-filter-field_video_course_product_tid';
      }
      jQuery('#block-views-exp-video-courses-page '+elem).after(
        '<div class="webinar-tag-filter views-widget-filter-field_video_course_product_tid"><label>'
        +Drupal.t("Tag")+':</label><div class="views-widget tag-name">'+getUrlParameter('tag')+
        '</div><i class="fa fa-times close-tags" aria-hidden="true"></i></div>');
      jQuery('.webinar-tag-filter .close-tags').click(function(e) {
        window.location.href = "/video-courses";
      });
    }
  }

  jQuery('.LanguageSpecific').css({'background-color': '#fcffff', 'border': '2px solid #b1d5e6', 'margin-bottom': '20px'});
  jQuery('#doc-frame').find('.FM_Listmarked2').css('margin-bottom','10px');

  // main page banner
  var container = jQuery('#academy-banner-container');
  var banners = jQuery('.academy-banner-item');
  var controls = jQuery('.bullet-banner-button');

  var rotation = setInterval(rotate, 6000);

  controls.click(function() {
    clearInterval(rotation);
    var id = jQuery(this).attr('id');
    banners.hide().filter('.' + id).show();
    controls.removeClass('active');
    jQuery(this).addClass('active');
    controls.find('img').attr('src', '/sites/all/themes/om_academy/img/banner/bullet_normal.png');
    jQuery(this).find('img').attr('src', '/sites/all/themes/om_academy/img/banner/bullet_active.png');
  });

  function rotate() {
    var active = controls.filter('.active').toggleClass('active');
    var next = active.next();

    if(next.length === 0)
      next = controls.eq(0).toggleClass('active');
    else
      next.toggleClass('active');

    var bulletId = next.attr('id');

    banners.hide().filter('.' + bulletId).show();
    controls.find('img').attr('src', '/sites/all/themes/om_academy/img/banner/bullet_normal.png');
    next.find('img').attr('src', '/sites/all/themes/om_academy/img/banner/bullet_active.png');
  }

  // Search
	if(jQuery('#search-api-page-search-form-solr-search-page--2').length > 0) {
        var search_block = jQuery('#search-api-page-search-form-solr-search-page--2');
        var close_button = jQuery('#search-api-page-search-form-solr-search-page--2 #search-close');
    }else if(jQuery('#search-api-page-search-form-solr-search-page-3--2').length > 0){
        var search_block = jQuery('#search-api-page-search-form-solr-search-page-3--2');
        var close_button = jQuery('#search-api-page-search-form-solr-search-page-3--2 #search-close');
	}else{
        var search_block = jQuery('#search-api-page-search-form-solr-search-page-3');
        var close_button = jQuery('#search-api-page-search-form-solr-search-page-3 #search-close');
	}
  if(close_button.length == 0) {
    jQuery('#search-api-page-search-form-solr-search-page--2 button[type="submit"]').after('<div id="search-close"></div>');
    jQuery('#search-api-page-search-form-solr-search-page-3--2 button[type="submit"]').after('<div id="search-close"></div>');
    jQuery('#search-api-page-search-form-solr-search-page-3 button[type="submit"]').after('<div id="search-close"></div>');
    jQuery(document).on( 'click', '#search-close', function(){
      search_block.removeClass('active');
    });
  }
  search_block.click(function() {
    var item = jQuery(this);
    if(!item.hasClass('active')) {
      jQuery(this).addClass('active');
      jQuery('#search-api-page-search-form-solr-search-page--2 .form-text').focus();
      jQuery('#search-api-page-search-form-solr-search-page-3--2 .form-text').focus();
      jQuery('#search-api-page-search-form-solr-search-page-3 .form-text').focus();
      return false;
    }
  });

  //Add bulet Margin to Documentation
  if(document.getElementById('doc-frame')) {
    jQuery(document.getElementById('doc-frame').contentWindow.document).ready(function() {
      var bullet = document.querySelector(".FM_Listmarked2");
      jQuery('#doc-frame').contents().find('.FM_Listmarked2').css('margin-bottom','10px');
    });
  }


  jQuery('#close-button').click(function() {
    jQuery(this).hide();
    jQuery('#documentation-menu-body').hide();
    jQuery('#content-button').hide();
    jQuery('#content-panel .caption.open').hide();

    jQuery('#content-button-hidden').show();
    jQuery('#documentation-menu').width(34);
    jQuery('#documentation-menu .documentation-banner').hide();
    jQuery('#documentation-content').css({'width': 'Calc(100% - '+ 64 +'px)', 'margin-left': '0px' });
    jQuery('#sdk-documentation').css({'width': 'Calc(100% - '+ 64 +'px)', 'margin-left': '0px' });
    jQuery('#documentation-menu').addClass('close');
    jQuery('#documentation-menu').removeClass('open');
  });
  jQuery('#content-button').click(function() {
    jQuery('#close-button').hide();
    jQuery('#documentation-menu-body').hide();
    jQuery('#content-button').hide();
    jQuery('#content-panel .caption.open').hide();

    jQuery('#documentation-menu .documentation-banner').hide();
    jQuery('#content-button-hidden').show();
    jQuery('#documentation-menu').width(34);
    jQuery('#documentation-content').css({'width': 'Calc(100% - '+ 64 +'px)', 'margin-left': '0px' });
    jQuery('#sdk-documentation').css({'width': 'Calc(100% - '+ 64 +'px)', 'margin-left': '0px' });
    jQuery('#documentation-menu').addClass('close');
    jQuery('#documentation-menu').removeClass('open');
  });

  jQuery('#content-button-hidden').click(function() {
    jQuery(this).show();
    jQuery('#documentation-menu-body').show();
    jQuery('#close-button').show();
    jQuery('#content-button').show();
    jQuery('#content-panel .caption.open').show();

    jQuery('#documentation-menu .documentation-banner').show();
    jQuery('#content-button-hidden').hide();
    jQuery('#documentation-menu').width(317);
    jQuery('#documentation-content').css({'width': 'Calc(100% - '+ 378 +'px)', 'margin-left': '60px' });
    jQuery('#sdk-documentation').css({'width': 'Calc(100% - '+ 378 +'px)', 'margin-left': '60px' });
    jQuery('#documentation-menu').addClass('open');
    jQuery('#documentation-menu').removeClass('close');
  });

  jQuery('#block-masquerade-masquerade .block-title').click(function () {
    jQuery('#block-masquerade-masquerade form').toggle();
  });
});

jQuery(document).ready(function() {
  jQuery('.FM_Picture img').each(function () {
    var currentImage = jQuery(this);
    currentImage.wrap('<a href="'+currentImage.attr('src')+'"></a>');
  });
  jQuery(".FM_Picture a").fancybox({
    helpers: {
      overlay: {
        locked: false,
        css : {
          'background' : 'rgba(0, 0, 0, 0.65)',
        }
      }
    }
  });
});


// documentation iframe height
function ts_updateHelpPageHeight() {
  var mainFrame = jQuery("#doc-frame")[0];
  mainFrame.setAttribute("height", 0);
  var menuFrame = jQuery("[name='bsscleft']", mainFrame.contentDocument)[0];
  var navPane = jQuery("[name='navpane']", menuFrame.contentDocument)[0];
  var tocIFrame = jQuery("#tocIFrame", navPane.contentDocument)[0];
  var tocIFrameHeight = 0;
  if (tocIFrame && tocIFrame.contentDocument.body) {
    tocIFrameHeight = tocIFrame.contentDocument.body.scrollHeight + 70;
    tocIFrame.setAttribute("scrolling", "no");
  }
  var contentFrame = jQuery("[name='bsscright']", mainFrame.contentDocument)[0];
  var contentFrameHeight = 0;
  if (contentFrame && contentFrame.contentDocument.body) {
    contentFrameHeight = contentFrame.contentDocument.body.scrollHeight + 60;
    contentFrame.setAttribute("scrolling", "no");
  }
  var height = (contentFrameHeight > tocIFrameHeight) ? contentFrameHeight : tocIFrameHeight;
  mainFrame.setAttribute("height", height);
  //jQuery(window).scrollTop(jQuery("#doc-frame").offset().top - 30);
}
function ts_updateSDKPageHeight() {
  var mainFrame = jQuery("#doc-frame")[0];
  mainFrame.setAttribute("height", 0);
  var menuFrame = jQuery("[name='webnavbar']", mainFrame.contentDocument)[0];
  var tocIFrame = jQuery("[name='cntNavtoc']", menuFrame.contentDocument)[0];
  tocIFrame.style.height = 0;
  var tocIFrameHeight = 0;
  if (tocIFrame) {
    tocIFrameHeight = tocIFrame.contentDocument.body.scrollHeight + 70;
    tocIFrame.setAttribute("scrolling", "no");
  }
  var contentFrame = jQuery("[name='webcontent']", mainFrame.contentDocument)[0];
  var contentFrameHeight = 0;
  if (contentFrame) {
    contentFrameHeight = contentFrame.contentDocument.body.scrollHeight + 60;
    contentFrame.setAttribute("scrolling", "no");
  }
  var height = (contentFrameHeight > tocIFrameHeight) ? contentFrameHeight : tocIFrameHeight;
  mainFrame.setAttribute("height", height);
  //jQuery(window).scrollTop(jQuery("#doc-frame").offset().top - 30);
}


function ts_firstEventsSubscription() {
  var mainFrame = jQuery("#doc-frame")[0];
  var webHelpContentFrame = jQuery("[name='bsscright']", mainFrame.contentDocument);
  var sdkContentFrame = jQuery("[name='webcontent']", mainFrame.contentDocument);
  if (webHelpContentFrame.length) {
    jQuery(webHelpContentFrame).load(ts_updateHelpPageHeight);
    ts_updateHelpPageHeight()
  } else if (sdkContentFrame.length) {
    jQuery(sdkContentFrame).load(ts_updateSDKPageHeight);
    ts_updateSDKPageHeight();
  }
}

function getDocumentationContent() {
  var data = {};
  // menu
  var mainFrame = jQuery("#doc-frame")[0];
  var menuFrame = jQuery("[name='bsscleft']", mainFrame.contentDocument)[0];
  var navPane = jQuery("[name='navpane']", menuFrame.contentDocument)[0];
  var tocIFrame = jQuery("#tocIFrame", navPane.contentDocument)[0];

  // content
  var contentFrame = jQuery("[name='bsscright']", mainFrame.contentDocument)[0];

  getDocumentationLinks(tocIFrame.contentDocument, data, contentFrame);
}

function getDocumentationLinks(container, data, contentFrame) {
  jQuery('a', container).each(function() {
    var  current_link = jQuery(this);
    var  current_link_children = current_link.parents('.parent').next('.child');
    data[current_link.text()] = {};
    data[current_link.text()]['link'] = current_link.attr('href');

    if(current_link_children.length > 0) {
      this.click();
      data[current_link.text()]['children'] = {};
      setTimeout(function() {
        getDocumentationLinks(current_link_children, data[current_link.text()]['children'], contentFrame);
      }, 500);
    }
  });
}


;
