import { _ActorSheet, _Actor } from "./sheet";
import { _ItemSheet, _Item } from "./item";
import { customUpdate, getItem, indexSort } from "./helpers";
import { _ChatMessage, _ChatLog } from "./chat";
import { FoundryEntity } from "./foundry_actor";
import { registerSerializer, GCSJSON } from "g4elogic"

import "./styles/global.scss";

Hooks.once('init', init);

async function init() {
    
    game.gurps4e = {
        customUpdate,
        getItem,
        indexSort
    }

    registerSerializer(GCSJSON);
    registerSerializer(FoundryEntity);


    CONFIG.Actor.entityClass = _Actor;
    //CONFIG.Actor.sheetClass = _ActorSheet;

    CONFIG.Item.entityClass = _Item;
    //CONFIG.Item.sheetClass = _ItemSheet;

    CONFIG.ChatMessage.entityClass = _ChatMessage;
    CONFIG.ui.chat = _ChatLog;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("GURPS", _ActorSheet, { makeDefault: true });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("GURPS", _ItemSheet, { makeDefault: true });
}