import React, { useContext } from 'react'
import * as styles from './InputSelect.module.css'
import UIContext from '../../UIContext'

const InputSelect = (props) => {
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
        <select
          defaultValue={props.selectedOption}
          onChange={handleChange}
          onContextMenu={props.onContextMenu}
          style={{
            backgroundColor: context.secondary_color,
            color: context.text_color
          }}
        >
          {props.options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default InputSelect
