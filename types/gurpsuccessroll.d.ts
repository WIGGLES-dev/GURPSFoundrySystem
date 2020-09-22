declare module "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll" {
    /**
    * Class representing a success roll.
    *
    * @extends AbstractRoll
    * @hideconstructor
    * @inheritDoc
    * @public
    */
    export default class SuccessRoll {
        /**
         * Level of the trait being rolled against. This does not include any modifiers supplied to the roll.
         *
         * @public
         * @type {Number}
         */
        level: number
        /**
         * Name of the trait being rolled against
         *
         * @public
         * @type {String|null}
         */
        trait: string

        /**
         * Modifiers applied to the success roll
         *
         * @public
         * @type {String|null}
         */
        modifiers: string

        /**
         * Effective level of the trait being rolled against after taking into account all of the modifiers
         *
         * @public
         * @type {Number}
         */
        evaluatedLevel: number

        /**
         * Null if the roll hasn't been made yet.
         *
         * @public
         * @type {boolean|null}
         */
        isSuccess: number

        /**
         * Null if the roll hasn't been made yet.
         *
         * @public
         * @type {Number|null}
         */
        marginOfSuccess: number

        /**
         * Null if the roll hasn't been made yet.
         *
         * @public
         * @type {null|boolean}
         */
        isCritFail: boolean

        /**
         * Null if the roll hasn't been made yet.
         *
         * @public
         * @type {null|boolean}
         */
        isCritSuccess: boolean

        /**
         * @private
         * @param {Number} level Level of the trait to roll against
         * @param {String} trait Name of the trait being rolled
         * @param {String} modifiers Various +/- modifiers to apply to the roll
         * @param {String} formula Success roll formula to be parsed, this can be passed instead of the previous three parameters
         */

        constructor({ level, trait, modifiers, modList, formula }: SuccessData)

        /**
        * Create a success roll object by parsing a formula based on the notation for skill levels published on sample characters in some GURPS supplements.
        *
        * @public
        * @param {String} formula Must include the target number to be rolled against. Can also optionally include the name of the ability being rolled against and any +/- modifiers. Accepted format is [&lt;ability name&gt;-]&lt;level&gt;[&lt;modifiers&gt;]. The ability name must start with a letter but can otherwise contain any character except line breaks and the - character, which if the ability name is passed must be used between the ability name and level. The optional list of modifiers may contain one or more modifiers supplied in +X or -Y form; optional spaces are allowed between the modifiers as well as between them and the +/- signs, but no other characters are allowed and every numeric modifier must have either a + or - sign preceding it.
        * @returns {SuccessRoll}
        *
        * @example
        * // Roll against 11
        * SuccessRoll.fromFormula('11')
        *
        * // Roll against 11 modified by -4 and +1
        * SuccessRoll.fromFormula('11-4+1')
        *
        * // Roll against the Stealth skill at level 12
        * SuccessRoll.fromFormula('Stealth-12')
        *
        * // Roll against ST 10 with a bonus of +3 and a penalty of -2 to the roll
        * SuccessRoll.fromFormula('ST-10 +3 -2')
        */
        static fromFormula(formula: string): SuccessRoll

        /**
         * Creates a success roll object from structured data.
         *
         * @public
         * @param {Object} data
         * @param {Number} data.level Level of the trait to roll against
         * @param {String|null} data.trait Name of the trait being rolled
         * @param {String|null} data.modifiers Various modifiers to apply to the roll supplied in +X or -Y form. Optional spaces are allowed between the modifiers as well as between them and the +/- signs, but no other characters are allowed and every numeric modifier must have either a + or - sign preceding it.
         * @returns {SuccessRoll}
         *
         * @example
         * // Roll against the Stealth skill at level 12
         * SuccessRoll.fromData({ level: 12, trait: 'Stealth' })
         *
         * // Roll against ST 10 with a bonus of +3 and a penalty of -2 to the roll
         * SuccessRoll.fromData({ level: 10, trait: 'ST', modifiers: ' +3 -2' })
         *
         * // Roll against 11
         * SuccessRoll.fromData({ level: 11 })
         *
         * // Roll against 11 modified by -4 and +1
         * SuccessRoll.fromData({ level: 11, modifiers: '-4+1' })
         */
        static fromData({ level, trait, modifiers }: SuccessData): SuccessRoll

        /**
         * Makes the roll
         *
         * @public
         * @returns {SuccessRoll} Self
         */
        roll(): SuccessRoll
    }
    interface SuccessData {
        level: number,
        trait: string,
        modifiers?: string
        modList?: { modifier: string, description: string }[]
        formula?: string
    }
}