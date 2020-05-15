import React from 'react';
import Connection from './Connection';

export default class Anylet extends React.Component {
    
    render() {
        return (          
            <div className="anylet">
                <label>{this.props.label}</label>
                <Connection 
                    data={this.props.data}
                />
            </div>                        
        );
    }
}