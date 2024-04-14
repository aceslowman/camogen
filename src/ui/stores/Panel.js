import { types, getParent, clone } from 'mobx-state-tree'
import Layout from './Layout'

const Panel = types
  .model('Panel', {
    id: types.identifier,
    component_type: '',
    title: types.maybe(types.string),
    subtitle: types.maybe(types.string),
    showTitle: true,
    floating: false,
    fullscreen: false,
    canFloat: false,
    canRemove: false,
    canFullscreen: false,
    dimensions: types.array(types.number),
    position: types.array(types.number),
    // layout: types.maybe(types.safeReference(types.late(() => Layout)))
    layout: types.maybe(types.late(() => Layout))
  })
  .volatile((self) => ({
    parent_layout: null
  }))
  .actions((self) => ({
    setLayout: (layout) => {
      const newLayout = clone(layout)
      self.layout = newLayout
    },

    setFloating: (f) => {
      self.floating = f
    },

    toggleFloating: () => {
      self.floating = !self.floating
    },

    toggleFullscreen: () => {
      self.fullscreen = !self.fullscreen
    },

    setPosition: (p) => {
      // TEMP: hack to keep away from title, use safe areas instead
      if (p[1] < 24) p[1] = 24

      self.position = p

      // EXPERIMENT: Limit position to max bounds
      if (p[0] + self.dimensions[0] > window.innerWidth)
        self.position[0] = window.innerWidth - self.dimensions[0]

      if (p[1] + self.dimensions[1] > window.innerHeight)
        self.position[1] = window.innerHeight - self.dimensions[1]
    },

    setDimensions: (d) => {
      self.dimensions = d

      // EXPERIMENT: Limit position to max bounds
      if (d[0] + self.position[0] > window.innerWidth)
        self.dimensions[0] = window.innerWidth - self.position[0]

      if (d[1] + self.position[1] > window.innerHeight)
        self.dimensions[1] = window.innerHeight - self.position[1]
    },

    setFullscreen: (f) => {
      self.fullscreen = f
    },

    onRemove: () => {
      self.parent_layout = getParent(self, 2) // ERROR HERE, cant remove
      self.parent_layout.removePanel(self)
    },

    center: () => {
      self.position[0] = window.innerWidth / 2 - self.dimensions[0] / 2
      self.position[1] = window.innerHeight / 2 - self.dimensions[1] / 2
    },

    fitScreen: () => {
      if (self.position[0] <= 0) self.position[0] = 0

      if (self.position[1] <= 0) self.position[1] = 0

      // if (self.dimensions[0] + self.position[0] >= window.innerWidth)
      // self.dimensions[0] = window.innerWidth - self.position[0];

      // if (self.dimensions[1] + self.position[1] >= window.innerHeight)
      // self.dimensions[1] = window.innerHeight - self.position[1];
    }
  }))

export default Panel
