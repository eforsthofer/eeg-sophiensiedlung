import * as yml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { Site } from './components/Site.js';
import { Vehicle } from './components/Vehicle.js';
import { ConstantMeter } from "./components/ConstantMeter.js";
import { FunctionMeter, getStepFunction, getSinusFunction,getSinusSquaredFunction} from "./components/FunctionMeter.js";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


function getVehicleInformations() {
    let configPath = __dirname + "/configurations/src/simulation.yaml";
    let config = fs.readFileSync(configPath, 'utf8');
    config = yml.loadAll(config)[0];
    let vehicleInformations = [];
    for (let vehileConfig of config.sites) {
        vehicleInformations.push(vehileConfig);
    }
    return vehicleInformations;
}
const period = 30 * 1000;
const vehicleInformations = getVehicleInformations();
const vehicles = vehicleInformations.map(information => new Vehicle("Car " + information.id, information.capacity, information.phases, information.maxcurrent, 230));
const sites = [
    new Site(vehicles[0],new ConstantMeter(0),new ConstantMeter(0)),
    new Site(vehicles[1],new FunctionMeter(getSinusSquaredFunction(12000, 0, 500)),new ConstantMeter(2600))
];
export function getSites() {
    return sites;
}
export function getSimulationServerPort() {
    let configPath = __dirname + "/configurations/src/simulation.yaml";
    let config = fs.readFileSync(configPath, 'utf8');
    config = yml.loadAll(config)[0];
    return config.networkOptions.simulationServer.port;
}
