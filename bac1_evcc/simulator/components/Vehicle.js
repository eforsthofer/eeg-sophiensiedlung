import { RealTimeSimulator } from "./RealTimeSimulator.js";
export class Vehicle {
    constructor(title, capacityInKWH, maxLoadingPhases, maxLoadingCurrentInAmps, maxLoadingVoltage) {
        this.loadingCurrentInAmps = 0;
        this.soc = 0;
        this.title = title;
        this.maxLoadingPhases = maxLoadingPhases;
        this.maxLoadingCurrentInAmps = maxLoadingCurrentInAmps;
        this.maxLoadingVoltage = maxLoadingVoltage;
        this.loadingPhases = maxLoadingPhases;
        this.loadingVoltage = maxLoadingVoltage;
        this.capacityInKWH = capacityInKWH;
        this.simulator = new RealTimeSimulator(this);
    }
    Title() { return this.title; }
    Capacity() { return this.capacityInKWH; }
    SoC() { return this.soc; }
    Phases() { return this.loadingPhases; }
    getLoadingPower() {
        return this.loadingPhases * this.loadingVoltage * this.loadingCurrentInAmps;
    }
    onTimeProgress(timePassedInMillis) {
        const loadedEnergy = (this.getLoadingPower() * timePassedInMillis / 1000);
        const chargeProgress = loadedEnergy / (this.capacityInKWH * 1000 * 60);
        this.soc += chargeProgress;
        if (this.soc >= 100) {
            this.soc = 0;
        }
    }
    startLoading() {
        this.simulator.start();
    }
    stopLoading() {
        this.loadingCurrentInAmps = 0;
        this.simulator.stop();
    }
}
