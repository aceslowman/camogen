import React, { useContext } from 'react'
import * as styles from './InputFloat.module.css'
import UIContext from '../../UIContext'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

let position = [0, 0]
let base_value = 0

/*
    ISSUES:

        should be able to drag input outside of browser window
        but the solution in js is not immediately obvious

        there is a possible lead here:
        https://stackoverflow.com/questions/1685326/responding-to-the-onmousemove-event-outside-of-the-browser-window-in-ie
*/

const InputFloat = observer((props) => {
  const context = useContext(UIContext).theme

  const handleChange = (e) => props.onChange(Number(e.target.value))

  const handleDragStart = (e) => {
    let dragging = false

    function handleDrag(e) {
      e.preventDefault()
      dragging = true
      /*
                conditional fixes issue where last frame of
                drag results in a 'jump' in value, as pageY
                is 0. 
            */
      if (e.pageY) {
        // fine control w shift / large control w ctrl
        let scalar = e.ctrlKey ? 100 : e.shiftKey ? 20000 : 1000

        let x_offset = e.pageX - position[0]
        let y_offset = position[1] - e.pageY

        x_offset = Math.min(Math.max(x_offset, 1), 100)

        let output_value = base_value + (y_offset * x_offset) / scalar

        // factor in step size
        if (props.step) {
          output_value /= props.step
          output_value = Math.floor(output_value)
          output_value *= props.step
        }

        props.onChange(output_value)
      }
    }

    function handleDragEnd(e) {
      if (dragging) {
        // fine control w shift / large control w ctrl
        let scalar = e.ctrlKey ? 100 : e.shiftKey ? 20000 : 1000

        let x_offset = e.pageX - position[0]
        let y_offset = position[1] - e.pageY

        x_offset = Math.min(Math.max(x_offset, 1), 100)

        let output_value = base_value + (y_offset * x_offset) / scalar

        // factor in step size
        if (props.step) {
          output_value /= props.step
          output_value = Math.floor(output_value)
          output_value *= props.step
        }

        props.onChange(output_value)
      }

      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchmove', handleDrag)
      document.removeEventListener('touchend', handleDragEnd)

      dragging = false
    }

    if (e.touches && e.touches[0]) e = e.touches[0]

    position = [e.pageX, e.pageY]
    base_value = props.value

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchmove', handleDrag)
    document.addEventListener('touchend', handleDragEnd)
  }

  const value = parseFloat(props.value).toFixed(2)

  const defaultInputStyle = {
    backgroundColor: context.secondary_color,
    color: context.text_color
  }

  return (
    <div
      className={styles.wrapper}
      style={{
        ...props.style,
        backgroundColor: props.focused
          ? context.accent_color
          : context.secondary_color
      }}
    >
      {props.label && (
        <label
          style={{
            backgroundColor: props.focused
              ? context.accent_color
              : context.text_color,
            color: context.primary_color
          }}
        >
          {props.label}:
        </label>
      )}
      <div className={styles.wrapper_inner}>
        <input
          type='number'
          step={props.step}
          value={Number(value)}
          onChange={handleChange}
          onClick={props.onClick}
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
          onDoubleClick={props.onDoubleClick}
          onContextMenu={props.onContextMenu}
          style={{
            ...defaultInputStyle,
            ...props.inputStyle
          }}
        />
      </div>
    </div>
  )
})

InputFloat.defaultProps = {
  value: 0,
  step: 0.1,
  focused: false
}

InputFloat.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.number,
  focused: PropTypes.bool,

  onChange: PropTypes.func,
  onDoubleClick: PropTypes.func,
  inputStyle: PropTypes.object
}

export default InputFloat
