import { autorun } from 'mobx';

let targets = {};
let shaders = {};

let store;

const GraphicsRunner = (p) => {

    p.setup = () => {
        // p.createCanvas(store.canvasWidth,store.canvasHeight);     
        p.createCanvas(window.innerWidth,window.innerHeight);     

        p.smooth();
        p.background(128);   

        for(let t_id of store.targets.allIds) {
            let target_node = store.targets.byId[t_id];
            let target = p.createGraphics(p.width,p.height,p.WEBGL);
            // console.log('target',target_node);

            for(let s_id of target_node.shaders) {
                let shader_node = store.shaders.byId[s_id];                
                let shader = target.createShader(shader_node.precision+shader_node.vert, shader_node.precision+shader_node.frag);
                // console.log('shader',shader_node);

                for(let u_id of shader_node.uniforms) {
                    let uniform = store.parameters.byId[u_id];
                    // console.log('uniform',uniform.name);

                    shader.setUniform(uniform.name, uniform.value);
                }

                shader.setUniform('resolution', store.dimensions);

                shaders = { ...shaders, [s_id]: shader}
            }

            targets = { ...targets, [t_id]: target };
        }  

        autorun(() => {
            for(let t_id of store.targets.allIds) {
                let target_node = store.targets.byId[t_id];
                // console.log('target',target_node);

                for(let s_id of target_node.shaders) {
                    let shader_node = store.shaders.byId[s_id];
                    let shader = shaders[s_id];

                    for(let u_id of shader_node.uniforms) {
                        let uniform = store.parameters.byId[u_id];
                        // console.log('uniform',uniform);

                        shader.setUniform(uniform.name, uniform.value);
                    }

                    shader.setUniform('resolution', store.dimensions);
                }
            }            
        });     
    }

    p.draw = () =>  {
        for(let t_id of store.targets.allIds) {
            let target_node = store.targets.byId[t_id];
            let target = targets[t_id];

            for(let s_id of target_node.shaders) {
                let shader_node = store.shaders.byId[s_id];
                let shader = shaders[s_id];

                for(let u_id of shader_node.uniforms) {
                    let uniform = store.parameters.byId[u_id];

                    shader.setUniform(uniform.name, uniform.value);
                }

                shader.setUniform('tex0', target);
                shader.setUniform('resolution', store.dimensions);                    

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