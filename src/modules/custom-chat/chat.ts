import Message from "./svelte/Message.svelte"
import SvelteChatLog from "./svelte/ChatLog.svelte";
import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";
import { svelte } from "helpers";


export class CustomChatMessage extends ChatMessage {
    constructor(data: EntityData<any>, options: any) {
        super(data, options);
    }

    static async create(data: any, options?: any) {
        let message = await super.create(data, options);
        if (message instanceof CustomChatMessage) {
            // if (data.roll instanceof SuccessRoll) {
            //     await message.setFlag("GURPS", "type", "Skill");
            //     await message.setFlag("GURPS", "roll_data", data.GURPSRollData || {})
            // }
            await message.setFlag("GURPS", "roll_data", data.GURPSRollData || {})
            await message.setFlag("GURPS", "type", data.GURPSRollType);
        }
        return message
    }

    rollType() { return this.getFlag("GURPS", "type") }

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

    async _renderInner(data) {
        // return super._renderInner(data);
        let html = await super._renderInner(data) as JQuery<HTMLElement>;
        this.svelteApp = new SvelteChatLog({
            target: html.get(0),
            props: {
                ChatLog: this,
            },
        });
        return jQuery(this.svelteApp.chatPanel)
    }

    // async _render(...args) {
    //     if (this.rendered) return
    //     super._render(...args)
    // }

    /**
     * Override Chatlog postOne method to allow svelte to render the chat messages.
     */
    async postOne(message: CustomChatMessage, notify: boolean = false) {
        if (!message.visible) return
        if (!this._lastId) this._lastId = message.id
        this.svelteApp.$set({ messages: [...this.svelteApp.messages, message] });
        this.scrollBottom();
        if (notify) this.notify(message);
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

            this.svelteApp.$set({ ChatLog: this, messages: html });

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