import {
    observable,
    action
} from 'mobx';
import OperatorStore from '../OperatorStore';
import { createModelSchema } from "serializr"

//----------------------------------------------------------------------
const store = class TanStore extends OperatorStore {
    @observable name = "Tan";
    @observable value = 0;

    @action update = (v) => {
        return Number(Math.tan(v));
    }
}

createModelSchema(store, {
    extends: OperatorStore
});

export default store;