const types = ["Glyph","UV","Noise"];
let modules = {};

types.forEach((type) => {
	modules = {
		...modules,
		[type]: require('./shaders/' + type + '.js').default
	}	
});

export {modules,types};