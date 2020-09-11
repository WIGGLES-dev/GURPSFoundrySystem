import { arrayMove, ownedItemsByType } from "./helpers";

export function getContainedBy(item: Item) {
    return item.actor.getOwnedItem(item.getFlag("GURPS", "contained_by"))
}

export function getChildren(item: Item): Item[] {
    const childIDs: string[] = item.getFlag("GURPS", "children") || [];
    return childIDs.map(id => item.actor.getOwnedItem(id)) as Item[]
}

export function allAncestors(item: Item, collection = new Set()) {
    const containedBy = getContainedBy(item);
    if (!containedBy) return collection
    collection.add(containedBy);
    allAncestors(containedBy, collection);
    return collection
}

export function allDescendants(item: Item, collection = new Set()) {
    getChildren(item).forEach((child: Item) => {
        allDescendants(child, collection);
    });
    return collection
}

export async function setContainedBy(child: Item, parent: Item) {
    if (!parent) {
        removeReferenceFromParent(child);
        return
    }
    let containedBy = getContainedBy(child);
    let isAlreadyChild = getChildren(parent).map(item => item?.id ?? null).includes(child.id);
    if (parent.actor && parent.actor !== child.actor) {
        let toTransfer = Array.from(allDescendants(child).add(child));
        await parent.actor.createEmbeddedEntity("OwnedItem", duplicate(toTransfer.map((item: any) => item.data)));
        return
    }
    if (child === parent) return this;
    if (allAncestors(parent).has(child)) return child;
    if (isAlreadyChild) {
        setContainedBy(child, getContainedBy(parent));
        return child
    }
    if (containedBy) removeReferenceFromParent(child);
    await addReferencesToChildren(parent, [child.id]);
    await child.setFlag("GURPS", "contained_by", parent.id);
    return child
}

export async function removeReferenceFromParent(item: Item) {
    const containedBy = getContainedBy(item);
    if (!containedBy) return item
    let newReferences = containedBy.getFlag("GURPS", "children")?.filter(id => id !== item.id);
    await containedBy.setFlag("GURPS", "children", duplicate(newReferences));
    await item.setFlag("GURPS", "contained_by", null);
    return item
}

export async function addReferencesToChildren(item: Item, references: string[]) {
    const children = item.getFlag("GURPS", "children") || [];
    let newReferences = [].concat(children, references).reduce((prev, cur) => {
        return !prev.includes(cur) ? [...prev, cur] : prev
    }, []);
    await item.setFlag("GURPS", "children", duplicate(newReferences));
    return item
}

export async function deleteDeep(item: Item, options: any) {
    if (!item.actor) return item
    let targetDeletes = getChildren(item)?.map(child => child._id) ?? [];
    getChildren(item)?.forEach(child => {
        try {
            deleteDeep(child, options);
        } catch (err) {
            clearAllChildren(item);
        }
    });
    return item.actor.deleteEmbeddedEntity("OwnedItem", targetDeletes, options);
}

export async function clearAllChildren(item: Item) {
    await item.setFlag("GURPS", "children", []);
    return item
}

export async function setIndex(item: Item, index: number) {
    await item.setFlag("GURPS", "index", index);
    return item
}

export function getIndex(item: Item) {
    return item.getFlag("GURPS", "index") as number
}

export async function fixIndexes(actor: Actor, types: string[]) {
    let array = ownedItemsByType(actor, ...types);
    let newArray = array.sort((a, b) => getIndex(a) - getIndex(b));

    let count = 0;
    const updates = newArray.map((item, i) => {
        if (item) {
            return {
                _id: item.id,
                flags: {
                    "GURPS": {
                        "index": count++ + 1
                    }
                }
            }
        }
    });
    return actor.updateEmbeddedEntity("OwnedItem", updates);
}

export async function moveToIndex(item: Item, from: number, to: number, types: string[]) {
    const actor = item.actor;
    if (!actor) return item
    await fixIndexes(actor, types);
    let array = ownedItemsByType(item.actor, ...types).sort((a, b) => getIndex(a) - getIndex(b));
    arrayMove(array, from, to);

    let count = 0;
    const updates = array.map((item, i) => {
        if (item) {
            return {
                _id: item.id,
                flags: {
                    "GURPS": {
                        "index": count++ + 1
                    }
                }
            }
        }
    });
    return actor.updateEmbeddedEntity("OwnedItem", updates)
}

export function nest(actor: Actor, types: string[], nesting?: Item[]): Item[] {
    let array: Item[] = nesting || ownedItemsByType(actor, ...types);
    return array.reduce((prev, cur) => {
        const containedBy = getContainedBy(cur);
        if (containedBy) {
            return prev
        }
        return [...prev, nest(actor, types, getChildren(cur))];
    }, []);
}

