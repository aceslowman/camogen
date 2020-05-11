import {
    observable,
    action,
    decorate
} from 'mobx';
import OperatorStore from '../OperatorStore';
import { createModelSchema } from "serializr"

//----------------------------------------------------------------------
const store = class TanStore extends OperatorStore {
    name = "Tan";
    value = 0;

    update = (v) => {
        return Number(Math.tan(v));
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