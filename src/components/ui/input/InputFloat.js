import React from 'react';
import styles from './InputFloat.module.css';

export default class InputFloat extends React.PureComponent {

    position = [0,0];
    base_value = 0;

    handleChange = e => this.props.onChange(e.target.value);  

    handleDragStart = e => {
        console.log('starting drag')
        this.position = [e.pageX,e.pageY];
        this.base_value = this.props.value;
    }

    handleDrag = e => {
        let offset = (this.position[1] - e.pageY) * 0.001;
        this.props.onChange(this.base_value + offset)
    }

    handleDragEnd = e => {
        console.log('ending drag')
        // this.props.onChange(this.props.value );
        let offset = (this.position[1] - e.pageY) * 0.001;
        this.props.onChange(this.base_value + offset)
        // this.position = [0,0];
        // this.base_value = 0;
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <input 
                    style={{...this.props.style}}
                    type="number" 
                    step={this.props.step}
                    placeholder={this.props.name}
                    value={parseFloat(this.props.value).toFixed(2)}
                    onChange={this.handleChange}                    
                />   
                <div 
                    className={styles.dragOverlay}
                    onDrag={this.handleDrag}
                    onDragStart={this.handleDragStart}
                    onDragEnd={this.handleDragEnd}
                    onClick={this.props.onClick}
                    draggable
                ></div>                                                
            </div>
        );
    }
}