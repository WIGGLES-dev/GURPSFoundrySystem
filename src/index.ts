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

    game.settings.register("GURPS", "custom_chat", {
        name: "Custom Chat Switch",
        hint: "Turns on or off custom chat",
        scope: "client",
        config: true,
        type: Boolean,
        choices: {
            "on": "Custom Chat On",
            "off": "Custom Chat Off"
        },
        default: "on",
        //@ts-ignore
        onChange: (value) => ui.chat.svelteApp.$set({ vanilla: !value })
    });
}

function ready() {
    if (localStorage.getItem("show_welcome_dialog") !== "false") {

    }

    new WelcomeDialog({
        target: document.body,
        props: {}
    });
}

export function isNewVersion() {
    return isNewerVersion(game.gurps4e.oldVersion, game.system.data.version)
}