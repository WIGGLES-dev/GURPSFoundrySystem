import { _Item } from "./item";
import { createPopper } from "@popperjs/core";
import { writable } from "svelte/store";

/**
 * Get an item from an id searching in the following place in this order
 * 1. the contextual entity
 * 2. the Item collection
 * 3. all the actors in the actors collection
 */
export function getItem(id: string, entity?: Actor): _Item {
    let item;
    try {
        if (item = entity?.getOwnedItem(id)) {
            return item as _Item
        }
        if (item = game.items.find((item: Item) => item.id === id)) {
            return item as _Item
        }
        if (item = game.actors.find((actor: Actor) => {
            const item = actor.getOwnedItem(id);
            return Boolean(item);
        })) {
            return item.getOwnedItem(id) as _Item
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
}: CustomUpdate) {
    let oldValue = getProperty(entity.data, path)
    value = coerce(value);
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
        alsoUpdate.forEach((path: paths) => {
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

type primitive = (string | number | boolean) | (string | number | boolean)[]
type objectPrimitive<T extends primitive> = { [key: string]: objectPrimitive<T> }
type paths = string | string[] | { entity: Entity, paths: paths } | { entity: Entity, paths: paths }[]

interface CustomUpdate {
    entity: Entity
    value: primitive | { [key: string]: primitive } | { [key: string]: primitive }[] | objectPrimitive<primitive>
    array: { index: number, property: string } | false
    path: string
    alsoUpdate: paths
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
    const tooltip = document.body.appendChild(document.createElement("div"));
    tooltip.style.zIndex = "100001";
    tooltip.style.display = "none";
    tooltip.innerHTML = parameters.innerHTML;

    const virtualElement = popperVirtualElement();
    let popper = createPopper(virtualElement, tooltip);

    const show = (e: Event) => { tooltip.style.display = "block" };
    const hide = (e: Event) => { tooltip.style.display = "none" };

    node.addEventListener("mouseenter", show);
    node.addEventListener("mouseleave", hide);

    return {
        destroy() {
            popper.destroy();
            node.removeEventListener("mouseenter", show);
            node.removeEventListener("mouseleave", hide);
        },
        update(parameters: any) {
            tooltip.innerHTML = parameters.innerHTML
        }
    }
}

export function createContextMenu(node: HTMLElement, parameters: any) {
    const contextBox = document.body.appendChild(document.createElement("div"));
    contextBox.style.zIndex = "10000";

    const virtualElement = popperVirtualElement();

    let popper = createPopper(virtualElement, contextBox);

    const render = (e: MouseEvent) => {
        menu.menuItems = parameters.menuItems();
        popper.destroy();
        virtualElement.update(e.clientX, e.clientY);
        popper = createPopper(virtualElement, contextBox);
        popper.update().then(state => {
            menu.render(jQuery(contextBox));
        });
    }
    const close = (e: Event) => menu.close();

    let menu = new ContextMenu(
        jQuery(contextBox),
        `[data-contextmenu="${parameters.selector}"]`,
        parameters.menuItems()
    );

    node.addEventListener("contextmenu", render);
    window.addEventListener("click", close, { capture: true });

    return {
        destroy() {
            popper.destroy();
            node.removeEventListener("contextmenu", render);
            window.removeEventListener("click", close);
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

            render(force: boolean = false, options: any) {
                if ((this?.actor?.shouldRender || this?.item?.shouldRender) || !this.rendered) {
                    return super.render(force, options);
                } else {
                    if (this.actor) this.actor.updateGURPS();
                    if (this.item) this.item.actor.updateGURPS();
                }
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
                this.removeReferenceFromParent();
                this._deleteDeep(options);
            }
            return super.delete(options)
        }

        getData(path: string) {
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