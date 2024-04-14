import React, { useContext } from 'react'
import * as styles from './InputBool.module.css'
import UIContext from '../../UIContext'
import { observer } from 'mobx-react'

const InputBool = observer((props) => {
  const context = useContext(UIContext).theme
  const updateValue = (e) => props.onChange(e.target.checked, e.target.value)

  return (
    <div
      className={styles.wrapper}
      style={{
        ...props.style,
        backgroundColor: props.focused
          ? context.accent_color
          : context.secondary_color,
        flexFlow: props.hLabel && props.label ? 'row' : 'column'
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
          style={props.style}
          type='checkbox'
          value={props.value}
          checked={props.checked}
          onChange={updateValue}
          onContextMenu={props.onContextMenu}
        />
      </div>
    </div>
  )
})

export default InputBool
