import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

import p5 from 'p5';

const GraphicsRunner = observer(class GraphicsRunner extends React.Component {
    static contextType = MainContext;

    constructor(props,context) {        
        super(props);
        context.p5_instance = new p5((p) => sketch(p,context.store,props));
    }

    handleResize = e => {
        this.context.p5_instance.resizeCanvas(
            this.props.work_area.current.offsetWidth,
            this.props.work_area.current.offsetHeight
        );

        // update target dimensions
        for (let target_data of this.context.store.targets) {
            let target = target_data.ref;

            target.resizeCanvas(
                this.props.work_area.current.offsetWidth,
                this.props.work_area.current.offsetHeight
            );
        }

        this.context.p5_instance.draw();
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    render() {        
        return '';
    }
});

const sketch = (p, store, props) => {

    p.setup = () => {         
        p.frameRate(1);   
        p.createCanvas(
            window.innerWidth,
            window.innerHeight
            // props.work_area.current.offsetWidth,
            // props.work_area.current.offsetHeight
        );
                
        p.background(255,0,255);      
    }

    p.draw = () =>  {        
        if (store.activeTarget){
            for (let target_data of store.targets) {
                // console.log(target_data);
                let target = target_data.ref;

                for (let shader_data of target_data.shaders) {
                    let shader = shader_data.ref;

                    /* 
                        Loop through all active parameter graphs to recompute 
                        values in sync with the frame rate
                    */
                    for (let parameter_graph of shader_data.parameter_graphs) {
                        parameter_graph.update();
                    }

                    for (let uniform_data of shader_data.uniforms) {
                        if (uniform_data.elements) {

                            // there should be a more elegant way of doing this
                            let elements = [];

                            for (let element of uniform_data.elements) {
                                elements.push(element.value);
                            }
                            
                            shader.setUniform(uniform_data.name, elements);
                        }else{
                            shader.setUniform(uniform_data.name, uniform_data.value);
                        }                        
                    }

                    shader.setUniform('tex0', target);
                    shader.setUniform('resolution', [target.width, target.height]);

                    target.shader(shader);

                    target.quad(-1, -1, 1, -1, 1, 1, -1, 1);
                }
            }

            p.image(store.activeTarget.ref, 0, 0, p.width, p.height);
        }else{            
            p.background(0);
        } 
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        store = props.store;        
    };
}

export default GraphicsRunner;