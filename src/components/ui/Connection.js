import React from 'react';
import Draggable from 'react-draggable';

let style = {
    jack: {
        backgroundColor: 'white'
    },
    canvas: {
        // transform: `translate(0,0)`
    }
}

export default class Connection extends React.Component {

    constructor(){
        super();

        this.state = {
            jackPosition: {x:0,y:0},
            dragging: false,
            dragDestination: false
        }
    }

    componentDidMount(){
        this.props.data.ref = this;

        this.setState({
            jackPosition: this.props.data.destinationCoords
        });
    }

    updateCanvas = () => {
        let a = {                        
            x: 0, // x: this.refs.port.offsetLeft,
            y: 0  // y: this.refs.port.offsetTop,
        };

        let b = {
            x: this.props.data.destinationCoords.x,
            y: this.props.data.destinationCoords.y,
        };
        
        let canvasWidth = 8;
        let offset = canvasWidth/2;
        let canvasHeight = Math.hypot(a.x - b.x, a.y - b.y)+offset;        

        let t = {
            x: canvasWidth/2, 
            y: canvasHeight/2,
        };
        let translation = `translate(${t.x}px,${t.y}px)`;

        let r = -Math.atan2(b.x,b.y);
        let rotation = `rotate(${r}rad)`;

        style.canvas = {
            ...style.canvas, 
            width: canvasWidth+'px',
            height: canvasHeight+'px',
            transform: `translate(${-t.x+offset+2}px,${-t.y+offset+2}px)` + rotation + `translate(${t.x-offset}px,${t.y-offset}px)`,
        }

        const ctx = this.refs.canvas.getContext('2d');

        // const gradient = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
        // gradient.addColorStop(0, "black");
        // gradient.addColorStop(1, "white");

        let start = [0,0];
        let end = [ctx.canvas.width,ctx.canvas.height];
 
        // ctx.lineWidth = 10;
        // ctx.fillStyle = gradient;
        ctx.fillStyle = "black";
        // ctx.strokeStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);        
        // ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);        

        // // ctx.save();        
        // ctx.beginPath();
        // ctx.moveTo(start[0], start[1]);
        // ctx.bezierCurveTo(
        //     start[0]+5, 
        //     start[0]+5, 
        //     end[0]+5, 
        //     end[1]+5, 
        //     end[0], 
        //     end[1]
        // );
        // // ctx.restore();

        // ctx.stroke();
    }

    handleDragStart = (e,d) => {
        // disconnect b
    }

    handleDrag = (e,d) => {
        this.setState({
            dragging: true,
            jackPosition: {
                x: d.x,
                y: d.y
            }
        });

        // check to see if near another inlet
    }

    handleDragStop = (e,d) => {
        // connect b near element

        // snapback
        if(!this.state.dragDestination){
			// d.node.style.transform = 'translate(0px,0px)';
        }
        this.setState({dragging: false});
    }

    componentDidUpdate() {
        // this.updateCanvas();
    }
    
    render() {
        style.jack = {
            backgroundColor: this.state.dragging ? 'black' : 'white',
            borderColor: this.state.dragging ? 'white' : 'black',
        }        

        // redraw canvas
        if (this.refs.jack) this.updateCanvas();

        return (          
                <div className="connection">
                    <canvas 
                        ref="canvas" 
                        className="connectionCanvas"
                        style={style.canvas}
                    ></canvas>                    
                    <div className="port" ref="port"></div>
                    <Draggable
                        defaultPosition={this.props.data.destinationCoords}
                        position={this.props.data.destinationCoords}
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