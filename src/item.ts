import { Valor, featuresFromData } from "g4elogic";
import { _Actor } from "./sheet";

export class _ItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(ItemSheet.defaultOptions, {
            classes: ["foundry-valor"],
            template: "systems/GURPS/assets/templates/holder.html",
            width: 1330,
            height: 700,
            submitOnChange: false
        })
    }

    activateListeners(html: JQuery<HTMLElement>) {
        super.activateListeners(html);
        const elem = html.get()[0];
        Valor.mountEditor(elem,
            {
                encapsulate: "shadow",
                entity: featuresFromData([this.item.data.data])[0],
                id: this.item.id,
                styles: ["systems/GURPS/valor.css", "fonts/fontawesome/css/all.min.css"],
            }
        )
    }
    render(...args) {
        if (this.rendered) return
        return super.render(...args);
    }
}

export class _Item extends Item {
    get wrapper() { return featuresFromData([this.data.data])[0] }
    openPDFReference() {
        //@ts-ignore
        const api = ui.PDFoundry;
        if (!api) {
            ui.notifications.warn("You must install and configure the PDFoundry module in order to open PDFReferences");
            return
        }
        let ref = getProperty(this.data, "data.reference");
        try {
            ref = /( )/.test(ref) ? ref.split(" ")[0] : ref;
            ref = /,/.test(ref) ? ref.split(",")[0] : ref;
            ref = /\//.test(ref) ? ref.split("/")[0] : ref;
            const meta = ref.includes(":") ? ref.split(":") : [ref.split(/[0-9]+/)[0], ref.split(/^[^0-9]+/)[1]];
            api.openPDFByCode(meta[0], { page: +meta[1] });
        } catch (err) {
            ui.notifications.info("Unable to open page reference. Make sure that you've properly recorded it in the reference field.");
        }
    }
}