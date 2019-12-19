const types = ["GlyphShader","DebugShader","UVGenerator"];
let modules = {};

types.forEach((type) => {
	modules = {
		...modules,
		[type]: require('./shaders/' + type + '.js').default
	}	
});

export {modules,types};