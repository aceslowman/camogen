import React, { useContext, useRef } from 'react'
import * as styles from './InputSlider.module.css'
import InputFloat from './InputFloat'
import UIContext from '../../UIContext'
import PropTypes from 'prop-types'

let slider_bounds = null

const InputSlider = (props) => {
  const context = useContext(UIContext).theme

  const slider_element = useRef(null)

  const handleDragStart = (e) => {
    function handleDrag(e) {
      if (e.touches) e = e.touches[0]
      /*
              conditional fixes issue where last frame of
              drag results in a 'jump' in value, as pageY
              is 0. 
          */
      if (e.pageY) {
        let x = e.pageX + 2
        let position = (x - slider_bounds.x) / slider_bounds.width

        let value = position * (props.max - props.min) + props.min

        if (position <= 0.0) value = props.min
        if (position >= 1.0) value = props.max

        props.onChange(Math.floor(value / props.step) * props.step)
      }
    }

    function handleDragEnd(e) {
      if (e.touches && e.touches[0]) e = e.touches[0]

      let x = e.pageX + 2
      let position = (x - slider_bounds.x) / slider_bounds.width
      let value = position * (props.max - props.min) + props.min

      if (position >= 0.0 && position <= 1.0) {
        props.onChange(Math.floor(value / props.step) * props.step)
      }

      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchmove', handleDrag)
      document.removeEventListener('touchend', handleDragEnd)
    }

    if (e.touches && e.touches[0]) e = e.touches[0]

    slider_bounds = slider_element.current.getBoundingClientRect()
    let x = e.pageX + 2
    let position = (x - slider_bounds.x) / slider_bounds.width

    let value = position * (props.max - props.min) + props.min
    console.log([props.min, props.max])
    console.log('position', position)
    console.log('value', value)

    if (position >= 0.0 && position <= 1.0) {
      props.onChange(Math.floor(value / props.step) * props.step) // floor to step
    }

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchmove', handleDrag)
    document.addEventListener('touchend', handleDragEnd)
  }

  const handleFloatDrag = (v) => {
    props.onChange(v)
  }

  return (
    <div
      className={styles.wrapper + ' ' + styles.horizontal}
      style={props.style}
      onContextMenu={props.onContextMenu}
    >
      <InputFloat
        value={props.value}
        onChange={handleFloatDrag}
        step={props.step || 0.1}
      />
      <div
        ref={slider_element}
        className={styles.slider_track}
        onTouchStart={handleDragStart}
        onMouseDown={handleDragStart}
        style={{
          backgroundColor: context.secondary_color
        }}
      >
        <div
          className={styles.sleeve}
          style={{
            width:
              ((props.value - props.min) / (props.max - props.min)) * 100 + '%',
            backgroundColor: context.accent_color
          }}
        ></div>
        <div
          className={styles.handle}
          style={{
            left:
              ((props.value - props.min) / (props.max - props.min)) * 100 + '%',
            backgroundColor: context.accent_color
          }}
        ></div>
      </div>
    </div>
  )
}

InputSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  style: PropTypes.object
}

export default InputSlider
