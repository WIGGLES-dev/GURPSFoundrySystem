class SvelteSheet extends BaseEntitySheet {
    sheet: any
    data: any

    constructor(data: {}, ...args: any) {
        super(...args);
        this.data = data
    }

    static get defaultOptions() {
        return mergeObject(ActorSheet.defaultOptions, {

        })
    }
    activateListeners(html: JQuery<HTMLElement>) {
        if (!this.rendered) {

        }
    }
    render(forced = false, options: {}) {
        if (this.rendered) {

        }
        return super.render(forced, options)
    }
    submit(): null {
        return null
    }
}