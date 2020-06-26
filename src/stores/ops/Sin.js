import {
    observable,
    action
} from 'mobx';
import OperatorStore from '../OperatorStore';
import { createModelSchema } from "serializr"

//----------------------------------------------------------------------
const store = class SinStore extends OperatorStore {
    @observable name = "Sin";
    @observable value = 0;

    @action update = (v) => {
        return Number(Math.sin(v));
    }
}

createModelSchema(store, {
    extends: OperatorStore
});

export default store;