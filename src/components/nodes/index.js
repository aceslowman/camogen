const types = ["Glyph","UV","Noise","Threshold"];
let modules = {};

types.forEach((type) => {
	modules = {
		...modules,
		[type]: require('./shaders/' + type + '.js').default
	}	
});

export {modules,types};