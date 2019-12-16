import { autorun } from 'mobx';

let data = {};
let targets = {};
let swaps = {};
let shaders = {};

let store;
let sketchStarted;

const Sketch = (p) => {

    let start = () =>  {
        p.createCanvas(store.canvasWidth,store.canvasHeight);     

        p.smooth();
        p.background(128);   

        for(let t_id of store.targets.allIds) {
            let target_node = store.targets.byId[t_id];
            let target = p.createGraphics(p.width,p.height,p.WEBGL);
            let swap = p.createGraphics(p.width,p.height,p.WEBGL);
            console.log(target_node);

            for(let s_id in target_node.shaders) {
                let shader_node = store.shaders.byId[s_id];
                let shader = shader_node.type.assemble(target);
                console.log(shader_node);

                for(let u_id in shader_node.uniforms) {
                    let uniform = shader_node.uniforms[u_id];
                    console.log(u_id, uniform);

                    shader.setUniform(u_id, uniform);
                }

                shader.setUniform('resolution', store.dimensions);

                console.log(shader);
                shaders = { ...shaders, [s_id]: shader}
            }

            console.log(target);

            targets = { ...targets, [t_id]: target };
            swaps = { ...swaps, [t_id]: swap };
        }  

        sketchStarted = true;

        autorun(() => {
            if (p.width !== store.canvasWidth || p.height !== store.canvasHeight) {
                p.resizeCanvas(store.canvasWidth,store.canvasHeight);

                for(let pass of targets) {
                    pass.width = store.canvasWidth;
                    pass.height = store.canvasHeight;
                }
            } 

            for(let t_id of store.targets.allIds) {
                let target_node = store.targets.byId[t_id];
                let target = targets[t_id];

                for(let s_id in target_node.shaders) {
                    let shader_node = store.shaders.byId[s_id];
                    let shader = shaders[s_id];

                    for(let u_id in shader_node.uniforms) {
                        let uniform = shader_node.uniforms[u_id];

                        shader.setUniform(u_id, uniform);
                    }

                    shader.setUniform('resolution', store.dimensions);
                }
            }            
        });     
    }

    p.setup = () => {
         p.createCanvas(store.canvasWidth,store.canvasHeight);     
    }

    p.draw = () =>  {
        if(sketchStarted && store.nodeCount) {

            for(let t_id of store.targets.allIds) {
                let target_node = store.targets.byId[t_id];
                let target = targets[t_id];
                let swap = swaps[t_id];

                for(let s_id in target_node.shaders) {
                    let shader_node = store.shaders.byId[s_id];
                    let shader = shaders[s_id];

                    for(let u_id in shader_node.uniforms) {
                        let uniform = shader_node.uniforms[u_id];

                        shader.setUniform(u_id, uniform);
                    }

                    shader.setUniform('tex0', target);
                    shader.setUniform('resolution', store.dimensions);                    

                    // console.log('s_id',s_id);
                    // console.log('other',target_node.shaders[target_node.shaders.length-1]);

                    target.shader(shader);             

                    target.quad(-1, -1, 1, -1, 1, 1, -1, 1);

                    // if (s_id !== target_node.shaders[target_node.shaders.length-1]) {
                    //     // ping pong
                    //     let t_target = target;
                    //     target = swap;
                    //     swap = t_target; 
                    // }      
                }
            }  
            
            p.image(targets[0],0,0,p.width,p.height);
        }
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        store = props.store;

        if (store.sketchReady && !sketchStarted) {
            start();
        }
    };
}

export default Sketch;