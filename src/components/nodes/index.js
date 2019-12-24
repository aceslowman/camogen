const types = ["Glyph","UV"];
let modules = {};

types.forEach((type) => {
	modules = {
		...modules,
		[type]: require('./shaders/' + type + '.js').default
	}	
});

export {modules,types};