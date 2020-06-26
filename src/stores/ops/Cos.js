import {
    observable,
    action
} from 'mobx';
import OperatorStore from '../OperatorStore';
import { createModelSchema } from "serializr"

//----------------------------------------------------------------------
const store = class CosStore extends OperatorStore {
    @observable name = "Cos";
    @observable value = 0;

    @action update = (v) => {
        return Number(Math.cos(v));
    }
}

createModelSchema(store, {
    extends: OperatorStore
});

export default store;