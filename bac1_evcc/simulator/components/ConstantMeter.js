export class ConstantMeter {
    constructor(levelInWatt) {
        this.CurrentPower = () => { return this.levelInWatt; };
        this.levelInWatt = levelInWatt;
    }
}
