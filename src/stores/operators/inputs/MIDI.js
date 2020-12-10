import { types } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const midi = types
	.model("MIDI", {
    type: "MIDI",
		value: 0,
		modifier: 1,
		midi_inputs: types.array(types.frozen()),
		// activeInput: 
		// midi_channel: types.optional(),
	})
	.actions(self => {
		function afterAttach() {
			navigator.requestMIDIAccess().then(onMIDIConnect);
		}

		function setMIDIInputs(inputs) {
			self.midi_inputs = [...inputs];
		}

		function onMIDIConnect(access) {
			self.setMIDIInputs(access.inputs.values());

			access.onstatechange = function (e) {
				// Print information about the (dis)connected MIDI controller
				console.log(e.port.name, e.port.manufacturer, e.port.state);
			};
		}

		function handleMIDIChange(v) {
			if(self.activeChannel === undefined) self.activeChannel = v.data[1];
			if(self.activeChannel === v.data[1]){
				self.value = v.data[2];
			}
		}

		function update() {
			return self.value / self.modifier
		}

		function handleInputSelect(e) {
			self.midi_inputs.forEach(input=>{			
				if (input.name === e) {
					self.activeInput = input;
					self.activeInput.onmidimessage = self.handleMIDIChange;
					return;
				}				
			});
		}

		return {
			afterAttach,
			setMIDIInputs,
			onMIDIConnect,
			handleMIDIChange,
			update,
			handleInputSelect,
		}
	})

const MIDI = types.compose(Operator, midi)

export default MIDI;