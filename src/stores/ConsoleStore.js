import { observable, action } from 'mobx';
// import * as NODES from './stores';

export default class ConsoleStore {
    @observable consoleText = 'camogen';
    
    @observable suggestText = '';

    @action consoleChanged() {
        switch (this.consoleText) {
            case 'clear':
                this.targets = [];
                this.consoleText = "";
                this.consoleStyle = {
                    color: 'black'
                };
                break;
            default:
                this.consoleText = "";
                this.suggestText = "";
                break;
        }
    }

    @action suggest(text) {
        // const regex = new RegExp("^" + text + ".*", "g");
        // const matched = NODES.shader_types.filter(t => t.match(regex));

        // this.suggestText = matched.length && text ? matched[0] : '';
    }
}