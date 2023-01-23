import { Charger } from "./Charger.js";
import { GridMeter } from "./GridMeter.js";
export class Site {
    constructor(vehicle, pvPowerMeter, homeConsumptionMeter) {
        this.vehicle = vehicle;
        this.charger = new Charger(this.vehicle);
        this.chargerPowerMeter = this.charger;
        this.pvPowerMeter = pvPowerMeter;
        this.gridPowerMeter = new GridMeter([this.pvPowerMeter], [this.chargerPowerMeter, homeConsumptionMeter]);
    }
    printSiteStatus() {
        console.log(`chargerPowerMeter:\t${this.chargerPowerMeter.CurrentPower()}`);
        console.log(`pvPowerMeter:\t${this.pvPowerMeter.CurrentPower()}`);
        console.log(`gridPowerMeter:\t${this.gridPowerMeter.CurrentPower()}`);
        console.log(`SoC:\t\t${this.vehicle.SoC()}`);
        console.log();
    }
}
