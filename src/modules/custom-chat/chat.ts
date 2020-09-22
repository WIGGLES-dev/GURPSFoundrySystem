import Message from "./components/Message.svelte"
import SvelteChatLog from "./components/ChatLog.svelte";
import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";
import { tick } from "svelte";

export function init() {

}

export class CustomChatMessage extends ChatMessage {
    constructor(data: EntityData<any>, options: any) {
        super(data, options);
    }

    messageType() { return this.getFlag("GURPS", "message_type") }
    messageData() { return this.getFlag("GURPS", "message_data") }
    isOOC() { return this.user.name === this.alias }
    isDiceRoll() { return this.roll || this.getFlag("GURPS", "is_roll") === true }
    isTimer() { return this.getFlag("GURPS", "is_timer") === true }
    render: () => Promise<HTMLElement>
}

//@ts-ignore
export class CustomChatLog extends ChatLog {
    svelteApp: SvelteChatLog
    _lastId: string
    element: JQuery<HTMLElement>
    rendered: boolean

    constructor(options: any) {
        super(options);
    }

    updateSvelte() {
        this._renderBatch(100)
    }

    async _renderInner(data) {
        // return super._renderInner(data);
        let html = await super._renderInner(data) as JQuery<HTMLElement>;
        this.svelteApp = new SvelteChatLog({
            target: html.get(0),
            props: {
                vanilla: game.settings.get("GURPS", "custom_chat"),
                ChatLog: this,
            },
        });
        return jQuery(this.svelteApp.chatPanel)
    }

    /**
     * Override Chatlog postOne method to allow svelte to render the chat messages.
     */
    async postOne(message: CustomChatMessage, notify: boolean = false) {
        if (!message.visible) return
        if (!this._lastId) this._lastId = message.id

        this.svelteApp.$set({ messages: [...this.svelteApp.messages, message] });

        setTimeout(() => {
            this.scrollBottom();
        }, 100);

        if (notify) this.notify(message);
        return message
    }

    async _renderBatch(size: number) {
        if (!this.rendered) return;
        //@ts-ignore
        this._state = Application.RENDER_STATES.RENDERING;
        const messages = game.messages.entities as CustomChatMessage[];
        const log = this.element.find("#chat-log");

        // Get the index of the last rendered message
        let lastIdx = messages.findIndex(m => m._id === this._lastId);
        lastIdx = lastIdx !== -1 ? lastIdx : messages.length;

        // Get the next batch to render
        let targetIdx = Math.max((lastIdx - size) || 0, 0);
        let m = null;

        if (lastIdx !== 0) {
            let html: any[] = [];
            for (let i = targetIdx; i < lastIdx; i++) {
                m = messages[i];
                if (!m.visible) continue;
                try {
                    html.push(m)
                } catch (err) {
                    console.error(`Chat message ${m.id} failed to render.\n${err})`);
                }
            }

            this.svelteApp.$set({ messages: html });

            this._lastId = messages[targetIdx].id;
        }

        // Restore the rendered state
        //@ts-ignore
        this._state = Application.RENDER_STATES.RENDERED;
    }

    updateMessage(message: CustomChatMessage, notify = false) {
        return super.updateMessage(message, notify);
    }

    updateTimestamps() {
        return super.updateTimestamps();
    }

    scrollBottom: () => void
    notify: (message: ChatMessage) => void
}