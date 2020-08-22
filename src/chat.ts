import Message from "./svelte/chat/Message.svelte"


export class _ChatMessage extends ChatMessage {

    constructor(data: EntityData<any>, options: any) {
        super(data, options);
    }

    static async create(data: any, options?: any) {
        let message = await super.create(data, options);
        if (message instanceof _ChatMessage) {
            await message.setFlag("GURPS", "roll_data", data.GURPSRollData || {})
            await message.setFlag("GURPS", "type", data.GURPSRollType);
        }
        return message
    }

    rollType() { return this.getFlag("GURPS", "type") }

    render: () => Promise<HTMLElement>
}

//@ts-ignore
export class _ChatLog extends ChatLog {
    static apps: Map<string, any> = new Map()
    _lastId: string
    element: JQuery<HTMLElement>
    rendered: boolean

    constructor(options: any) {
        super(options);
    }

    /**
     * Override Chatlog postOne method to allow svelte to render the chat messages.
     */
    async postOne(message: _ChatMessage, notify: boolean = false) {
        if (!message.visible) return
        if (!this._lastId) this._lastId = message.id
        const target = this.element.find("#chat-log").get(0);
        const app = new Message({
            target,
            props: {
                message
            }
        })
        _ChatLog.apps.set(message.id, app)
        this.scrollBottom();
        if (notify) this.notify(message);
    }

    async _renderBatch(size: number) {
        if (!this.rendered) return;
        //@ts-ignore
        this._state = Application.RENDER_STATES.RENDERING;
        const messages = game.messages.entities as _ChatMessage[];
        const log = this.element.find("#chat-log");

        // Get the index of the last rendered message
        let lastIdx = messages.findIndex(m => m._id === this._lastId);
        lastIdx = lastIdx !== -1 ? lastIdx : messages.length;

        // Get the next batch to render
        let targetIdx = Math.max((lastIdx - size) || 0, 0);
        let m = null;

        console.log(messages, targetIdx, lastIdx, size);

        if (lastIdx !== 0) {
            let html: any[] = [];
            for (let i = targetIdx; i < lastIdx; i++) {
                m = messages[i];
                if (!m.visible) continue;
                try {
                    if (_ChatLog.apps.has(m._id)) {
                        _ChatLog.apps.get(m._id).$set({ message: m })
                    } else {
                        html.push(m)
                    }
                } catch (err) {
                    console.error(`Chat message ${m.id} failed to render.\n${err})`);
                }
            }

            //create the missing applications
            html.forEach(message => {
                const app = new Message({
                    target: log.get(0),
                    props: { message }
                });
                _ChatLog.apps.set(message._id, app);
            })



            this._lastId = messages[targetIdx].id;
        }

        // Restore the rendered state
        //@ts-ignore
        this._state = Application.RENDER_STATES.RENDERED;
    }

    updateMessage(message: _ChatMessage) {
        _ChatLog.apps.get(message.id).$set({ message })
    }

    updateTimestamps() {
        game.messages.entities.forEach(message => {
            _ChatLog.apps.get(message._id).$set({ message });
        });
    }

    scrollBottom: () => void
    notify: (message: ChatMessage) => void
}