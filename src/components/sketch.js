import { autorun } from 'mobx';

// load all shaders from folder
import * as NODES from './nodes';

// https: //stackoverflow.com/questions/16106701/how-to-generate-a-random-string-of-letters-and-numbers-in-javascript
function stringGen(len) {
    var text = "";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

let data = {};
let targets = {};
let shaders = {};

let store;
let sketchStarted;

const Sketch = (p) => {

    let start = () =>  {
        p.createCanvas(store.canvasWidth,store.canvasHeight);     

        p.smooth();
        p.background(128);   

        // initialize data nodes
        for(let d_id of store.nodes.dataIds) {
            console.log("data",store.getNodeById(d_id).type);
        }

        // initialize targets nodes
        for(let t_id of store.nodes.targetIds) {
            console.log("targets",store.getNodeById(t_id).type);

            let target = p.createGraphics(p.width,p.height,p.WEBGL);

            target.noStroke();

            targets = {
                ...targets,
                [t_id]: target
            }
        }

        // initialize shaders nodes
        for(let s_id of store.nodes.shaderIds) {
            console.log("shaders",store.getNodeById(s_id).type);

            let node = store.getNodeById(s_id);
            
            let target = targets[node.target_id];
            let shader = NODES.modules[node.type].assemble(target);

            // shader.setUniform('tex0',t);

            let uniform_entries = Object.entries(node.uniforms);

            for(let uniform of uniform_entries) {
                shader.setUniform(uniform[0],uniform[1]);
            }

            shader.setUniform('resolution',store.dimensions);

            shaders = {
                ...shaders,
                [s_id]: shader
            };
        }    

        /*
            Currently, the order of the shaders should be dictated 
            by the order of nodes.allIds

            now moving to target driven approach
        */
        // for(let i = 0; i < store.nodeCount; i++) {
        //     let id = store.nodes.allIds[i];
        //     let node = store.nodes.byId[id];

        //     let t, shader; 

        //     // set up render target for shader
        //     let pg = p.createGraphics(p.width,p.height,p.WEBGL);       
            
        //     shader = NODES.modules[node.type].assemble(pg);

        //     if(node.type !== 'RenderTarget') {
        //         // set empty texture for first pass
        //         t = i === 0 ? img : targets[i-1];

        //         shader.setUniform('tex0',t);

        //         let uniform_entries = Object.entries(node.uniforms);

        //         for(let i = 0; i < uniform_entries.length; i++) {
        //             shader.setUniform(uniform_entries[i][0],uniform_entries[i][1]);
        //         }

        //         shader.setUniform('resolution',store.dimensions);
                
        //         pg.noStroke();

        //         shaders.push(shader);
        //         targets.push(pg);
        //     }
        // }

        sketchStarted = true;

        autorun(() =>  {  
            if (p.width !== store.canvasWidth || p.height !== store.canvasHeight) {
                p.resizeCanvas(store.canvasWidth,store.canvasHeight);

                for(let pass of targets) {
                    pass.width = store.canvasWidth;
                    pass.height = store.canvasHeight;
                }
            }            

            for(let i = 0; i < store.nodeCount; i++) {
                let id = store.nodes.allIds[i];
                let node = store.nodes.byId[id];

                // if the node is a shader
                if(node.uniforms && shaders[i]) {
                    let s = shaders[i];

                    let uniform_entries = Object.entries(node.uniforms);

                    for(let i = 0; i < uniform_entries.length; i++) {
                        s.setUniform(uniform_entries[i][0],uniform_entries[i][1]);
                    }

                    s.setUniform('resolution',store.dimensions);
                }
            }
        });        
    }

    p.setup = () => {
         p.createCanvas(store.canvasWidth,store.canvasHeight);     
    }

    p.draw = () =>  {
        if(sketchStarted && store.nodeCount) {

            for(let data_id of store.nodes.dataIds) {
                console.log("data",store.getNodeById(data_id).type);
            }

            for(let target_id of store.nodes.targetIds) {
                console.log("targets",store.getNodeById(target_id).type);
            }

            for(let shader_id of store.nodes.shaderIds) {
                console.log("shaders",store.getNodeById(shader_id).type);
            }
            
        }

        // if(sketchStarted && store.nodeCount) {
        //     for(let i = 0; i < shaders.length; i++) {
        //         let s = shaders[i];
        //         let pg = targets[i];
        //         let t;

        //         if (i === 0) {
        //             t = img;
        //         } else {
        //             t = targets[i-1];
        //         }

        //         // uniforms have to be set below or else they will not be registered
        //         s.setUniform('tex0', t);
                
        //         let id = store.nodes.allIds[i];
        //         let node = store.nodes.byId[id];

        //         if(node.uniforms){
        //             let uniform_entries = Object.entries(node.uniforms);

        //             for(let i = 0; i < uniform_entries.length; i++) {
        //                 s.setUniform(uniform_entries[i][0],uniform_entries[i][1]);
        //             }

        //             // universal uniforms
        //             s.setUniform('resolution',[p.width,p.height]);

        //             pg.shader(s);

        //             pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        //         }    
        //     }

        //     p.image(targets[targets.length-1],0,0,p.width,p.height);
        // }

        p.noLoop();
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        store = props.store;

        if (store.sketchReady && !sketchStarted) {
            start();
        }
    };
}

export default Sketch;