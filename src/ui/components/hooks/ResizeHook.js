import { useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import ResizeObserver from 'resize-observer-polyfill'

const useObserver = (callback, element, dependencies = []) => {
  const observer = useRef(null)
  
  useLayoutEffect(() => {
    const observe = () => {
      if (element && element.current && observer.current) {
        observer.current.observe(element.current)
      }
    }

    const current = element.current

    // if we are already observing old element
    if (observer && observer.current && current) {
      observer.current.unobserve(current)
    }
    const resizeObserverOrPolyfill = ResizeObserver

    observer.current = new resizeObserverOrPolyfill(callback)
    observe()

    return () => {
      if (observer && observer.current && current) {
        observer.current.unobserve(current)
      }
    }
  }, [callback, element, observer, ...dependencies])
}

useObserver.propTypes = {
  element: PropTypes.object,
  callback: PropTypes.func
  //   dependencies
}

export default useObserver
