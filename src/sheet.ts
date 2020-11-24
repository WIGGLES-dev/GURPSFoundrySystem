import { Valor, FeatureRepo, SheetRepo, Sheet } from "g4elogic";
import { _Item } from "./item";

export class _ActorSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(ActorSheet.defaultOptions, {
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
        Valor.mount(elem, {
            id: this.actor.id,
            encapsulate: "frame",
            styles: ["systems/GURPS/valor.css", "fonts/fontawesome/css/all.min.css"],
        })
    }

    render(...args) {
        if (this.rendered) return
        return super.render(...args);
    }
}

export class _Actor extends Actor {
    get wrapper() { return new Sheet(this.id) }
    prepareData() {
        super.prepareData()
        this.determineInitiative();
        this.setPools();
    }

    private determineInitiative() {
        const speed = 0;
        const dexterity = 0;
        const health = 0;

        mergeObject(this.data.data, {
            initiative: speed + (dexterity + health) / 4
        });
    }

    private setPools() {
        let HT
        let fp
        let fpValue
        let ST
        let hp
        let hpValue

        if (this.data.type === "character") {
            mergeObject(this.data.data, {
                pools: {
                    fatigue_points: {
                        max: HT + fp,
                        value: fpValue
                    },
                    hit_points: {
                        max: ST + hp,
                        value: hpValue
                    }
                }
            });
        }
    }
}