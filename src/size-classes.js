;(function(window) {
  const sizeClasses = {
    globalPrefix: 'sc',
    width: {
      prefix: 'w',
      classes: [
        {
          name: 'c',
          portrait: {
            minWidth: 0,
            minHeight: 0,
          },
          landscape: {
            minWidth: 0,
            minHeight: 0,
          },
        },
        {
          name: 'r',
          portrait: {
            minWidth: 736,
            minHeight: 414,
          },
          landscape: {
            minWidth: 736,
            minHeight: 414,
          },
        },
      ],
    },
    height: {
      prefix: 'h',
      classes: [
        {
          name: 'c',
          portrait: {
            minWidth: 0,
            minHeight: 0,
          },
          landscape: {
            minWidth: 0,
            minHeight: 0,
          },
        },
        {
          name: 'r',
          portrait: {
            minWidth: 0,
            minHeight: 568,
          },
          landscape: {
            minWidth: 0,
            minHeight: 568,
          },
        },
      ],
    },
  }

  const customResizeEventName = 'optimizedResize'

  window.addEventListener('optimizedResize', function() {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const isLandscape = windowWidth >= windowHeight
    updateSizeClasses(windowWidth, windowHeight, isLandscape)
  })

  window.dispatchEvent(new CustomEvent(customResizeEventName))

  function updateSizeClasses(windowWidth, windowHeight, isLandscape) {
    const globalPrefix = sizeClasses['globalPrefix']
    updateClass(
      windowWidth,
      windowHeight,
      isLandscape,
      globalPrefix,
      sizeClasses['width']['prefix'],
      sizeClasses['width']['classes'],
    )
    updateClass(
      windowWidth,
      windowHeight,
      isLandscape,
      globalPrefix,
      sizeClasses['height']['prefix'],
      sizeClasses['height']['classes'],
    )
  }

  function updateClass(
    windowWidth,
    windowHeight,
    isLandscape,
    globalPrefix,
    orientationPrefix,
    classes,
  ) {
    for (let i = classes.length - 1; i >= 0; i--) {
      const className = classes[i]['name']
      const classOrientation = isLandscape
        ? classes[i]['landscape']
        : classes[i]['portrait']
      if (
        windowWidth >= classOrientation['minWidth'] &&
        windowHeight >= classOrientation['minHeight']
      ) {
        addClass(globalPrefix, orientationPrefix, className, classes)
        break
      }
    }
  }

  function addClass(globalPrefix, orientationPrefix, className, classes) {
    const classString = `${globalPrefix}-${orientationPrefix}${className}`
    if (!document.body.classList.contains(classString)) {
      removeClasses(globalPrefix, orientationPrefix, classes)
      document.body.classList.add(classString)
    }
  }

  function removeClasses(globalPrefix, orientationPrefix, classes) {
    for (let i = 0; i < classes.length; i++) {
      const oldClassName = classes[i]['name']
      document.body.classList.remove(
        `${globalPrefix}-${orientationPrefix}${oldClassName}`,
      )
    }
  }

  throttle('resize', customResizeEventName)

  function throttle(eventName, customEventName) {
    let running = false

    function func() {
      if (running) {
        return
      }
      running = true
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent(customEventName))
        running = false
      })
    }

    window.addEventListener(eventName, func)
  }
})(window)
