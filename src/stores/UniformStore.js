import uuidv1 from 'uuid/v1';
import {
    observable
} from 'mobx';
import {
    primitive,
    identifier,
    serializable,
    reference,
    list,
    object,
    getDefaultModelSchema
} from "serializr";
import ShaderStore from './ShaderStore';
import ParameterStore from './ParameterStore';

export default class UniformStore {
    @serializable(identifier())
    @observable uuid = uuidv1();

    @serializable(primitive())
    @observable name = null;

    @serializable(list(object(ParameterStore.schema)))
    @observable elements = [];

    // see note in constructor
    @observable parent = null;

    constructor(name = "", elements = [], parent) {  
        // getDefaultModelSchema(UniformStore.schema).props["parent"] = reference(ShaderStore.schema)
        
        this.name = name;
        this.elements = elements;
        this.parent = parent;
        this.elements.forEach((e)=>{
            e.parent = this;
        })
    }
}

UniformStore.schema = {
    factory: c => {
        return new UniformStore(
            c.json.name, 
            c.json.elements, 
            c.parentContext.target
        )
    },
    props: getDefaultModelSchema(UniformStore).props
}