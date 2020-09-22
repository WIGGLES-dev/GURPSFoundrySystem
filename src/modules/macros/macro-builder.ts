import jsonQuery from "json-query"

abstract class MacroBuilder {
    steps: []

    constructor() {

    }

    addStep() { }

    create(): Macro {
        return null
    }
}