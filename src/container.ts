import { _Actor } from "./sheet";

export abstract class ItemContainer extends Item {

    constructor(data: any, options: any) {
        super(data, options);
    }

    getContainedBy(): ItemContainer { return this.actor.getOwnedItem(this.getFlag("GURPS", "contained_by")) as ItemContainer }
    allDescendants(collection = new Set()) {
        this.getChildren().forEach(descendant => {
            descendant.allDescendants(collection);
        });
        return collection
    }
    allAncestors(collection = new Set()) {
        const containedBy = this.getContainedBy();
        if (!containedBy) return collection;
        collection.add(containedBy);
        containedBy.allAncestors(collection);
        return collection
    }
    async setContainedBy(parent: ItemContainer) {
        let containedBy = this.getContainedBy();
        let isAlreadyChild = parent.getChildren().map(item => item?.id ?? null).includes(this.id);
        if (parent.actor && parent.actor !== this.actor) {
            let toTransfer = Array.from(this.allDescendants().add(this));
            await parent.actor.createEmbeddedEntity("OwnedItem", duplicate(toTransfer.map((item: any) => item.data)));
            return this
        }
        if (this === parent) return this;
        if (parent.allAncestors().has(this)) {
            return this
        }
        if (isAlreadyChild) return this;
        if (containedBy) {
            this.removeReferenceFromParent();
        }
        await parent.addReferencesToChildren([this.id]);
        await this.setFlag("GURPS", "contained_by", parent.id);
        return this
    }

    getChildren(): ItemContainer[] {
        const childIDs: string[] = this.getFlag("GURPS", "children") || [];
        return childIDs.map(id => this.actor.getOwnedItem(id) as ItemContainer)
    }

    private async _deleteDeep(options?: object) {
        let targetDeletes = this.getChildren()?.map(child => child._id) ?? [];
        this.getChildren()?.forEach(child => {
            try {
                if (child instanceof ItemContainer) child._deleteDeep();
            } catch (err) {
                this.clearAllChildren();
            }
        });
        //@ts-ignore
        return this.actor.deleteEmbeddedEntity("OwnedItem", targetDeletes, options);
    }

    private async clearAllChildren() {
        await this.setFlag("GURPS", "children", []);
        return this
    }

    private getParentChildren() { return (this.getContainedBy()?.getFlag("GURPS", "children") || []).map(id => this.actor.getOwnedItem(id)) }

    async removeReferenceFromParent() {
        const containedBy = this.getContainedBy();
        if (!containedBy) return this
        let newReferences = containedBy.getFlag("GURPS", "children")?.filter(id => id !== this.id);
        await containedBy.setFlag("GURPS", "children", duplicate(newReferences));
        return this
    }

    async setParentOf(child: Item) {
        let isAlreadyParent = this.getChildren().map(item => item?.id ?? null).includes(child.id)
        if (isAlreadyParent) return this
        await child.setFlag("GURPS", "contained_by", this.id);
        return this
    }

    async addReferencesToChildren(references: string[]) {
        const children = this.getFlag("GURPS", "children") || [];
        console.log(children, references);
        let newReferences = [].concat(children, references).reduce((prev, cur) => {
            return !prev.includes(cur) ? [...prev, cur] : prev
        }, []);
        console.log(newReferences);
        await this.setFlag("GURPS", "children", duplicate(newReferences));
        return this
    }

    async addChild(child: Item) {
        let item = await this.actor.createOwnedItem(child);
        await this.addReferencesToChildren([item.id]);
        await this.setParentOf(item);
        return item
    }

    isValid({ fix = true } = {}) {
        let thisAllGood = this.parentHasReferences({ fix });
        let childrenAllGood = this.allChildrenHaveReferences({ fix });

        if (fix) {
            if (!thisAllGood) {

            }
            if (!childrenAllGood) {

            }
        }

        return thisAllGood && childrenAllGood
    }

    private parentHasReferences({ fix = true }) {
        let containedBy = this.getContainedBy();
        if (fix) {

        }
        if (!containedBy) return true
    }

    private allChildrenHaveReferences({ fix = true }) {
        let children = this.getChildren();
        let corrupted = [];
        children.forEach(child => {
            corrupted = child.getContainedBy() !== this ? [...corrupted, child] : corrupted;
        });
        if (fix) {

        }
        return !Boolean(corrupted.length)
    }
}

export function normalizeInventory(actor: _Actor) {
    let items = actor.ownedItemsByType("equipment");
    items.forEach(async item => {
        if (!item.isValid()) {
            await item.getContainedBy().addReferencesToChildren([this.id]);
        }
    });
}