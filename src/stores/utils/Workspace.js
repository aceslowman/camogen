import { types, applySnapshot } from 'mobx-state-tree';

const Workspace = types
    .model("Workspace", {
        panels: types.array(types.string)
    })
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
    panels: [
        "Help",
        "Shader Graph",
        "Shader Controls"
    ]
}

const DefaultShaderEdit = {
    panels: [
        "Shader Editor",
        "Shader Graph"   
    ]
}

const DefaultShaderControl = {
    panels: [
        "Shader Graph",
        "Shader Controls"
    ]
}

const DefaultDebug = {
    panels: [
        "Debug",
        "Shader Graph",
        "Messages"
    ]
}

export {
    DefaultWelcome,
    DefaultShaderEdit,
    DefaultShaderControl,
    DefaultDebug
}