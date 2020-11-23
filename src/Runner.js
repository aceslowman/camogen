const Runner = (p, store) => {
  p.setup = () => {
    let container = document.getElementById("canvastest");

    let c = p.createCanvas(50, 50);

    container.append(c.canvas);

    let bounds = container.getBoundingClientRect();

    c.resize(bounds.width, bounds.height);
    // debug red
    // p.background(250, 25, 25);
    p.background(store.theme.secondary_color);
  };

  p.draw = () => {
    try {
      if (
        store.scene.shaderGraph &&
        store.ready &&
        store.scene.targets.length
      ) {
        for (let target_data of store.scene.targets) {
          for (let shader_node of target_data.render_queue) {
            shader_node.data.update(p);
          }
        }

        p.image(store.scene.targets[0].ref, 0, 0, p.width, p.height);
      } else {
        p.background(0);
      }

      if (store.transport.playing) store.transport.incrementClock();
    } catch (error) {
      console.error("error in runner, stopping draw loop", error);
      p.noLoop();
    }
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    store = props.store;
  };
};

export default Runner;
