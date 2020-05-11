import {
    observable,
    action,
    decorate
} from 'mobx';
import OperatorStore from '../OperatorStore';
import { createModelSchema } from "serializr"

//----------------------------------------------------------------------
const store = class SinStore extends OperatorStore {
    name = "Sin";
    value = 0;

    update = (v) => {
        return Number(Math.sin(v));
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