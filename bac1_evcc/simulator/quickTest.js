import { Site } from "./components/Site.js";
import { Vehicle } from "./components/Vehicle.js";
import { ConstantMeter } from "./components/ConstantMeter.js";
function logSite(site) {
    setInterval(() => {
        site.printSiteStatus();
    }, 1000);
}
export function runQuickTest() {
    const vehicle = new Vehicle('Tesla Model S', 100, 1, 32, 230);
    const site = new Site(vehicle, new ConstantMeter(8000), new ConstantMeter(4000));
    site.charger.Enable();
    site.printSiteStatus();
    logSite(site);
}
