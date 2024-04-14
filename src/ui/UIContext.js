import React from 'react'

const UIContext = React.createContext({})

export const UIProvider = UIContext.Provider
export const UIConsumer = UIContext.Consumer
export default UIContext