import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../MainContext';

import p5 from 'p5';

const GraphicsRunner = observer(class GraphicsRunner extends React.Component {
    static contextType = MainContext;

    constructor(props,context) {        
        super(props);
        context.p5_instance = new p5((p) => sketch(p,context.store));
    }

    render() {        
        return '';
    }
});

const sketch = (p, store) => {

    p.setup = () => {    
        p.createCanvas(window.innerWidth,window.innerHeight);   
        p.background(255,0,255);      
    }

    p.draw = () =>  {
        for(let target_data of store.targets) {
            let target = target_data.ref;

            for(let shader_data of target_data.shaders) {
                let shader = shader_data.ref;

                for(let uniform_data of shader_data.uniforms) {
                    shader.setUniform(uniform_data.name, uniform_data.value);
                }

                shader.setUniform('tex0', target);
                shader.setUniform('resolution', [target.width,target.height]);

                target.shader(shader);             

                target.quad(-1, -1, 1, -1, 1, 1, -1, 1);  
            }
        }    

        p.image(store.activeTarget,0,0,p.width,p.height);   
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        store = props.store;
    };
}

export default GraphicsRunner;