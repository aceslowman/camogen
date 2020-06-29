import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Parameter from './ParameterComponent';

export default @observer class ControlGroupComponent extends React.Component {
    static contextType = MainContext;
    
    render() {    
        const { name } = this.props;

        return (
            <fieldset 
                className="uniform_array"
            >                

                <legend 
                    className="invert" 
                    style={{ padding: '2px 4px', }}
                >
                    <strong>{this.props.name}</strong>
                </legend>
                
                {this.props.enabled && (
                    <div>
                        {this.props.children}
                    </div>
                )}
                
            </fieldset>            
        );
    }
};