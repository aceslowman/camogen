import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';
import Parameter from './ParameterComponent';

const UniformComponent = observer(class UniformComponent extends React.Component {
    static contextType = MainContext;
    
    render() {    
        const { data, activeParam } = this.props;
        // console.log(activeParam === param)

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
                                active={activeParam === param}
                                key={param.uuid}
                                data={param}
                                onDblClick={e=>this.props.onDblClick(e)}
                            />
                        );                     
                    })}
                </div>
            </fieldset>            
        );
    }
});

export default UniformComponent;