class _TextEditor extends TextEditor {
    constructor() {
        super();
    }

    static enrichHTML(content: string, { secrets = false, entities = true, links = true, rolls = true, rollData = null } = {}) {
        return super.enrichHTML(content, { secrets, entities, links, rolls, rollData });
    }
}

export async function asyncEnrichHTML(content: string, rollData: any) {
    return TextEditor.enrichHTML(content, { secrets: true, entities: true, links: true, rolls: true, rollData });
}

class WebWorker {
    static resolves: any = {}
    static rejects: any = {}
    static globalMsgId = 0
    worker: Worker
    constructor() {
        this.worker = new Worker('./worker.js');
        this.worker.onmessage = WebWorker.handleMsg;
    }
    static handleMsg(msg: any) {
        const { id, err, payload } = msg.data;
        if (payload) {
            const resolve = WebWorker.resolves[id]
            if (resolve) {
                resolve(payload);
            }
        } else {
            const reject = WebWorker.rejects[id];
            if (reject) {
                if (err) {
                    reject(err)
                } else {
                    reject("Got nothin")
                }
            }
        }
        delete WebWorker.resolves[id];
        delete WebWorker.rejects[id];
    }
    static sendMsg(payload: any, worker: Worker) {
        const msgId = ++WebWorker.globalMsgId
        const msg = {
            id: msgId,
            payload
        }
        return new Promise((resolve, reject) => {
            WebWorker.resolves[msgId] = resolve;
            WebWorker.rejects[msgId] = reject;
            worker.postMessage(msg)
        });
    }
}