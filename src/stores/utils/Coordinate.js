import { types } from 'mobx-state-tree';

const Coordinate = types
    .model("Coordinate", {
        x: types.optional(types.number, 0),
        y: types.optional(types.number, 0)
    })
    .actions(self => ({
        set: (x, y) => {
            self.x = x;
            self.y = y;
        }
    }))

export default Coordinate;