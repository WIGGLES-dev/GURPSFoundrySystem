import { getItem } from "./helpers";
import { _Item } from "./item";

export class GURPSDragDrop {
    static dropOnHotbar() {
        const dragSelector = "";
        const dropSelector = "";
        const permissions = {

        }
        const callbacks = {

        }

        return {
            dragSelector,
            dropSelector,
            permissions,
            callbacks
        }
    }

    static dropOnList(type: string) {
        const dragSelector = `[data-listtype='${type}']`;
        const dropSelector = `[data-listtype='${type}']`;
        const permissions = {
            dragstart: (e: DragEvent) => {
                return true
            },
            drop: (e: DragEvent) => {
                const { origin, target } = getDragContext(e);
                return origin.data.type === target.data.type
            }
        };
        const callbacks = {
            dragstart: (e: DragEvent) => {
                setDragData(e);
            },
            drop: async (e: DragEvent) => {
                GURPSDragDrop.handleDropOnList(e)
            }
        };
        const app = {
            dragSelector,
            dropSelector,
            permissions,
            callbacks
        }
        //@ts-ignore
        return new DragDrop(app)
    }

    /**
        * Logic to handle dropping of items between lists. If types match drop the item to the first matching list in this order
        * 1. Lists on different actors
        * 2. The same actor, which will be a reorder operation
        * 3. Dragging from the Item directory
        */
    private static async handleDropOnList(e: DragEvent) {
        const { origin, target } = getDragContext(e);

        console.log(origin, target);



        if (origin.data.type === target.data.type) {
            if (origin.actor && target.actor && origin.actor !== target.actor) {
                let newItem = await target.actor.createOwnedItem(origin) as _Item;
                newItem.moveToIndex(target.getIndex(), target.data.type);
            } else if (origin.actor && target.actor && origin.actor === target.actor) {
                if (target.getGURPSObject().canContainChildren) {

                } else {
                    origin.moveToIndex(target.getIndex() - 1, target.data.type);
                }
            } else if (target.actor && !origin.actor) {
                // let newItem = await target.actor.createOwnedItem(origin) as _Item;
                // newItem.moveToIndex(target.getIndex(), target.data.type);
            } else {

            }
        }
    }
}

function setDragData(e: DragEvent) {
    const origin = getItem((e.target as HTMLElement).dataset.entityId) as _Item
    const data = {
        id: origin._id,
        index: origin.getIndex(),
        type: origin.data.type
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
}

function getDragContext(e: DragEvent) {
    const target = (e.target as HTMLElement).closest("tr").dataset;
    const origin = JSON.parse(e.dataTransfer.getData("text/plain"));

    return {
        origin: getItem(origin.id) as _Item,
        target: getItem(target.entityId) as _Item
    }
}