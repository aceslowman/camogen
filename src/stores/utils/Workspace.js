import { types, applySnapshot } from 'mobx-state-tree';

const Workspace = types
    .model("Workspace", {
        name: types.maybe(types.string),
        defaultSize: types.maybe(types.number),
        split: types.optional(types.enumeration(['vertical','horizontal','none']),'none'),
        panels: types.maybe(types.array(types.late(()=>Workspace))),        
    })
    .volatile(self => ({
        updateFlag: false
    }))
    .actions(self => ({
        clear: () => {
            self.panels = [];
        },
        addPanel: (name) => {
            self.panels.push({
                name: name
            });
        },
        removePanel: (name) => {
            if(!self.panels || !self.panels.length) return;

            let filtered = self.panels.filter((e) => e.name !== name);

            self.panels = filtered;

            if(self.panels.length) {
                self.panels.forEach((e)=>e.removePanel(name));
            }
 
            self.updateFlag = !self.updateFlag;
        },
        setWorkspace: (name) => {
            // update flag restores default splits with workspace changes
            self.updateFlag = !self.updateFlag;
            switch (name) {
                case "Welcome":                    
                    applySnapshot(self, DefaultWelcome)
                    break;
                case "Shader Edit":
                    applySnapshot(self, DefaultShaderEdit)
                    break;
                case "Shader Control":
                    applySnapshot(self, DefaultShaderControl)
                    break;
                case "Parameter":
                    applySnapshot(self, DefaultParameter)
                    break;
                case "Debug":
                    applySnapshot(self, DefaultDebug)
                    break;                
                default:
                    console.error(`workspace ${name} does not exist`);
                    break;
            }
        }
    }))

export default Workspace;

const DefaultWelcome = {
    split: 'horizontal',
    panels: [
        {
            name: "Help",
            // defaultSize: 1/3,
            split: 'none',
            // panels: []
        },
        {
            name: "Shader Graph",
            // defaultSize: 1/3,
            split: 'none',
            // panels: []
        },
        {
            name: "Shader Controls",
            // defaultSize: 1/3,
            split: 'none',
            // panels: []
        },
    ]
}

const DefaultShaderEdit = {
    split: 'horizontal',
    panels: [
        {
            name: "Shader Editor",
            defaultSize: 2/3,
            split: 'none',
            panels: []
        },
        {
            split: 'vertical',
            panels: [
                {
                    name: "Shader Graph",
                    split: 'none',
                    panels: [],
                    defaultSize: 2/3
                }, {
                    name: "Messages",
                    split: 'none',
                    panels: []
                },
            ]
        }
    ]
}

const DefaultShaderControl = {
    split: 'horizontal',
    panels: [
        {
            name: "Shader Graph",
            split: 'none',
            panels: []
        },
        {
            name: "Shader Controls",
            split: 'none',
            panels: []
        },
    ]
}

const DefaultDebug = {
    split: 'horizontal',
    panels: [
        {
            name: "Debug",
            defaultSize: 1/3,
            split: 'none',
            panels: []
        },
        {
            split: 'vertical',
            panels: [
                {
                    name: "Shader Graph",
                    defaultSize: 2/3
                },
                {
                    name: "Messages"                    
                }
            ]
        }
    ]
}

const DefaultParameter = {
    split: 'horizontal',
    panels: [
        {
            split: 'vertical',
            panels: [
                {
                    name: "Shader Graph",
                    split: 'none',
                    // defaultSize: 1/3,
                    panels: []
                }, {
                    name: "Shader Controls",
                    split: 'none',
                    // defaultSize: 1/3,
                    panels: []
                }
            ]
        },
        
        {
            name: "Parameter Editor",
            split: 'none',
            // defaultSize: 1/3,
            panels: []
        },
        {
            name: "Debug",
            split: 'none',
            // defaultSize: 1 / 3,
            panels: []
        },
    ]
}

export {
    DefaultWelcome,
    DefaultShaderEdit,
    DefaultShaderControl,
    DefaultDebug,
    DefaultParameter
}