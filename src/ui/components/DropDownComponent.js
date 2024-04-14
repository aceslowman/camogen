import React, { useState, useContext, useRef, useLayoutEffect } from 'react'
import UIContext from '../UIContext'
import * as styles from './DropDownComponent.module.css'
import classNames from 'classnames'
import { observer } from 'mobx-react'

let style = {
  drawer: {
    width: '0px',
    top: '0px',
    left: '0px'
  }
}

const DropDown = observer((props) => {
  const context = useContext(UIContext).theme
  const mainRef = useRef(null)

  const [activeItem, setActiveItem] = useState(null)
  const [subDropDownOpen, setSubDropDownOpen] = useState(false)
  const [subDropDownId, setSubDropDownId] = useState(null)
  const [subDropDownPosition, setSubDropDownPosition] = useState({
    top: 0,
    left: 0
  })

  const handleSubDropDown = (e, index, item) => {
    if (item.onClick) item.onClick()
    const toggle = index === activeItem ? !subDropDownOpen : true

    const bounds = e.currentTarget.getBoundingClientRect()

    setActiveItem(toggle ? index : false)
    setSubDropDownId(item.id)
    setSubDropDownOpen(toggle)
    setSubDropDownPosition({
      top: !props.openUp ? -bounds.height : 'auto',
      bottom: props.openUp ? 0 : 'auto',
      left: props.openLeft ? -bounds.width : bounds.width
    })
  }

  const handleClickAway = (e) => {
    if (mainRef.current && !mainRef.current.contains(e.target)) {
      setActiveItem(null)
      setSubDropDownOpen(false)
    }
  }

  function handleRef(e) {
    mainRef.current = e
    if (props.onRef) props.onRef(mainRef)
  }

  function handleContextMenu(e) {
    setSubDropDownOpen(false)
  }

  useLayoutEffect(() => {
    document.addEventListener('click', (e) => handleClickAway(e))
    document.addEventListener('contextmenu', (e) => handleContextMenu(e))

    return () => {
      document.removeEventListener('click', (e) => handleClickAway(e))
      document.addEventListener('contextmenu', (e) => handleContextMenu(e))
    }
  }, [])

  style = {
    ...style,
    drawer: {
      width: props.open ? '150px' : '0px',
      ...props.position
    }
  }

  return (
    <div
      className={classNames(styles.drawer, {
        //   [styles.openLeft]: props.openLeft,
        //   [styles.openUp]: props.openUp,
      })}
      ref={(e) => handleRef(e)}
      style={{
        ...style.drawer,
        backgroundColor: context.secondary_color,
        color: context.text_color
      }}
    >
      {props.items &&
        Object.keys(props.items).map((k, i) => {
          const item = props.items[k]

          // if there is a subdropdown
          if (item.dropDown) {
            return (
              <div
                key={item.id}
                className={styles.subDropDown}
                style={{
                  ...style.drawer,
                  backgroundColor: context.secondary_color,
                  color: context.text_color
                }}
              >
                <button
                  key={'sub' + item.id}
                  onClick={(e) => handleSubDropDown(e, i, item)}
                  className={classNames({
                    [styles.activeButton]: item.active ?? i === activeItem,
                    [styles.openLeft]: props.openLeft,
                    [styles.openUp]: props.openUp
                  })}
                >
                  {item.label}
                  <span>{props.openLeft ? '<' : '>'}</span>
                </button>

                {/* 
                                this extra div helps ensure nested 
                                dropdowns are visible through hidden
                                overflow
                             */}
                {i === activeItem && subDropDownId && (
                  <div key={item.id} style={{ position: 'fixed' }}>
                    <DropDown
                      key={item.id + 'dd'}
                      open={props.open && subDropDownOpen}
                      items={{ ...props.items[subDropDownId].dropDown }}
                      position={subDropDownPosition}
                      openLeft={props.openLeft}
                      openUp={props.openUp}
                    />
                  </div>
                )}
              </div>
            )
          } else {
            return (
              <div
                key={item.id}
                className={classNames({
                  [styles.activeButton]: item.active ?? i === activeItem,
                  [styles.disableHover]: item.disableHover,
                  [styles.openLeft]: props.openLeft,
                  [styles.openUp]: props.openUp
                })}
                style={{
                  display: 'flex',
                  width: '100%'
                }}
              >
                <button
                  key={'normal' + item.id}
                  title={item.title}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
                {item.buttons &&
                  Object.keys(item.buttons).map((k) => {
                    const b = item.buttons[k]
                    return (
                      <button
                        key={'button' + b.id}
                        onClick={b.onClick}
                        title={b.title}
                        style={{
                          border: `1px solid ${context.outline_color}`,
                          borderTop: 'none',
                          borderBottom: 'none',
                          borderLeftStyle: !props.openLeft ? 'solid' : 'none',
                          borderRightStyle: props.openLeft ? 'solid' : 'none',
                          flexShrink: 10,
                          padding: 3
                        }}
                      >
                        <small>{b.label}</small>
                      </button>
                    )
                  })}
              </div>
            )
          }
        })}
    </div>
  )
})

DropDown.defaultProps = {
  openLeft: false,
  openUp: false
}

DropDown.propTypes = {}

export default DropDown
