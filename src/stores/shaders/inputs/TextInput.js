import { getRoot, types } from "mobx-state-tree";
import Shader from '../../ShaderStore';
import * as DefaultShader from '../DefaultShader';

const text = types
    .model("Text", {
        type: 'TextInput',
        name: 'Text', //TODO get rid of this, only need type
        // input_options: types.array(types.frozen()),
        // display_mode: types.optional(types.enumeration('Display Mode', [
        //     "preserve_aspect", 
        //     "stretch"
        // ]) , "preserve_aspect"),
        // attachment: types.optional(types.enumeration('Attachment', [
        //     "TOP_LEFT",    "TOP_CENTER",    "TOP_RIGHT",
        //     "CENTER_LEFT", "CENTER_CENTER", "CENTER_RIGHT",
        //     "BOTTOM_LEFT", "BOTTOM_CENTER", "BOTTOM_RIGHT"
        // ]), "CENTER_CENTER"),!
        precision: DefaultShader.precision,
        vert: DefaultShader.vert,
        frag: `varying vec2 vTexCoord;
            uniform vec2 resolution;
            uniform sampler2D tex0;

            void main() {                
                vec3 color = vec3(0.0);
                vec2 uv = vTexCoord;

                vec4 src0 = texture2D(tex0, uv);
                gl_FragColor = vec4(src0);
            }`,
    })
    .volatile(self => ({
        // grabber: null
    }))
    .views(self => ({
//         get displayModeId() {
//             return ["preserve_aspect", "stretch"].indexOf(self.display_mode);
//         },

//         get attachmentId() {
//             let params = self.attachment.split('_').reverse();
//             // swapped to read as x,y
//             params[0] = ["LEFT", "CENTER", "RIGHT"].indexOf(params[0]);
//             params[1] = ["TOP", "CENTER", "BOTTOM"].indexOf(params[1]);

//             return params;
//         }
    }))
    .actions(self => {
        let root_store;

        function afterAttach() {
            root_store = getRoot(self);
        }

        function init() {
//             self.ref = self.target.ref.createShader(
//                 self.vertex,
//                 self.fragment
//             );

//             self.extractUniforms();

//             for (let uniform of self.uniforms) {
//                 self.ref.setUniform(uniform.name, uniform.elements);

//                 for (let param of uniform.elements) {
//                     if (param.graph)
//                         self.parameter_graphs.push(param.graph)
//                 }
//             }

//             let p = root_store.p5_instance;

//             let constraints = {
//                 video: {
//                     mandatory: {
//                         minWidth: 1920,
//                         minHeight: 1080
//                     },
//                     // optional: [{
//                         // maxFrameRate: 10
//                     // }]
//                 },
//                 deviceId: 0,
//                 audio: false,
//             };

//             self.grabber = p.createCapture(constraints, ()=>{
//                 console.log('grabber activated')
//             });

//             if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
//                 console.log("enumerateDevices() not supported.");
//                 return;
//             }

//             // List cameras
//             navigator.mediaDevices.enumerateDevices()
//                 .then((devices) => {
//                     let videoinputs = devices.filter((e) => e.kind === 'videoinput');
//                     self.setInputOptions(videoinputs);
//                     videoinputs.forEach(function (device) {
//                         console.log(device.kind + ": " + device.label +
//                             " id = " + device.deviceId);
//                     });      
//                 })
//                 .catch((err) => {
//                     console.log(err.name + ": " + err.message);
//                 });

//             // allows user to capture screen, may be useful elsewhere!
//             // navigator.mediaDevices.getDisplayMedia()

//             // prevents init() from being called twice
//             self.ready = true;

//             // removes 'tex0' from inputs, since it's provided
//             // by the webcam stream.            
//             self.inputs = [];
        }
      
        function update(p) {
//             let shader = self.ref;
//             let target = self.target.ref;

//             for (let uniform_data of self.uniforms) {
//                 if (uniform_data.elements.length > 1) {
//                     let elements = uniform_data.elements.map(e => e.value)
//                     shader.setUniform(uniform_data.name, elements);
//                 } else {
//                     shader.setUniform(uniform_data.name, uniform_data.elements[0].value);
//                 }
//             }

//             shader.setUniform('tex0', self.grabber);
//             shader.setUniform('resolution', [target.width, target.height]);
//             shader.setUniform('img_dimensions', [self.grabber.width, self.grabber.height]);
//             shader.setUniform('display_mode', self.displayModeId);
//             // shader.setUniform('attachment', self.attachmentId);

//             target.shader(shader);

//             try {
//                 target.quad(-1, -1, 1, -1, 1, 1, -1, 1);
//             } catch (error) {
//                 console.error(error);
//                 console.log('frag', shader)
//                 p.noLoop();
//             }
        }

        return {
            afterAttach,
            init,
            update,
        }
    })

const Webcam = types.compose(Shader, webcam);
export default Webcam;