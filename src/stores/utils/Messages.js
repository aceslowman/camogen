import { types } from "mobx-state-tree";

const Message = types
    .model('Message', {
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
                type: type,
                message: message
            })
        },

        clear: () => {
            self.log = [];
        }
    }))

export default Messages;