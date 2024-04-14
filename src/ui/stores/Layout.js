import { types, getParent, getRoot, getSnapshot } from 'mobx-state-tree'
import { nanoid } from 'nanoid'
import Panel from './Panel'

const Layout = types
  .model('Layout', {
    id: types.identifier,
    title: 'Layout',
    size: 0,
    panel: types.maybe(Panel),
    children: types.array(types.late(() => Layout)),
    direction: types.optional(
      types.enumeration(['VERTICAL', 'HORIZONTAL']),
      'HORIZONTAL'
    )
  })
  .views((self) => ({
    get isEmpty() {
      const result =
        self.children.length &&
        self.children.filter(
          (s) => (!s.panel && !s.isEmpty) || (s.panel && !s.panel.floating)
        ).length === 0
      return result
    }
  }))
  .volatile((self) => ({
    siblings: null,
    rootStore: null
  }))
  .actions((self) => ({
    afterAttach: () => {
      self.siblings = getParent(self)
      self.rootStore = getRoot(self)
    },

    adjust: (position) => {
      const selfIndex = getParent(self).indexOf(self)

      /* 
        the sum is all panels (except for those floating) 
        *leading up to* the one we are resizing
      */
      let sum = 0
      for (let i = 0; i < selfIndex; i++) {
        sum += getParent(self)[i].size
      }

      const previousSize = self.size
      const adjustedSize = position - sum

      self.setSize(adjustedSize)

      const nextSibling = getParent(self)[selfIndex + 1]
      nextSibling.setSize(nextSibling.size + (previousSize - adjustedSize))
    },

    distributeChildren: () => {
      self.children.forEach((e, i) => {
        e.setSize(1 / self.children.length)
      })
    },

    setSize: (size) => {
      self.size = size
    },

    setDirection: (direction) => {
      self.direction = direction
    },

    setPanel: (panelId) => {
      /*  
        TODO 
          I think that this can be simplified in some way, 
          mainly I think there too many serialized fields
          a new panel is really just a different 'component_type'
          field

          until I figure out a better way to do this I am going to
          make sure that it retains floating, dimensions, and position
      */
      const newpanel = {
        ...getRoot(self).ui.panelVariants[panelId],
        floating: self.panel.floating,
        dimensions: [...self.panel.dimensions],
        position: [...self.panel.position]
      }

      self.panel = newpanel
      self.title = getRoot(self).ui.panelVariants[panelId].title
    },

    /* NOTE not currently in use */
    addLayout: (orientation, after) => {
      /* 
        look for the 'after' node and insert 'panel'
        after it
        
        if after is null, then insert at the very beginning (-1)
       */
      const insertAfter = after ? self.children.indexOf(after) : -1

      self.children.splice(
        insertAfter + 1,
        0,
        Layout.create({
          id: nanoid(),
          children: [
            Layout.create({
              id: nanoid() + '_child',
              // panel: panel,
              panel: {
                id: nanoid() + '_sub_child',
                title: 'New Layout'
              },
              size: 1
            })
          ],
          direction: orientation,
          size: 1 / self.children.length
        })
      )

      self.distributeChildren()
    },

    addPanel: (panel, after, direction) => {
      /* 
        look for the 'after' node and insert 'panel'
        after it
        
        if after is null, then insert at the very beginning (-1)
       */
      const insertAfter = after ? self.children.indexOf(after) : -1

      /* if direction is defined, treat it as a new layout */
      if (direction) {
        self.children.splice(
          insertAfter + 1,
          0,
          Layout.create({
            id: nanoid(),
            children: [
              Layout.create({
                id: nanoid() + '_child',
                panel: panel,
                size: 1
              })
            ],
            direction: direction,
            size: 1 / self.children.length
          })
        )
      } else {
        self.children.splice(
          insertAfter + 1,
          0,
          Layout.create({
            id: nanoid(),
            panel: panel,
            size: 1 / self.children.length
          })
        )
      }

      self.distributeChildren()
    },

    removePanel: (panel) => {
      if (self.children) {
        self.children = self.children.filter((child) => child !== panel)

        // if all panels are gone, remove this layout
        if (self.children.length === 0) {
          if (getParent(self, 2).removePanel)
            getParent(self, 2).removePanel(self)
        }
      }

      // TODO factor in the size of the removed panel
      // into the panel to its left and right

      self.distributeChildren()
    },

    clear: () => {
      if (self.panels && self.children) {
        self.panels.clear()
        self.children = []
      }
    }
  }))

export default Layout
