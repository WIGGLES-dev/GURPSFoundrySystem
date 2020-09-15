import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";

export function gatherEnergyResults(
    energyToGather: number,
    skillLevel: number,
    normalTimeToGather: number,
    haste: number = 0,
    verbose: boolean = false,
    options = {
        applyOptionsToAllRounds: true
    }
) {
    let iterations = [];
    let currentIteration = 0;
    let energyGathered = 0;
    let timeEllapsed = 0;
    let consecutiveGathers = 0;
    let quirks = 0;

    if (energyGathered < energyToGather) {
        iterations.push({});
        let gatherRoll = new SuccessRoll({
            level: skillLevel - consecutiveGathers - haste,
            trait: `energy gathering round: ${consecutiveGathers + 1}`,
            modifiers: null
        });
        if (gatherRoll.isCritFail) {
            energyToGather = Number.NEGATIVE_INFINITY;
        }
        if (!gatherRoll.isSuccess) {
            quirks++;
            iterations[currentIteration].quirked = true;
        }
        let energyGatheredByRoll = Math.max(1, gatherRoll.marginOfSuccess);
        iterations[currentIteration].gatheredEnergy = energyGatheredByRoll;
        energyGathered += energyGatheredByRoll;
        consecutiveGathers++;
        gatherEnergyResults(energyToGather, skillLevel, normalTimeToGather, haste, verbose);
    }

    return {
        iterations,
        energyGathered,
        timeEllapsed,
        quirks
    }
}