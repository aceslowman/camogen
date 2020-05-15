import React from 'react';
import Draggable from 'react-draggable';

let style = {
    jack: {
        backgroundColor: 'white'
    },
    canvas: {

    }
}

export default class Connection extends React.Component {

    constructor(){
        super();

        this.state = {
            dragging: false,
            dragDestination: false
        }
    }

    componentDidMount(){
        this.updateCanvas();
    }

    updateCanvas = () => {
        // get distance between a.x and b.x


        // get distance between a.y and b.y


        style.canvas = {
            ...style.canvas, 
            width: '50px',
            height: '50px',
        }

        const ctx = this.refs.canvas.getContext('2d');

        console.log(ctx)

        ctx.fillStyle = "blue";
        ctx.lineWidth = 10;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.strokeStyle = "green";

        let start = [0,0];
        let end   = [500,500];

        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    }

    handleDragStart = (e,d) => {
        // disconnect b
    }

    handleDrag = (e,d) => {
        // check to see if near another inlet

        this.setState({dragging: true});
    }

    handleDragStop = (e,d) => {
        // connect b near element

        // snapback
        if(!this.state.dragDestination){
			// d.node.style.transform = 'translate(0px,0px)';
        }
        this.setState({dragging: false});
    }
    
    render() {
        style.jack = {
            backgroundColor: this.state.dragging ? 'black' : 'white',
            borderColor: this.state.dragging ? 'white' : 'black',
        }

        return (          
                <div className="connection">
                    <canvas 
                        ref="canvas" 
                        className="connectionCanvas"
                        style={style.canvas}
                    ></canvas>                    
                    <div className="port" ref="port"></div>
                    <Draggable
                        // defaultPosition={this.props.data.b.position}
                        position={{x:0,y:0}}
                        onStart={this.handleDragStart}
                        onDrag={this.handleDrag}
                        onStop={this.handleDragStop}
                    >
                        <div style={style.jack} className="jack" ref="jack"></div>
                    </Draggable>                    
                </div>                        
        );
    }
}