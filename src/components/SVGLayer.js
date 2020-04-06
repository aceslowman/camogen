import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

const SVGLayer = observer(class SVGLayer extends React.Component {

    static contextType = MainContext;

    render() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
              <circle cx="100" cy="50" r="40" stroke="black" strokeWidth="2" fill="red" />
              <line x1="0" y1="0" x2="200" y2="200" stroke="red" strokeWidth='2' />
            </svg>
        )
    }
});

export default SVGLayer;
