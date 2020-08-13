import { _ActorSheet, _Actor } from "./sheet";
import { _ItemSheet, _Item } from "./item";
import { customUpdate, getItem } from "./helpers";
import { _ChatMessage, _ChatLog } from "./chat";
import { config } from "process";

import "./styles/global.scss";

Hooks.once('init', init);

async function init() {
    game.gurps4e = {
        customUpdate,
        getItem
    }

    CONFIG.Actor.entityClass = _Actor;
    CONFIG.Actor.sheetClass = _ActorSheet;

    CONFIG.Item.entityClass = _Item;
    CONFIG.Item.sheetClass = _ItemSheet;

    CONFIG.ChatMessage.entityClass = _ChatMessage;
    CONFIG.ui.chat = _ChatLog;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("GURPS", _ActorSheet, { makeDefault: true });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("GURPS", _ItemSheet, { makeDefault: true });
}