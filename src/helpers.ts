import { createPopper } from "@popperjs/core";
import jsonQuery from "json-query";

export function fixed6(number: string | number) {
    let ifString;
    let ifNumber;
    if (typeof number === "string") {
        ifString = +number
    }
    if (typeof number === "number" && number !== NaN) {
        ifNumber = parseFloat(number.toFixed(3));
    }

    if (ifString === NaN) {
        return number
    } else {
        return ifNumber
    }
}

/**
 * Sorts a list
 * @param list a list of object that must have a listIndex property
 */
export function indexSort(list: any[], property = "listIndex") {
    return list.sort((a, b) => a[property] - b[property])
}

/**
 * Move an index of an array in place to another index, displacing that index and adding blank indexes if the target is outside
 * the length.
 * @param array Array to sort in place.
 * @param from The index you are moving.
 * @param to The index you are targeting.
 */
export function arrayMove(array: any[], from: number, to: number) {
    if (to >= array.length) {
        var k = to - array.length + 1;
        while (k--) {
            array.push(undefined);
        }
    }
    array.splice(to, 0, array.splice(from, 1)[0]);
}

/**
 * Get an item from an id searching in the following place in this order
 * 1. the contextual entity
 * 2. the Item collection
 * 3. all the actors in the actors collection
 */
export function getEntity(id: string, type: string, entity?: Actor): Item {
    let item;
    if (type === "actor") {
        try {
            return game.actors.find(actor => actor.id === id)
        } catch (err) {

        }
    }
    try {
        if (item = entity?.getOwnedItem(id)) {
            return item as Item
        }
        if (item = game.items.find((item: Item) => item.id === id)) {
            return item as Item
        }
        if (item = game.actors.find((actor: Actor) => {
            const item = actor.getOwnedItem(id);
            return Boolean(item);
        })) {
            return item.getOwnedItem(id) as Item
        }
        return null
    } catch (err) {
        console.log(err);
        return null
    }
}

/**
 * A custom update methods for associated svelte components
 * @param CustomUpdate A custom update obect
 */
export async function customUpdate({
    entity,
    value,
    path,
    array = false,
    alsoUpdate,
}: any) {
    value = coerce(value);
    if (/\[(.*?)\]|:/.test(path)) {
        let query = jsonQuery(path, {
            data: entity.data
        });
        if (query.references) {

            if (typeof array.index === "number" && array.property) {
                query.references[0][array.index][array.property] = value;
            } else if (typeof array.index === "number") {
                query.references[0][array.index] = value;
            } else if (array.property) {
                query.references[0][array.property] = value;
            }
        }
        let update = await entity.update({ data: duplicate(entity.data.data) });
        return update
    }

    let oldValue = getProperty(entity.data, path);
    let updates: any = {};
    if (array && Array.isArray(oldValue)) {
        array.property
            ? oldValue[array.index][array.property] = value
            : oldValue[array.index] = value
        updates = { [path]: coerce(oldValue) }
    } else {
        updates = { [path]: value };
    }

    if (Array.isArray(alsoUpdate)) {
        alsoUpdate.forEach((path: string) => {
            if (typeof path === "string") {
                Object.assign(updates, {
                    [path]: value
                });
            }
        });
    }

    let nameIndex = Object.keys(updates)?.indexOf("name");
    if (nameIndex !== -1) {
        const nameValue = updates[Object.keys(updates)[nameIndex]];
        if (!Boolean(nameValue)) {
            updates[Object.keys(updates)[nameIndex]] = "???";
        }
    }
    return entity.update(updates);
}

/**
 * Coerces values to their proper state when pulling data from inputs or entities.
 * @param value value to be coerced
 */
export function coerce(value: any): any {
    let proxy;
    if (typeof value === "number") {
        return value
    } else if (typeof value === "string") {
        const possibleNumber = +value
        if ((typeof possibleNumber === "number" && Boolean(possibleNumber)) || possibleNumber === 0) {
            proxy = possibleNumber;
        } else {
            switch (value.toLowerCase()) {
                case "true":
                    proxy = true;
                    break
                case "false":
                    proxy = false;
                    break
                default: proxy = value;
            }
        }
    } else if (Array.isArray(value)) {
        proxy = duplicate(value.map(value => coerce(value)))
    } else if (typeof value === "object") {
        return duplicate(value);
    }

    return proxy || null
}

export function getValue(entity, path, array: any = false) {
    // console.log(duplicate(entity.data.data), array, path);

    let data;

    if (/\[(.*?)\]|:/.test(path)) {
        data = jsonQuery(path, entity.data).value
    } else {
        data = entity.getProperty ? entity.getProperty(path) : getProperty(entity, path);
    }

    if (array) {
        const data = entity.getProperty(path);
        if (!data) return null
        if (array.property && typeof array.index === "number") {
            return data[array.index][array.property];
        } else if (typeof array.index === "number") {
            return data[array.index]
        } else if (array.property) {
            return data[array.property]
        }
    } else {
        return entity.getProperty(path)
    }

}

function popperVirtualElement() {
    return {
        getBoundingClientRect() { return this.generateGetBoundingClientRect() },
        generateGetBoundingClientRect(x = 0, y = 0) {
            return () => ({
                width: 0,
                height: 0,
                top: y,
                right: x,
                bottom: y,
                left: x,
            })
        },
        update(x: number, y: number) {
            this.getBoundingClientRect = this.generateGetBoundingClientRect(x, y);
        }
    }
}

export function createTooltip(node: HTMLElement, parameters: any) {
    const _document = node.ownerDocument;
    const _window = _document.defaultView;

    const tooltip = document.createElement("div")

    tooltip.style.color = "white";
    tooltip.style.padding = "15px";
    tooltip.style.backgroundColor = "black";
    tooltip.style.borderRadius = "5px";
    tooltip.style.zIndex = "100001";
    tooltip.innerHTML = parameters.tooltipText;

    if (!parameters.tooltipText) tooltip.style.display = "none";

    const virtualElement = popperVirtualElement();

    const show = async (e: MouseEvent) => {
        let state = await popper.update();
        _document.body.appendChild(tooltip);
    };
    const hide = (e: MouseEvent) => {
        tooltip.remove();
    };

    node.addEventListener("mouseenter", show);
    node.addEventListener("mouseleave", hide);

    let popper = createPopper(node, tooltip, {
        placement: "left",
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, 0]
            }
        }]
    });

    return {
        destroy() {
            popper.destroy();
            node.removeEventListener("mouseenter", show);
            node.removeEventListener("mouseleave", hide);
            tooltip.remove();
        },
        update(parameters: any) {
            tooltip.innerHTML = parameters.tooltipText
        }
    }
}

export function createContextMenu(node: HTMLElement, { menuItems, selector, event = "contextmenu" }) {
    const _document = node.ownerDocument;
    const _window = _document.defaultView;

    const contextBox = document.createElement("div");
    contextBox.style.zIndex = "10000";

    const virtualElement = popperVirtualElement();

    let popper = createPopper(virtualElement, contextBox);

    const render = async (e: MouseEvent) => {
        _document.body.appendChild(contextBox);
        menu.menuItems = menuItems();
        popper.destroy();
        virtualElement.update(e.clientX, e.clientY);
        popper = createPopper(virtualElement, contextBox);
        await popper.update();
        menu.render(jQuery(contextBox));
    }

    const close = async (e: Event) => {
        await menu.close();
        contextBox.remove();
    };

    let menu = new ContextMenu(
        jQuery(contextBox),
        `[data-contextmenu="${selector}"]`,
        menuItems()
    );

    node.addEventListener(event, render);
    _window.addEventListener("click", close, { capture: true });

    return {
        destroy() {
            popper.destroy();
            node.removeEventListener("contextmenu", render);
            _window.removeEventListener("click", close);
        },
        update(parameters: any) {
            menu.menuItems = parameters.menuItems();
        }
    }
}

export function svelte(app: any) {
    return function (constructor: new () => Application): any {
        return class extends constructor {
            app: any
            actor: any
            item: any
            entity: string
            _entity: any;

            constructor(...args: any[]) {
                //@ts-ignore
                super(...args);
            }

            async _renderInner(data: any, options: any) {
                //@ts-ignore
                let html = await super._renderInner(data, options) as JQuery<HTMLElement>;
                this.app = new app({
                    target: html.get(0),
                    props: {
                        entity: this?.item?._entity ?? this?.actor?._entity ?? null,
                        GURPS: this?.actor?.GURPS ?? null
                    }
                })
                return html as JQuery<HTMLElement>
            }

            _getHeaderButtons() {
                return [].concat(this.customHeaderButtons(), super._getHeaderButtons())
            }

            customHeaderButtons(): any[] {
                try {
                    //@ts-ignore
                    return super.customHeaderButtons()
                } catch (err) {
                    return []
                }
            }

            render(force: boolean = false, options: any) {
                if (!this.rendered) return super.render(force, options);

                //@ts-ignore
                this.element.find(".window-title").text(this.title);

                const actor = this.actor || this.item?.actor;
                const entity = (this.item || this.actor);
                entity._entity.set(entity);
                actor?.updateGURPS();
                this.app.$set({ entity: entity._entity });

                Hooks.call(`render${this.options.baseApplication}`, this, this.element, {});

                const sheet = (this.element as JQuery<HTMLElement>).get(0);
                //Hotfix for Popout!
                try {
                    sheet.querySelector(".window-header > a.popout").remove();
                } catch (err) {

                }
            }

            updateStores() {

            }
        }
    }
}

export function injectHelpers(constructor: any): any {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
        }

        async delete(options: any) {
            if (this.entity === "Item") {
                await this.removeReferenceFromParent();
                this._deleteDeep(options);
            }
            let deleted = await super.delete(options);
            return deleted
        }

        getProperty(path: string) {
            if (/\[(.*?)\]|:/.test(path)) {
                return jsonQuery(path, { data: this.data }).value
            }
            return getProperty(this.data, path)
        }

        enrichContent(content: string, { secrets = true, entities = true, links = true, rolls = true }) {
            return TextEditor.enrichHTML(content, {
                secrets,
                entities,
                links,
                rolls
            })
        }
    }
}