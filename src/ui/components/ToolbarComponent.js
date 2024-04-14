import React, { useState, useContext, useRef, useEffect } from 'react'
import * as styles from './ToolbarComponent.module.css'
import UIContext from '../UIContext'
import DropDownComponent from './DropDownComponent'
import classNames from 'classnames'
import { observer } from 'mobx-react'

const Toolbar = observer((props) => {
  const context = useContext(UIContext).theme
  const mainRef = useRef(null)

  const [activeItem, setActiveItem] = useState(null)
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [dropDownId, setDropDownId] = useState(null)
  const [dropDownPosition, setDropDownPosition] = useState({ top: 0, left: 0 })
  const [openUp, setOpenUp] = useState(false)

  const handleClickAway = (e) => {
    if (mainRef.current && !mainRef.current.contains(e.target)) {
      setActiveItem(null)
      setDropDownOpen(false)
    }
  }

  const handleWheel = (e) => {
    let offset = Math.sign(e.deltaY) * 5
    mainRef.current.scroll(mainRef.current.scrollLeft + offset, 0)

    let at_start = mainRef.current.scrollLeft === 0
    let at_end =
      mainRef.current.offsetWidth + mainRef.current.scrollLeft >=
      mainRef.current.scrollWidth

    if (!at_start && !at_end && dropDownOpen) {
      setDropDownPosition({
        top: dropDownPosition.top,
        left: dropDownPosition.left - offset
      })
    }
  }

  useEffect(() => {
    document.addEventListener('click', (e) => handleClickAway(e))

    let bounds = mainRef.current.getBoundingClientRect()
    setOpenUp(bounds.y > window.innerHeight - window.innerHeight / 3)

    return document.removeEventListener('click', (e) => handleClickAway(e))
  }, [])

  return (
    <div
      className={styles.toolbar}
      ref={mainRef}
      style={{
        ...props.style,
        backgroundColor: context.secondary_color || 'black',
        color: context.text_color || 'white'
      }}
      onWheel={handleWheel}
    >
      {props.items &&
        Object.keys(props.items).map((k, i) => {
          let item = props.items[k]
          return (
            <button
              key={item.id}
              title={item.title}
              style={{
                ...item.style,
                borderColor: context.text_color
              }}
              className={classNames(styles.button, {
                [styles.activeButton]: item === activeItem || item.highlight,
                // [styles.disableHover]: (item.onClick === undefined) && !item.dropDown
                [styles.disableHover]: item.disableHover
              })}
              onClick={(e) => {
                if (item.dropDown) {
                  let toggle = item === activeItem ? !dropDownOpen : true

                  let parent_bounds = mainRef.current.getBoundingClientRect()
                  let bounds = e.currentTarget.getBoundingClientRect()

                  let _openUp =
                    bounds.y > window.innerHeight - window.innerHeight / 3
                  setActiveItem(toggle ? item : null)
                  setOpenUp(_openUp)
                  setDropDownOpen(toggle)

                  // this id is important so that the dropdowns to received DERIVED STATE!
                  setDropDownId(item.id)
                  setDropDownPosition({
                    top: !openUp ? bounds.height : 'auto',
                    bottom: openUp ? 0 : 'auto',
                    left: bounds.left - parent_bounds.x
                  })
                }

                if (item.onClick) item.onClick()
              }}
            >
              {item.label}
              {item.dropDown && (
                <span className={styles.itemDecoration}>
                  {openUp ? '▲' : '▼'}
                </span>
              )}
            </button>
          )
        })}

      <div style={{ position: 'fixed' }}>
        {props.items[dropDownId] && (
          <DropDownComponent
            open={dropDownOpen}
            items={{ ...props.items[dropDownId].dropDown }}
            position={dropDownPosition}
            openUp={openUp}
          />
        )}
      </div>
    </div>
  )
})

export default Toolbar
