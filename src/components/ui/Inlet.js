import React from 'react';
import Draggable from 'react-draggable';

export default class Inlet extends React.Component {
    constructor() {
        super();
        this.state = {
            dragDestination: false,
            aPosX: 0,
            aPosY: 0 
        }
    }

    handleDragStart = (e,d) => {

    }

    handleDrag = (e,d) => {
        this.setState({
            aPosX: d.x + this.refs.connection.offsetTop,
            aPosY: d.y + this.refs.connection.offsetLeft,
        })
    }

    handleDragStop = (e,d) => {
        if(this.state.dragDestination){
			d.node.style.transform = 'translate(0px,0px)';
		}else{
			
		}
    }
    
    render() {
        return (          
                <div className="anylet">
                    <label>{this.props.label}</label>
                    <Draggable
                        position={{x:0,y:0}}
                        onStart={this.handleDragStart}
                        onDrag={this.handleDrag}
                        onStop={this.handleDragStop}
                    >
                        <div className="connection" ref="connection">
                            {this.state.aPosX + ',' + this.state.aPosY}
                        </div>
                    </Draggable>
                </div>                        
        );
    }
}