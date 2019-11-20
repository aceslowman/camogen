import React from 'react';

export default class InputGroup extends React.Component {
    render() {
        return (
            <fieldset style={{...this.props.style, display:'flex',flexFlow:'wrap',flexDirection:'row',justifyContent:'center'}}>
                <legend>{this.props.name}</legend>
                <div className='flex-inner-wrapper'>
                    {this.props.children}
                </div>
            </fieldset>
        );
    }
}