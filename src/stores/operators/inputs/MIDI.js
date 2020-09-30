import { types, getParent } from "mobx-state-tree";
import Operator from '../../OperatorStore';

const midi = types
	.model("MIDI", {
		value: 0,
		modifier: 1,
		midi_inputs: types.array(types.frozen()),
		// activeInput: 
		// midi_channel: types.optional(),
	})
	.actions(self => {
		let parent_shader;

		function afterAttach() {
			parent_shader = getParent(self, 8);

			navigator.requestMIDIAccess().then(onMIDIConnect);
		}

		function setMIDIInputs(inputs) {
			console.log(inputs)
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
				self.value = Number(v.data[2]);
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
			console.log(self.midi_inputs)
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