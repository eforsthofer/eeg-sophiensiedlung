import * as evccAPI from '../evccAPI.js';
export class Charger {
    constructor(vehicle) {
        this.enabled = false;
        this.chargeStatus = evccAPI.ChargeStatuses.StatusB;
        this.vehicleToLoad = vehicle;
    }
    Enabled() {
        return this.enabled;
    }
    Enable() {
        if (this.enabled) {
            this.vehicleToLoad.stopLoading();
            this.chargeStatus = evccAPI.ChargeStatuses.StatusB;
        }
        else {
            this.vehicleToLoad.startLoading();
            this.chargeStatus = evccAPI.ChargeStatuses.StatusC;
        }
        this.enabled = !this.enabled;
    }
    Status() {
        return this.chargeStatus;
    }
    MaxCurrent(current) {
        this.vehicleToLoad.loadingCurrentInAmps = Math.min(current, this.vehicleToLoad.maxLoadingCurrentInAmps);
    }
    CurrentPower() {
        return this.vehicleToLoad.getLoadingPower();
    }
}
