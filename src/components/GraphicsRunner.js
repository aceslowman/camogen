import React from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

import p5 from 'p5';

let targets = {};
let shaders = {};

const GraphicsRunner = observer(class GraphicsRunner extends React.Component {
    static contextType = MainContext;

    componentDidMount() {        
        this.context.p5_instance = new p5((p) => sketch(p,this.context.store));
    }

    render() {        
        return '';
    }
});

const sketch = (p, store) => {

    p.setup = () => {    
        p.createCanvas(window.innerWidth,window.innerHeight);     

        p.smooth();
        p.background(128);   

        // set up
        for(let target_node of store.targets) {
            let target = p.createGraphics(p.width,p.height,p.WEBGL);

            for(let shader_node of target_node.shaders) {
                console.log(shader_node);

                let shader = target.createShader(
                    shader_node.vertex,
                    shader_node.fragment,
                );

                for(let uniform_node of shader_node.uniforms) {
                    shader.setUniform('uniform_node.name', uniform_node.value);
                }

                shaders = { ...shaders, [shader_node.id]: shader}
            }

            targets = { ...targets, [target_node.id]: target };
        }

        autorun(() => {
            for(let target_node of store.targets) {
                for(let shader_node of target_node.shaders) {
                    let shader = shaders[shader_node.id];                    

                    for(let uniform_node of shader_node.uniforms) {
                        shader.setUniform(uniform_node.name, uniform_node.value);
                    }

                    shader.setUniform('resolution', [p.width,p.height]);
                }
            }           
        });     
    }

    p.draw = () =>  {
        for(let target_node of store.targets) {
            let target = targets[target_node.id];

            for(let shader_node of target_node.shaders) {
                let shader = shaders[shader_node.id];

                for(let uniform_node of shader_node.uniforms) {
                    shader.setUniform(uniform_node.name, uniform_node.value);
                }

                shader.setUniform('tex0', target);
                shader.setUniform('resolution', [p.width,p.height]);

                target.shader(shader);             

                target.quad(-1, -1, 1, -1, 1, 1, -1, 1);  
            }

            p.image(target,0,0,p.width,p.height);
        }        
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        store = props.store;
    };
}

export default GraphicsRunner;