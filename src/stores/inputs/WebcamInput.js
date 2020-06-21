import React from 'react';
import {
    decorate,
    observable
} from "mobx";
import ShaderStore from "../ShaderStore";

class WebcamInput extends ShaderStore {
    name = "WEBCAM";
    grabber = null;
    controls = null;

    constructor(
        target = null,
    ) {
        super(
            target,
            `
            #ifdef GL_ES
            precision highp float;
            #endif 
            `,
            `attribute vec3 aPosition;
            attribute vec2 aTexCoord;
            varying vec2 vTexCoord;
            void main() {
                vTexCoord = aTexCoord;
                vec4 positionVec4 = vec4(aPosition, 1.0);
                positionVec4.xy = positionVec4.xy * vec2(1., -1.);
                gl_Position = positionVec4;
            }`,
            `varying vec2 vTexCoord;
            uniform vec2 resolution;
            uniform vec2 img_dimensions;
            uniform bool bSquare;
            uniform sampler2D tex0;
            void main() {                
                vec3 color = vec3(0.0);
                float aspect = img_dimensions.y / img_dimensions.x;
                vec2 uv = vTexCoord;
                if (bSquare) {
                    uv.y *= aspect;
                }
                vec4 src0 = texture2D(tex0, uv);
                gl_FragColor = vec4(src0);
            }`,
        );
    }

    // extending
    init() {
        this.parameter_graphs = [];
        this.ref = this.target.ref.createShader(
            this.vertex,
            this.fragment
        );

        this.extractUniforms();

        for (let uniform of this.uniforms) {
            this.ref.setUniform(uniform.name, uniform.elements);

            for (let param of uniform.elements) {
                if (param.graph)
                    this.parameter_graphs.push(param.graph)
            }
        }

        let p = this.target.parent.p5_instance;

        let constraints = {
            video: {
                mandatory: {
                    minWidth: 1280,
                    minHeight: 720
                },
                // optional: [{
                    // maxFrameRate: 10
                // }]
            },
            deviceId: 0,
            audio: false,
        };

        this.grabber = p.createCapture(constraints, ()=>{
            console.log('grabber activated')
        });

        // if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        //     console.log("enumerateDevices() not supported.");
        //     return;
        // }

        // // List cameras and microphones.
        // navigator.mediaDevices.enumerateDevices()
        //     .then((devices) => {
        //         console.log(devices)
        //         devices.forEach(function (device) {
        //             console.log(device.kind + ": " + device.label +
        //                 " id = " + device.deviceId);
        //         });
        //     })
        //     .catch((err) => {
        //         console.log(err.name + ": " + err.message);
        //     });


        this.controls = (
			<React.Fragment>
				<fieldset key={this.uuid}>
					<label key={this.uuid+1}>Input Device</label>
					{/* <select key={this.uuid+2} onChange={this.handleInputSelect}>
						{thi.map((e,i)=>{
							return (<option key={i} value={e.name}>{e.name}</option>);
						})}						
					</select>					 */}
				</fieldset>
				<fieldset key={this.uuid+1}>
					{/* <label key={this.uuid+1}>(0-1)</label>
					<input 
						key={this.uuid+2}
						type="checkbox"
						defaultChecked={this.modifier === 127}                
						onChange={(e)=>{
							this.modifier = e.target.checked ? 127 : 1
						}}			
					/> */}
				</fieldset>				
			</React.Fragment>								
		);

        return this;
    }

    // extending
    update(p) {
        let shader = this.ref;
        let target = this.target.ref;

        /* 
            Loop through all active parameter graphs to recompute 
            values in sync with the frame rate
        */
        for (let op of this.operatorUpdateGroup) {
            op.update();
            op.parent.update();
        }

        for (let uniform_data of this.uniforms) {
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

        shader.setUniform('tex0', this.grabber);
        shader.setUniform('resolution', [target.width, target.height]);
        shader.setUniform('img_dimensions', [this.grabber.width, this.grabber.height]);

        target.shader(shader);

        try {
            target.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        } catch (error) {
            console.error(error);
            console.log('frag', shader)
            p.noLoop();
        }
    }
}

decorate(WebcamInput, {
    uuid: observable,
    name: observable,
    target: observable,
    img: observable,
    node: observable,
})

export default WebcamInput;