import { getEntity } from "./helpers";
import { _Item } from "./item";

import { setContainedBy, getIndex, getContainedBy, fixIndexes } from "./container";

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
                const { origin, target } = getDragContext(e, "item");
                return origin.data.type === target.data.type || type.includes(origin.data.type)
            }
        };
        const callbacks = {
            dragstart: (e: DragEvent) => {
                setDragData(e);
            },
            drop: async (e: DragEvent) => {
                GURPSDragDrop.handleDropOnList(e, type)
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
    private static async handleDropOnList(e: DragEvent, type: string) {
        const { origin, target, targetI } = getDragContext(e, "item");

        const tContainedBy = getContainedBy(target);

        if (/_container/.test(target.getProperty("data.type"))) {
            if (!/equipment/.test(target.getProperty("data.type"))) return
            await setContainedBy(origin, target);
            await origin.moveToIndex(origin.getIndex() - 1, targetI, type.split(" "));
            return
        }
        if (tContainedBy) {
            await setContainedBy(origin, tContainedBy);
            await origin.moveToIndex(origin.getIndex() - 1, targetI, type.split(" "));
            return
        }
        if (origin.actor && target.actor && origin.actor !== target.actor) {
            let newItem = await target.actor.createOwnedItem(origin) as _Item;
            (getEntity(newItem._id, "item") as _Item).moveToIndex(origin.getIndex() - 1, target.getIndex() - 1, type.split(" "));
        } else if (origin.actor && target.actor && origin.actor === target.actor) {
            if (target.getGURPSObject().canContainChildren) {

            } else {
                origin.moveToIndex(origin.getIndex() - 1, target.getIndex() - 1, type.split(" "));
            }
        } else if (target.actor && !origin.actor) {
            e.stopImmediatePropagation();
            let newItem = await target.actor.createOwnedItem(origin) as _Item;
            (getEntity(newItem._id, "item") as _Item).moveToIndex(origin.getIndex() - 1, target.getIndex() - 1, type.split(" "));
        }
    }
}

export function setDragData(e: DragEvent) {
    const origin = getEntity((e.target as HTMLElement).dataset.entityId, "item") as _Item
    const data = {
        id: origin._id,
        index: origin.getIndex(),
        type: origin.data.type
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
}

export function getDragContext(e: DragEvent, type: string) {
    const tr = (e.target as HTMLElement).closest("tr");
    const target = tr?.dataset ?? null;
    const origin = JSON.parse(e.dataTransfer.getData("text/plain"));

    return {
        origin: getEntity(origin?.id, type) as _Item,
        get originI() { return getIndex(this.origin) },
        target: getEntity(target?.entityId, type) as _Item,
        targetI: tr?.rowIndex ?? null
    }
}