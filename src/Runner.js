const Runner = (p, store) => {

    p.setup = () => {
        let container = document.getElementById('WORKAREA_inner')
        
        let c = p.createCanvas(
            container.offsetWidth+15,
            container.offsetHeight
        );
        
        container.append(c.canvas);
        
        p.background(120, 80, 50);
    }

    p.draw = () => {
        if (store.activeGraph && store.targets.length) {
            for (let target_data of store.targets) {
                let target = target_data.ref;

                for (let shader_data of target_data.shaders) {
                    shader_data.update(p);                                       
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