import { _ActorSheet, _Actor } from "./sheet";
import { _ItemSheet, _Item } from "./item";
import { customUpdate, getEntity, indexSort } from "./helpers";
import { _ChatMessage, _ChatLog } from "./chat";
import { FoundryEntity } from "./foundry_actor";
import { registerSerializer, GCSJSON } from "g4elogic";
import jsonQuery from "json-query";

import "./styles/global.scss";

Hooks.once('init', init);

async function init() {

    game.gurps4e = {
        customUpdate,
        getEntity,
        indexSort,
        jsonQuery
    }

    registerSerializer(GCSJSON);
    registerSerializer(FoundryEntity);

    CONFIG.Actor.entityClass = _Actor;
    //CONFIG.Actor.sheetClass = _ActorSheet;

    CONFIG.Item.entityClass = _Item;
    //CONFIG.Item.sheetClass = _ItemSheet;

    CONFIG.ChatMessage.entityClass = _ChatMessage;
    CONFIG.ui.chat = _ChatLog;
    CONFIG.Combat.initiative = {
        decimals: 2,
        formula: "@initiative"
    }

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("GURPS", _ActorSheet, { makeDefault: true });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("GURPS", _ItemSheet, { makeDefault: true });
}