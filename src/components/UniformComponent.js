import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Parameter from './ParameterComponent';

const UniformComponent = observer(class UniformComponent extends React.Component {
    static contextType = MainContext;
    
    render() {    
        const { data } = this.props;

        return (
            <fieldset 
                key={data.uuid}
                className="uniform_array"
            >
                <legend 
                    className="invert" 
                    style={{ padding: '2px 4px', }}
                >
                    <strong>{data.name}</strong>
                </legend>
                <div>
                    {data.elements.map((param)=>{                         
                        return (
                            <Parameter 
                                key={param.uuid}
                                data={param}
                                onFocus={e=>this.props.onFocus(e)}
                            />
                        );                     
                    })}
                </div>
            </fieldset>            
        );
    }
});

export default UniformComponent;