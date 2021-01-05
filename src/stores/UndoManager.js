import { UndoManager } from "mst-middlewares"

export let undoManager = {}
export const setUndoManager = (targetStore) => {
    undoManager = UndoManager.create({}, { targetStore, maxHistoryLength: 10 })
}