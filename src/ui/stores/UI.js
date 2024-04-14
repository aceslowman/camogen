import { types, onSnapshot, getSnapshot, applySnapshot } from 'mobx-state-tree'
import Context from './Context'
import { nanoid } from 'nanoid'

import Panel from './Panel'
import Theme from './Theme'
import Layout from './Layout'

/*  
  TODO
    some of the names for variable should be made a little more
    clear, in particular names for layouts.

    Layouts are a structure that hold panels and other sublayouts,
    and these can be saved. the member variable 'layouts' though
    refers to custom layouts that are saved and recalled, and that
    requires actually grabbing the whole outer panel. So it's not
    as much a layout as it is a panel, but not sure of the right 
    words to make that clear.
*/

const UI = types
  .model('UI', {
    panels: types.map(Panel),
    theme: Theme,
    layouts: types.map(Panel),
    context: types.maybe(Context)
  })
  .volatile((self) => ({
    panelVariants: null
  }))
  .actions((self) => ({
    afterAttach: () => {
      self.context = Context.create()

      // restore layout from local storage
      // whenever theme is changed, save in local storage
      onSnapshot(self.theme, () => {
        console.log('saving theme')
        window.localStorage.setItem(
          'theme',
          JSON.stringify(getSnapshot(self.theme))
        )
      })

      // if theme exists in local storage, load it up
      if (window.localStorage.getItem('theme')) {
        self.theme.setTheme(JSON.parse(window.localStorage.getItem('theme')))
      }

      // whenever layouts are changed, save in local storage
      // onSnapshot(self.layouts, () => {
      //   console.log('saving layouts')
      //   if (window.localStorage.getItem('layouts'))
      //     window.localStorage.setItem(
      //       'layouts',
      //       JSON.stringify(getSnapshot(self.layouts))
      //     )
      // })

      // if layouts exist in local storage, load them up
      if (window.localStorage.getItem('layouts')) {
        self.setCustomLayouts(JSON.parse(window.localStorage.getItem('layouts')))
      }
    },

    setPanelVariants: (panels) => {
      self.panelVariants = panels
    },

    setCustomLayouts: (layouts) => {
      for (const l in layouts) {
        self.layouts.put(layouts[l])
      }
    },

    saveCustomLayouts: () => {
      console.log('saving layouts')
      window.localStorage.setItem(
        'layouts',
        JSON.stringify(getSnapshot(self.layouts))
      )
    },

    addNewMainLayout: (layout, title) => {
      const newId = nanoid(4)
      self.layouts.put({ ...layout, id: newId, title: title || newId })
      self.saveCustomLayouts()
    },

    removeLayout: (layout) => {
      self.layouts.delete(layout.id)
      self.saveCustomLayouts()
    },

    getPanelVariant: (id) => {
      return self.panelVariants[id]
    },

    getLayout: (id) => {
      if (self.layouts.has(id)) {
        return self.layouts.get(id)
      }
    },

    getPanel: (id) => {
      return self.panels.get(id)
    },

    applyLayoutToMainPanel: (panel) => {
      const main = self.panels.get('MAIN')
      const snap = getSnapshot(panel)

      applySnapshot(main, { ...main, ...snap, id: 'MAIN', title: main.title })
    }
  }))

export default UI
