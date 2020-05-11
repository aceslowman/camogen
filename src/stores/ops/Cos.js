import {
    observable,
    action,
    decorate
} from 'mobx';
import OperatorStore from '../OperatorStore';
import { createModelSchema } from "serializr"

//----------------------------------------------------------------------
const store = class CosStore extends OperatorStore {
    name = "Cos";
    value = 0;

    update = (v) => {
        return Number(Math.cos(v));
    }
}

decorate(store, {
    value: observable,
    update: action,
});

createModelSchema(store, {
    extends: OperatorStore
});

export default store;