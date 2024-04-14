import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect
} from 'react'
import useResizeObserver from './hooks/ResizeHook'
import classNames from 'classnames'
import * as styles from './SplitContainer.module.css'
import UIContext from '../UIContext'
import PropTypes from 'prop-types'

class Split {
  constructor({ id = 0, floating = false, size = 100 }) {
    this.id = id
    this.floating = floating
    this.size = size
  }
}

const SplitContainer = (props) => {
  const context = useContext(UIContext).theme

  const distributeSplits = () => {
    const count = props.children.length

    // make a full length split if there is only one child
    if (count <= 1)
      return [
        new Split({
          id: 0,
          floating: false,
          size: 100
        })
      ]

    // get all splits with default size values
    const defaultSplits = props.children
      .filter((e) => e.props.defaultsize)
      .map(
        (e, i) =>
          new Split({
            id: i,
            floating: false,
            size: e.props.defaultsize * 100.0
          })
      )

    // if defaults are defined, take them into account
    if (defaultSplits.length) {
      const defaultSum = defaultSplits
        .filter((s) => !s.floating)
        .reduce((a, b) => a + b.size, 0)

      // get default split sum
      return props.children.map(
        (e, i) =>
          new Split({
            id: i,
            size: e.props.defaultsize
              ? e.props.defaultsize * 100.0
              : (100.0 - defaultSum) / (count - 1),
            floating: false
          })
      )
    } else {
      return props.children.map(
        (e, i) =>
          new Split({
            id: i,
            floating: false,
            size: 100.0 / count
          })
      )
    }
  }

  const [split, setSplit] = useState(distributeSplits())
  const [isEmpty, setEmpty] = useState(false)

  const wrapperElement = useRef(null)

  // if the split is set to auto, decide whether or not its vertical based on
  // wrapper dimensions / aspect ratio
  const [isVertical, setIsVertical] = useState(
    props.vertical || !props.horizontal
  )

  const handleContainerResize = (e) => {
    if (props.auto) {
      const bounds = wrapperElement.current.getBoundingClientRect()
      setIsVertical(bounds.width < bounds.height)
    }
  }

  // TO DO this causes way too many redraws!
  useResizeObserver(handleContainerResize, wrapperElement, [
    props.auto,
    isVertical
  ])

  const handlePanelResize = (e, i) => {
    function handleMove(e) {
      if (e.pageX) {
        const pBounds = wrapperElement.current.getBoundingClientRect()

        let s

        if (isVertical) {
          s = (e.pageY - pBounds.y) / pBounds.height
        } else {
          s = (e.pageX - pBounds.x) / pBounds.width
        }

        const splitSum =
          i > 0
            ? split
                .slice(0, i)
                .filter((s) => !s.floating)
                .reduce((a, b) => a + b.size, 0)
            : 0
        split[i].size = s * 100 - splitSum

        if (split[i].size > 100) split[i].size = 100
        if (split[i].size < 0) split[i].size = 0

        setSplit([...split])
      }
    }

    function handleMoveEnd(e) {
      if (e.touches && e.touches[0]) e = e.touches[0]

      if (e.pageX) {
        const pBounds = wrapperElement.current.getBoundingClientRect()

        let s

        if (isVertical) {
          s = (e.pageY - pBounds.y) / pBounds.height
        } else {
          s = (e.pageX - pBounds.x) / pBounds.width
        }

        const splitSum =
          i > 0
            ? split
                .slice(0, i)
                .filter((s) => !s.floating)
                .reduce((a, b) => a + b.size, 0)
            : 0
        split[i].size = s * 100 - splitSum

        if (split[i].size > 100) split[i].size = 100
        if (split[i].size < 0) split[i].size = 0

        setSplit([...split])
      }

      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleMoveEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleMoveEnd)
    }

    if (e.touches && e.touches[0]) e = e.touches[0]

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleMoveEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleMoveEnd)
  }

  const handleDetach = (i, detachBool) => {
    if (i === split.length) return
    split[i].floating = detachBool
    setSplit([...split])
  }

  useLayoutEffect(
    (e) => {
      setSplit(distributeSplits())
    },
    [props.children.length, props.updateFlag]
  )

  useEffect(
    (e) => {
      // if all empty
      if (!split.filter((s) => !s.floating).length && !isEmpty) {
        setEmpty(true)
        if (props.onEmpty) props.onEmpty(true)
      }

      // if empty and a new split has been changed
      if (isEmpty) {
        setEmpty(false)
        if (props.onEmpty) props.onEmpty(false)
      }
    },
    [split]
  )

  const wrapperClass = classNames(styles.wrapper, {
    [styles.vertical]: isVertical,
    [styles.horizontal]: !isVertical,
    [styles.empty]: isEmpty
  })

  return (
    <div
      className={wrapperClass}
      ref={wrapperElement}
      style={{
        backgroundColor: context.tertiary_color
      }}
    >
      {props.children &&
        React.Children.map(props.children, (child, i) => {
          const isSplit = child.type.name === 'SplitContainer'

          // if there is only one panel, make it full width and height
          if (props.children.length === 1)
            return (
              <div
                style={isVertical ? { height: '100%' } : { width: '100%' }}
                className={classNames({
                  [styles.split_container]: isSplit,
                  [styles.panel_container]: !isSplit
                })}
              >
                {child}
              </div>
            )

          let hasHandle = i < props.children.length - 1

          let w
          // for all panels up to the last
          if (i < props.children.length - 1) {
            w = split[i] ? split[i].size : 0
            w = split[i].floating ? 0 : w
            if (split[i].floating) hasHandle = false
          } else {
            // sum all splits and get the final panel width
            // if last split is floating, remove handle
            if (split[i] && split[i].floating) {
              hasHandle = false
              w = 0
            } else {
              w =
                100 -
                split
                  .slice(0, -1)
                  .filter((s) => !s.floating)
                  .reduce((a, b) => a + b.size, 0)
            }
          }

          if (split[i + 1] && split[i + 1].floating && i === split.length - 2) {
            w =
              100 -
              split
                .slice(0, i)
                .filter((s) => !s.floating)
                .reduce((a, b) => a + b.size, 0)
          }

          if (
            split[i] &&
            !split[i].floating &&
            split.filter((s) => !s.floating).length === 1
          ) {
            w = 100
            hasHandle = false
          }

          /* 
            attaches hook that watches for float
            (hopefully this isn't a performance hit)
          */
          if (child.props.detachable) {
            child = React.cloneElement(child, {
              ...child.props,
              onDetach: (b) => handleDetach(i, b)
            })
          }

          /*
            if the child is a split, and the split is empty, make it shrink
          */
          if (isSplit) {
            child = React.cloneElement(child, {
              ...child.props,
              onEmpty: (b) => handleDetach(i, b)
            })
          }

          return (
            <React.Fragment>
              <div
                style={isVertical ? { height: w + '%' } : { width: w + '%' }}
                className={classNames(styles.panel_content, {
                  [styles.split_container]: isSplit,
                  [styles.panel_container]: !isSplit,
                  // [styles.split_floating]: split[i] ? split[i].floating : false
                })}
              >
                {/* {`w: ${w}`} */}
                {child}
              </div>
              {hasHandle && (
                <div
                  className={classNames(styles.drag_container, {
                    [styles.vertical]: isVertical,
                    [styles.horizontal]: !isVertical
                  })}
                >
                  <div
                    className={classNames(styles.drag_handle_visible, {
                      [styles.vertical]: isVertical,
                      [styles.horizontal]: !isVertical
                    })}
                    style={{
                      // backgroundColor: context.accent_color,
                      borderColor: context.accent_color
                    }}
                    onTouchStart={(e) => handlePanelResize(e, i)}
                    onMouseDown={(e) => handlePanelResize(e, i)}
                  >
                    <div
                      className={classNames(styles.drag_handle, {
                        [styles.vertical]: isVertical,
                        [styles.horizontal]: !isVertical
                      })}
                      style={{
                        // backgroundColor: context.accent_color,
                        borderColor: context.outline_color
                      }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}

      {props.children.length === 0 && (
        <p
          style={{
            alignSelf: 'center',
            textAlign: 'center'
          }}
        >
          <small>no panel in split!</small>
        </p>
      )}
    </div>
  )
}

SplitContainer.defaultProps = {
  updateFlag: false
}

// the children can have a defaultsize prop

SplitContainer.propTypes = {
  children: PropTypes.any.isRequired,
  horizontal: PropTypes.bool,
  vertical: PropTypes.bool,
  auto: PropTypes.bool, // used to automatically choose from horizontal or vertical
  split: PropTypes.array,
  updateFlag: PropTypes.bool
}

export default SplitContainer
