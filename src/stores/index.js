const shader_types = [
	"Glyph",
	"UV",
	"Noise",
	"Threshold",
	"Invert",
	"ToHSV",
	"Wavy",
	"Sharpen",
];

const op_types = [
	"Add",
	"Subtract",
	"Divide",
	"Multiply",
	"Modulus",	
	"Sin",
	"Cos",
	"Tan",	
];

const input_types = [
	"Counter",
	// "ElapsedFrames",
	// "osc",
	"MIDI",
	// "syphon",
];

const output_types = [	
	// "osc",
	// "midi",
	// "syphon",
];

let shaders = {};
let ops 	= {};
let inputs  = {};
let outputs = {};
let all 	= {};

shader_types.forEach((type) => {
	shaders = {
		...shaders,
		[type]: require('./shaders/' + type + '.json')
	}	
});

op_types.forEach((type) => {
	ops = {
		...ops,
		[type]: require('./ops/' + type + '.js').default
	}
});

input_types.forEach((type) => {
	inputs = {
		...inputs,
		[type]: require('./inputs/' + type + '.js').default
	}
});

output_types.forEach((type) => {
	outputs = {
		...outputs,
		[type]: require('./outputs/' + type + '.js').default
	}
});

all = {
	...shaders,
	...ops,
	...inputs,
	...outputs,
}

export { 
	shaders, 
	ops, 
	inputs, 
	outputs, 
	shader_types, 
	op_types, 
	input_types, 
	output_types,
	all,
};