import { types } from "mobx-state-tree";

const DatePrimitive = types.custom({
    name: "Date",
    fromSnapshot(value) {
        return new Date(value)
    },
    toSnapshot(value) {
        return value.toJSON();
    },
    isTargetType(value) {
        return value instanceof Date
    },
    getValidationMessage() {
        return null;
    }
});

const Message = types
    .model('Message', {
        timestamp: DatePrimitive,
        type: types.string,
        message: types.string
    })

const Messages = types
    .model('Messages',{
        log: types.array(Message)
    })
    .actions(self => ({
        afterCreate: () => {
            console.defaultError = console.error.bind(console);
            console.errors = [];
            console.error = function () {
                // default &  console.error()
                console.defaultError.apply(console, arguments);
                // new & array data
                // console.errors.push(Array.from(arguments));
                if (arguments[0].message) {
                    self.postMessage('error', arguments[0].message);
                } else if (arguments[0]) {
                    self.postMessage('error', arguments[0]);
                }
            };
        },

        postMessage: (type, message) => {
            self.log.push({
                timestamp: Date.now(),
                type: type,
                message: message
            })
        },

        clear: () => {
            self.log = [];
        }
    }))

export default Messages;