import { _Actor } from "./sheet";

export abstract class ItemContainer extends Item {
    actor: _Actor

    constructor(data: any, options: any) {
        super(data, options);
    }

    getContainedBy(): Item {
        const id = this.getFlag("GURPS", "containedBy");
        console.log(id);
        if (id) {
            const item = this.actor.getOwnedItem(id)
            if (item) return item
        }
        return null
    }

    async setContainedBy(parent: ItemContainer | Item | string) {
        if (parent instanceof ItemContainer) {
            await parent.addReferencesToChildren([this._id]);
            return this.setFlag("GURPS", "containedBy", parent.id || parent._id);
        } else if (typeof parent === "string") {
            return this.setFlag("GURPS", "containedBy", parent);
        }
    }

    getChildren(): Item[] {
        const childIDs = this.getFlag("GURPS", "children");
        if (Array.isArray(childIDs)) {
            return childIDs.map(id => this.actor.getOwnedItem(id))
        } else {
            return null
        }
    }

    async deleteDeep(options?: object) {
        await this.removeReferenceFromParent();
        await this._deleteDeep(options);
        return this.delete(options)
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
        return ItemContainer.delete(targetDeletes, options);
    }

    private clearAllChildren() {
        this.setFlag("GURPS", "children", [])
    }

    private getParentChildren() {
        const children = this.getContainedBy()?.getFlag("GURPS", "children");
        console.log(children);
        if (Array.isArray(children)) {
            return children.map(id => this.actor.getOwnedItem(id))
        } else {
            return []
        }
    }

    async removeReferenceFromParent() {
        const newList = this.getParentChildren()?.map((item: Item) => item.id).filter(id => id !== this.id);
        this.getContainedBy()?.setFlag("GURPS", "children", newList);
        return this
    }

    async setParentOf(child: ItemContainer | Item | string) {
        console.log(child);
        if (child instanceof ItemContainer) {
            child.setFlag("GURPS", "containedBy", this.id);
        } else if (typeof child === "string") {
            this.actor.getOwnedItem(child).setFlag("GURPS", "containedBy", this.id)
        }
        return this
    }

    async addReferencesToChildren(references: string[]) {
        const children = this.getFlag("GURPS", "children");
        if (Array.isArray(children)) {
            await this.setFlag("GURPS", "children", [].concat(children, references));
        } else {
            await this.setFlag("GURPS", "children", references);
        }
        return this
    }

    async addChild(child: Item) {
        let item = await this.actor.createOwnedItem(child);
        this.addReferencesToChildren([item.id || item._id]);
        this.setParentOf(item.id || item._id);
        return item
    }
}