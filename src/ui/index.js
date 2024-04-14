import _MacoWrapperComponent from './components/MacoWrapperComponent'

import _PanelComponent, {
  GenericPanel as _GenericPanel
} from './components/PanelComponent'
import _TextComponent from './components/TextComponent'
import _ToolbarComponent from './components/ToolbarComponent'
import _ContextMenuComponent from './components/ContextMenuComponent'
import _ControlGroupComponent from './components/ControlGroupComponent'
import _SplitContainer from './components/SplitContainer'
import _LayoutContainer from './components/LayoutContainer'
import _PagesContainer from './components/PagesContainer'

import _InputBool from './components/input/InputBool'
import _InputFloat from './components/input/InputFloat'
import _InputSelect from './components/input/InputSelect'
import _InputSlider from './components/input/InputSlider'
import _InputColor from './components/input/InputColor'

import _UIContext from './UIContext'

// STORES
import _ContextStore from './stores/Context'
import _LayoutStore from './stores/Layout'
import _PanelStore from './stores/Panel'
import { themes } from './stores/Theme'
import _UIStore from './stores/UI'

export const MacoWrapperComponent = _MacoWrapperComponent

export const TextComponent = _TextComponent
export const PanelComponent = _PanelComponent
export const GenericPanel = _GenericPanel
export const ToolbarComponent = _ToolbarComponent
export const ContextMenuComponent = _ContextMenuComponent
export const ControlGroupComponent = _ControlGroupComponent
export const SplitContainer = _SplitContainer
export const LayoutContainer = _LayoutContainer
export const PagesContainer = _PagesContainer

export const InputBool = _InputBool
export const InputFloat = _InputFloat
export const InputSelect = _InputSelect
export const InputSlider = _InputSlider
export const InputColor = _InputColor

export const UIContext = _UIContext

export const Themes = themes

// STORES
export const ContextStore = _ContextStore
export const LayoutStore = _LayoutStore
export const PanelStore = _PanelStore
export const UIStore = _UIStore // main store output
