import React, { useContext } from 'react'
import * as styles from './InputColor.module.css'
import UIContext from '../../UIContext'

const InputColor = (props) => {
  const context = useContext(UIContext).theme

  const handleChange = (e) => props.onChange(e.target.value)

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
        {props.showValue && (
          <input
            type='string'
            // className={styles.textInput}
            value={props.value}
            onChange={handleChange}
            style={{
              backgroundColor: context.text_color,
              color: context.secondary_color
            }}
          />
        )}

        <input
          type='color'
          value={props.value}
          onChange={handleChange}
          onContextMenu={props.onContextMenu}
          style={{
            backgroundColor: context.secondary_color,
            color: context.secondary_color
          }}
        />
      </div>
    </div>
  )
}

export default InputColor
