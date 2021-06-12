import React from 'react';

const MainContext = React.createContext({});

export const MainProvider = MainContext.Provider;
export const MainConsumer = MainContext.Consumer;
export default MainContext;