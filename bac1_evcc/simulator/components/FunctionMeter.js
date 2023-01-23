import { RealTimeSimulator } from './RealTimeSimulator.js';

export function getSquareWaveFunction(amplitude, delayInMillis) {
    return (timeInMillis) => {
        if (timeInMillis < delayInMillis) {
            return -amplitude;
        }
        return amplitude;
    };
}

export function getSinusFunction(amplitude, offset, periodInSeconds){
    return (timeInMillis) => {
        const value = amplitude * Math.sin(2 * Math.PI * timeInMillis / (periodInSeconds * 1000)) + offset;
        return value;
    }
}

export function getSinusSquaredFunction(amplitude,offset,periodInSeconds){
    return (timeInMillis) => {
        const value = amplitude * (Math.sin(2 * Math.PI * timeInMillis / (periodInSeconds * 1000)) * Math.sin(2 * Math.PI * timeInMillis / (periodInSeconds * 1000))) + offset;
        return value;
    }
}


export function getStepFunction(amplitude, delayInMillis) {
    return (timeInMillis) => {
        if (timeInMillis < delayInMillis) {
            return 0;
        }
        return amplitude;
    };
}
export function getSlope(risePerSecond) {
    return (timeInMillis) => {
        return risePerSecond * timeInMillis / 1000;
    };
}
export class FunctionMeter {
    constructor(timeFunction, period) {
        this.currentTimeInMillis = 0;
        this.CurrentPower = () => { return this.timeFunction(this.currentTimeInMillis); };
        this.timeFunction = timeFunction;
        this.period = period;
        this.simulator = new RealTimeSimulator(this);
        this.simulator.start();
    }
    onTimeProgress(timePassedInMillis) {
        this.currentTimeInMillis += timePassedInMillis;
        if (this.currentTimeInMillis > this.period) {
            this.currentTimeInMillis = 0;
        }
    }
}
