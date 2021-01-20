# camogen v1.0.0-alpha

![Basic demo](https://cdn.glitch.com/dc2a8e0d-c671-426a-903d-ad1a4fc36b99%2FScreenshot%202021-01-19%2022%3A35%3A02.png?v=1611173120078)

Camogen is a visual art environment that allows you to write visual effects, arrange and chain them together using a graph system, and tweak parameters on the fly using an automatically generated interface. Every parameter can be changed by hand or by a motion graph system, allowing you to drive parameters with oscillators, MIDI controllers, and more.

I want Camogen to work for both programmers and non-programmers. It automatically generates an interface from shader code that can be tweaked, customized, and annotated, and each effect can be shared, remixed, and collected.

Camogen is an ongoing project and I'm building it to be modular and open-ended. My basic roadmap is to first finish and polish:

1. Static image tools
2. Motion tools
3. MIDI and audio reactive tools

and beyond that, at some point in the future:

4. Print media tools (page layout, PDF output, better text layout tools)
5. 3D (load models and textures into a scene)
6. Remote / streaming / network tools
7. Add-on system to allow for special, non-shader nodes.

![Code Editor for Camogen](https://cdn.glitch.com/dc2a8e0d-c671-426a-903d-ad1a4fc36b99%2FScreenshot%202021-01-19%2022%3A59%3A33.png?v=1611173114513)

![Camogen](https://cdn.glitch.com/dc2a8e0d-c671-426a-903d-ad1a4fc36b99%2Fmain.png?v=1609269460983)


## UI Features

- Adjustable, themeable split layout system that can be broken out into windows.
- Graph system that allows you to visually arrange and chain together shader programs.
- Keymaps for keyboard accessibility.
- Effect controls automatically generated from shader code. Each control can be customized and annotated.
- Cross platform, written in Javascript and WebGL.

github.com/aceslowman/maco-ui
