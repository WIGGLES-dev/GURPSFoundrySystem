export abstract class ItemContainer extends Item {

    constructor(data: any, options: any) {
        super(data, options);
    }

    getContainedBy(): Item { return this.actor.getOwnedItem(this.getFlag("GURPS", "containedBy")) }

    async setContainedBy(parent: ItemContainer) {
        let isAlreadyChild = parent.getChildren().map(item => item?.id ?? null).includes(this.id);
        if (isAlreadyChild) return this
        await parent.addReferencesToChildren([this._id]);
        await this.setFlag("GURPS", "containedBy", parent.id);
        return this
    }

    getChildren(): Item[] {
        const childIDs: string[] = this.getFlag("GURPS", "children") || [];
        return childIDs.map(id => this.actor.getOwnedItem(id))
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
        const newList = this.getParentChildren()?.filter(item => item && item.id !== this.id).map(item => item.id);
        await this.getContainedBy()?.setFlag("GURPS", "children", duplicate(newList));
        return this
    }

    async setParentOf(child: Item) {
        let isAlreadyParent = this.getChildren().map(item => item?.id ?? null).includes(child.id)
        if (isAlreadyParent) return this
        await child.setFlag("GURPS", "containedBy", this.id);
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
        await this.addReferencesToChildren([item.id]);
        await this.setParentOf(item);
        return item
    }
}