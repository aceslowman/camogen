const Runner = (p, store, props) => {

    p.setup = () => {
        let c = document.getElementById('WORKAREA_inner')
        
        let canvas = p.createCanvas(
            c.offsetWidth+15,
            c.offsetHeight
        );
        
        c.append(canvas.canvas);
        
        p.background(120, 80, 50);
    }

    p.draw = () => {
        if (store.activeGraph && store.targets.length) {
            for (let target_data of store.targets) {
                let target = target_data.ref;

                for (let shader_data of target_data.shaders) {
                    let shader = shader_data.ref;

                    /* 
                        Loop through all active parameter graphs to recompute 
                        values in sync with the frame rate
                    */
                    for (let op of shader_data.operatorUpdateGroup) {
                        op.update();
                        op.parent.update();
                    }

                    for (let uniform_data of shader_data.uniforms) {
                        if (uniform_data.elements.length > 1) {

                            // there should be a more elegant way of doing this
                            let elements = [];

                            for (let element of uniform_data.elements) {
                                elements.push(element.value);
                            }

                            shader.setUniform(uniform_data.name, elements);
                        } else {                            
                            shader.setUniform(uniform_data.name, uniform_data.elements[0].value);
                        }
                    }

                    // setup inputs
                    for (let i = 0; i < shader_data.inputs.length; i++) {
                        let input_shader = shader_data.node.parents[i].data;
                        
                        if(input_shader) {
                            let input_target = input_shader.target.ref;
                            shader.setUniform(shader_data.inputs[i], input_target);                            
                        }
                    }
                                        
                    shader.setUniform('resolution', [target.width, target.height]);                    

                    target.shader(shader);

                    try {
                        target.quad(-1, -1, 1, -1, 1, 1, -1, 1);
                    } catch (error) {
                        console.error(error);
                        p.noLoop();
                    }                    
                }
            }

            p.image(store.targets[0].ref, 0, 0, p.width, p.height);
        } else {
            p.background(0);
        }
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        store = props.store;
    };
}

export default Runner;