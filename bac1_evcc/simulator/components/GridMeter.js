export class GridMeter {
    constructor(producerMeters, consumerMeters) {
        this.producerMeters = producerMeters;
        this.consumerMeters = consumerMeters;
    }
    CurrentPower() {
        const producerSum = this.getSum(this.producerMeters);
        const consumerSum = this.getSum(this.consumerMeters);
        return consumerSum - producerSum;
    }
    getSum(meters) {
        let sum = 0;
        for (const meter of meters) {
            sum += meter.CurrentPower();
        }
        return sum;
    }
}
