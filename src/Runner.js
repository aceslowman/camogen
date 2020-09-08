const Runner = (p, store) => {

    p.setup = () => {
        let container = document.getElementById('APP')
        
        let c = p.createCanvas(
            container.offsetWidth+15,
            container.offsetHeight
        );
        
        container.append(c.canvas);
        
        // debug red
        p.background(250, 25, 25);
    }

    p.draw = () => {
        try {
            if (
                store.scene.shaderGraph
                && store.ready
            ) {
                for (let target_data of store.scene.targets) {
                    for (let shader_node of target_data.shader_nodes) {
                        shader_node.data.update(p);                                       
                    }
                }
                // console.log(store.scene.targets)
                p.image(store.scene.targets[0].ref, 0, 0, p.width, p.height);
                // p.background(100); // gray
            } else {
                p.background(0);
            }
        } catch (error) {
            console.error(error);
            p.noLoop();
        }        
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        store = props.store;
    };
}

export default Runner;