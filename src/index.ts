import { _ActorSheet, _Actor } from "./foundry-GURPS/sheet";
import { _ItemSheet, _Item } from "./foundry-GURPS/item";
import { customUpdate, getEntity, indexSort } from "./helpers";
import { CustomChatMessage, CustomChatLog } from "./modules/custom-chat/chat";
import { FoundryEntity } from "./foundry_actor";
import { registerSerializer, GCSJSON } from "g4elogic";
import WelcomeDialog from "@components/WelcomeDialog.svelte";
import jsonQuery from "json-query";

import "./styles/global.scss";

Hooks.once('init', init);
Hooks.once('ready', ready)

function init() {
    game.gurps4e = {
        oldVersion: "1.2.1",
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

    CONFIG.ChatMessage.entityClass = CustomChatMessage;
    CONFIG.ui.chat = CustomChatLog;
    CONFIG.Combat.initiative = {
        decimals: 2,
        formula: "@initiative"
    }

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("GURPS", _ActorSheet, { makeDefault: true });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("GURPS", _ItemSheet, { makeDefault: true });


}

function ready() {
    if (isNewVersion()) {
        alert("New Version");
    }
    new WelcomeDialog({
        target: document.body,
        props: {}
    });
}

export function isNewVersion() {
    return isNewerVersion(game.gurps4e.oldVersion, game.system.data.version)
}