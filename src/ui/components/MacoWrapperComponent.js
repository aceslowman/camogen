import React from 'react'
import * as styles from './MacoWrapperComponent.module.css'
import { observer } from 'mobx-react'
import ToolbarComponent from './ToolbarComponent'
import ContextMenuComponent from './ContextMenuComponent'
import UIContext from '../UIContext'

const MacoWrapper = observer((props) => {
  const store = props.store

  const handleContextMenu = () => {
    // prevents context menu anywhere that hasn't been
    // explicitly allowed
    store.ui.context.setContextmenu(props.contextmenu)
  }

  return (
    <div className={styles.wrapper}>
      <UIContext.Provider value={store.ui}>
        <ToolbarComponent items={props.titlebar} />
        <ContextMenuComponent items={store.ui.context.contextmenu} />

        <div
          className={props.className}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundColor: store.ui.theme.tertiary_color,
            ...props.style
          }}
          onContextMenu={() => handleContextMenu()}
        />

        {props.children}
      </UIContext.Provider>
    </div>
  )
})

MacoWrapper.defaultProps = {
  contextmenu: {},
  titlebar: {}
}

export default MacoWrapper
