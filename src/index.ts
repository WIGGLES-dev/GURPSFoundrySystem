import {
    runStoreAction,
    StoreAction,
    runEntityStoreAction,
    EntityStoreAction,
} from "@datorama/akita";

import { fromEventPattern, fromEvent, Observable } from "rxjs";
import { map, debounceTime, auditTime } from "rxjs/operators";

import "g4elogic/lib/index.css";
import {
    Valor,
    sheetStore,
    sheetQuery,
    Sheet,
    Feature,
    featuresFromData,
    Equipment,
    EmbeddedResource,
    Resource,
    ResourceHooks
} from "g4elogic";

import deepmerge from "deepmerge";
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

import { _ActorSheet, _Actor } from "./sheet";
import { _ItemSheet, _Item } from "./item";

Hooks.once('init', init);
Hooks.once('ready', ready);

class GDialog extends Application {
    data
    constructor(data, options = {}) {
        super(options);
        this.data = data;
    }
    static get defaultOptions() {
        return mergeObject(Dialog.defaultOptions, {
            classes: ["foundry-valor"],
            template: "systems/GURPS/assets/templates/holder.html",
            resizable: true,
            width: 1330,
            height: 700
        })
    }
    activateListeners(html) {
        super.activateListeners(html);
        const elem = html.get()[0];
        if (typeof this.data.render === "function") this.data.render(elem)
    }
    async close(...args) {
        if (this.data.close) this.data.close(this.element[0]);
        //@ts-ignore
        return super.close(...args);
    }
}

function init() {
    game.gurps4e = {
        Valor
    }

    CONFIG.Actor.entityClass = _Actor;
    CONFIG.Item.entityClass = _Item;

    CONFIG.Combat.initiative = {
        decimals: 2,
        formula: "@initiative"
    }

    const deleteActor$ = fromEvent(Hooks, "deleteActor");
    const createActor$ = fromEvent(Hooks, "createActor");
    const updateActor$ = fromEvent(Hooks, "updateActor");
    const deleteItem$ = fromEvent(Hooks, "deleteItem");
    const createItem$ = fromEvent(Hooks, "createItem");
    const updateItem$ = fromEvent(Hooks, "updateItem");
    const deleteOwnedItem$ = fromEvent(Hooks, "deleteOwnedItem")
    const createOwnedItem$ = fromEvent(Hooks, "createOwnedItem")
    const updateOwnedItem$ = fromEvent(Hooks, "updateOwnedItem")

    deleteItem$.subscribe(([item]) => {
        Feature.getCollection(item.type)?.remove(item.id);
    })
    createItem$.subscribe(([item, options]) => {
        const createdOn = new Date().toJSON();
        const data = item.data.data;
        const id = item.id;
        Feature.getCollection(data.type).store.add({
            ...data,
            id,
            createdOn
        });
        item.update({
            data: {
                id,
                createdOn
            }
        })
    });
    updateItem$.pipe(auditTime(3000)).subscribe(([item, changes]) => {
        const wrapper = item.wrapper;
        const timestamp = new Date(changes?.data.lastEdit).getTime();
        const clientTimestamp = wrapper.lastEdit.getTime()
        // if the client timestamp is newer than the update timestamp ignore the update
        if (clientTimestamp > timestamp) return
        Feature.getCollection(item.data?.type).store.update(data => deepmerge(data, changes.data, { arrayMerge: overwriteMerge }))
    });
    deleteActor$.subscribe(([actor]) => {
        sheetStore.remove(actor.id);
    })
    createActor$.subscribe(([actor, options]) => {
        const createdOn = new Date().toJSON();
        const data = actor.data.data;
        const id = actor.id;
        sheetStore.add({
            ...data,
            id,
            createdOn
        });
        actor.update({
            data: {
                id,
                createdOn
            }
        });
    });
    updateActor$.pipe(auditTime(2000)).subscribe(([actor, changes]) => {
        const wrapper = actor.wrapper;
        const timestamp = new Date(changes?.data.lastEdit).getTime();
        const clientTimestamp = wrapper.lastEdit.getTime()
        // if the client timestamp is newer than the update timestamp ignore the update
        if (clientTimestamp > timestamp) return
        sheetStore.update(changes._id, (data) =>
            deepmerge.all([
                data, {
                    embeddedEntities: null
                },
                changes.data
            ],
                { arrayMerge: overwriteMerge })
        );
    });
    createOwnedItem$.subscribe(([parent, doc]) => {
        const type = doc.data.type;
        const data = doc.data;
        const id = doc._id
        data.id = id;
        Feature.getCollection(type).embeddedStore.add(data);
        parent.updateOwnedItem({
            _id: id,
            data: {
                id
            }
        });
    });
    updateOwnedItem$.pipe(auditTime(2000)).subscribe(([parent, doc, changes]) => {
        const wrapper = parent.getOwnedItem(doc._id).wrapper;
        const timestamp = new Date(changes.data?.lastEdit).getTime();
        const clientTimestamp = wrapper.lastEdit.getTime()
        if (clientTimestamp > timestamp) return
        Feature.getCollection(doc.data?.type)?.embeddedStore.update(doc._id, (data) =>
            deepmerge.all([
                data, {
                    embeddedEntities: null,
                },
                changes.data
            ],
                { arrayMerge: overwriteMerge })
        );
    });
    deleteOwnedItem$.subscribe(([parent, doc]) => {
        Feature.getCollection(doc.data.type).embeddedStore.remove(doc._id);
    });

    const beforeAction$ = Valor.on$(ResourceHooks.BeforeExecuteAction);
    const beforeNewId$ = Valor.on$(ResourceHooks.BeforeNewId);
    const beforeEdit$ = Valor.on$(ResourceHooks.BeforeEdit);
    const beforeDelete$ = Valor.on$(ResourceHooks.BeforeDeleteEntity);
    const afterUpdate$ = Valor.on$(ResourceHooks.BeforeUpdateEntity);
    const beforeEmbed$ = Valor.on$(ResourceHooks.BeforeEmbedEntity);
    const afterEmbed$ = Valor.on$(ResourceHooks.AfterEmbedEntity);
    const beforeEmbeddedDelete$ = Valor.on$(ResourceHooks.BeforeDeleteEmbeddedEntity)
    const afterEmbeddedDelete$ = Valor.on$(ResourceHooks.AfterDeleteEmbeddedEntity)
    const afterEmbeddedUpdate$ = Valor.on$(ResourceHooks.BeforeUpdateEmbeddedEntity)
    const beforeDeleteEmbeddedResource$ = Valor.on$(ResourceHooks.BeforeDeleteEmbeddedResource)
    const afterDeleteEmbeddedResource$ = Valor.on$(ResourceHooks.AfterDeleteEmbeddedResource)

    beforeAction$.subscribe(event => {
        const action = event.args[0];
        const resource = event.caller;
        const detail = event.args[1].for;
        switch (action) {
            case "roll":
                switch (resource.type) {
                    case "skill":
                        new Roll(`3d6ms<${resource.level}`).toMessage()
                }
        }
    });
    beforeNewId$.subscribe(event => {
        event.preventDefault();
        event.value = randomID();
    });
    beforeEdit$.subscribe(event => {
        let editor;
        const resource = event.caller;
        event.preventDefault();
        if (resource instanceof EmbeddedResource) {
            new GDialog({
                render: html => {
                    editor = Valor.mountEditor(html,
                        {
                            encapsulate: "shadow",
                            entity: resource,
                            id: resource.id,
                            styles: ["systems/GURPS/valor.css", "fonts/fontawesome/css/all.min.css"],
                        }
                    )
                },
                close: html => {
                    editor?.$destroy();
                }
            }).render(true);
        } else if (resource.embedded) {
            game.actors.get(resource.parent.id)?.getOwnedItem(resource.id)?.sheet?.render(true);
        } else {
            if (game.actors.has(resource.id)) {
                game.actors.get(resource.id)?.sheet?.render(true);
            } else if (game.items.has(resource.id)) {
                game.items.get(resource.id)?.sheet?.render(true);
            }
        }
    });
    afterUpdate$.pipe(auditTime(3000)).subscribe(async (event) => {
        const resource = event.caller;
        await game[resource.type === "sheet" ? "actors" : "items"].get(resource.id)?.update({
            name: (resource.data.keys.profile?.name || "???") || "???",
            img: resource.data.keys.profile?.portrait,
            data: {
                ...resource.data, lastUserEdit: game.user.id
            }
        }, { diff: false });
    });
    afterEmbeddedUpdate$.pipe(auditTime(3000)).subscribe(async (event) => {
        const resource = event.caller;
        await game.actors.get(resource.data.rootEntityId)?.updateOwnedItem({
            name: resource.data.keys.name || "??",
            data: {
                ...resource.data,
                lastUserEdit: game.user.id
            }, _id: resource.id
        }, { diff: false });
    });
    afterEmbed$.subscribe(async (event) => {
        const resource = event.caller;
        const embed = event.value;
        const data = embed.data;
        const store = embed.embeddedStore;
        store.remove(embed.id);
        game.actors.get(resource.id)?.createOwnedItem({
            type: embed.type,
            name: `new ${embed.type}`,
            data
        }, { renderSheet: false });
    });
    beforeEmbeddedDelete$.subscribe(event => {
        const resource = event.caller;
        game.actors.get(resource.data.rootEntityId)?.deleteOwnedItem(resource.id)
    });
    beforeDeleteEmbeddedResource$.subscribe(async (event) => {
        const resource = event.caller;
        const b4Embed = duplicate(resource.parent.data.embeddedEntities);
        delete b4Embed[resource.id];
        const rootId = resource.parent.data.rootEntityId;
        await game.actors.get(rootId)?.getOwnedItem(resource.parent?.id)?.update({
            data: {
                ...resource.parent.data,
                embeddedEntities: null,
            },
        }, { diff: false });
        await game.actors.get(rootId)?.getOwnedItem(resource.parent?.id)?.update({
            data: {
                ...resource.parent.data,
                embeddedEntities: b4Embed,
                lastEdit: new Date().toJSON()
            },
        }, { diff: false });
    });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("GURPS", _ActorSheet, { makeDefault: true });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("GURPS", _ItemSheet, { makeDefault: true });
}

function ready() {
    synchGame();
}

function synchGame() {
    game.actors.forEach(actor => {
        const id = actor.id;
        const data = actor.data.data;
        if (sheetQuery.hasEntity(actor.id)) {
            sheetStore.update(data => ({ ...data, id }));
        } else {
            sheetStore.add({ ...data, id });
        }
        actor.items.forEach(item => {
            const id = item.id;
            const data = item.data.data
            const collection = Feature.getCollection(data.type)
            if (collection.embeddedQuery.hasEntity(item.id)) {
                collection?.store.update(data => ({ ...data, id }))
            } else {
                collection?.embeddedStore.add({ ...data, id })
            }
        })
    });
    game.items.forEach(item => {
        const id = item.id;
        const data = item.data.data;
        const collection = Feature.getCollection(data.type);
        if (collection?.query.hasEntity(id)) {
            collection?.store.update(data => ({ ...data, id }))
        } else {
            collection?.store.add({ ...data, id })
        }
    })
}