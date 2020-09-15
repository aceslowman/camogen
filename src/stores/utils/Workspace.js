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
        addPanel: (panel) => {
            self.panels.push(panel);
        },
        removePanel: (name) => {
            let index = self.panels.indexOf(name);
            if (index > -1) {
                self.panels.splice(index, 1)
            }
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
    panels: [{
            name: "Shader Graph",
            split: 'none',
            defaultSize: 1/6,
            panels: []
        },
        {
            name: "Shader Controls",
            split: 'none',
            panels: []
        },
        {
            name: "Parameter Editor",
            split: 'none',
            panels: []
        },
        {
            name: "Debug",
            split: 'none',
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