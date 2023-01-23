export class RealTimeSimulator {
    constructor(actor) {
        this.intervalID = 0;
        this.isRunning = false;
        this.timeGranularityInMilliseconds = 100;
        this.actor = actor;
    }
    start() {
        if (this.isRunning) {
            return;
        }
        this.intervalID = setInterval(() => { this.actor.onTimeProgress(this.timeGranularityInMilliseconds); }, this.timeGranularityInMilliseconds);
        this.isRunning = true;
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        clearInterval(this.intervalID);
        this.intervalID = 0;
        this.isRunning = false;
    }
}
