import React, { useContext } from 'react'
import * as styles from './ControlGroupComponent.module.css'
import UIContext from '../UIContext'

const ControlGroup = (props) => {
  const context = useContext(UIContext).theme

  return (
    <div className={styles.wrapper}>
      <fieldset
        style={{
          borderColor: context.outline_color
        }}
      >
        {props.name && (
          <legend
            style={{
              padding: '2px 4px',
              backgroundColor: context.text_color,
              color: context.primary_color
            }}
          >
            <strong>{props.name}</strong>
          </legend>
        )}

        <div>
          {React.Children.map(props.children, (child) => {
            let inputWidth = 100.0

            if (props.children.length) {
              inputWidth = 100.0 / props.children.length
            }

            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                style: { width: `${inputWidth}%` }
              })
            }

            return child
          })}
        </div>
      </fieldset>
    </div>
  )
}

export default ControlGroup
