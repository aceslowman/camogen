const types = ["GlyphShader","DebugShader","UVGenerator","RenderTarget"];
let modules = {};

types.forEach((type) => {
	modules = {
		...modules,
		[type]: require('./' + type + '.js').default
	}	
});

export {modules,types};