 const Runner = (p, store) => {
  p.setup = () => {
    /*
      TODO this should point to an offscreen graphics buffer
    */
    // let container = document.getElementById("MAINOUTPUT");

    let canvas = p.createCanvas(512, 512);
    p.frameRate(30);

    // container.append(canvas.canvas);

    // let bounds = container.getBoundingClientRect();

    // canvas.resize(bounds.width, bounds.height);
    // TEMP
    // canvas.resize(512, 512);
    p.background(store.ui.theme.secondary_color);
    
    // console.log('p', p)
    
    /* TODO: this isn't happening until after elements of already rendered */
    console.log('setup new canvas...', canvas)
    store.setReady(true);
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

      if (store.transport.playing) 
        store.transport.incrementClock();
      
      if (store.transport.recording) 
        store.transport.stream.getVideoTracks()[0].requestFrame();
      
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
