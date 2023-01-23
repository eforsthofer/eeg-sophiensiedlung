import * as yml from "js-yaml";
import * as fs from "fs";
import * as path from "path";

import {getAppTransformedConfig} from "../../YAMLTransformer/appTransformations/appTransformate.js"

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

function generateSimulatioConfigurations(simulation, base) {
    for (let site of simulation.sites) {
        let generatedConfig = JSON.parse(JSON.stringify(base));

        generatedConfig.network.port = simulation.networkOptions.evccInstances.portStart + site.id;

        for (let meterIndex in base.meters) {
            generatedConfig.meters[meterIndex].power.body = `{"id":${site.id}}`
        }

        for (let chargerIndex in base.chargers) {
            let keysWithBody = ["enable", "status", "enabled"]
            for (let key of keysWithBody) {
                generatedConfig.chargers[chargerIndex][key].body = `{"id":${site.id}}`
            }
            generatedConfig.chargers[chargerIndex].maxcurrent.body = `{"id":${site.id},"maxcurrent":\${maxcurrent}}`
        }

        for (let vehicleIndex in base.vehicles) {
            let keysWithBody = ["soc"]
            for (let key of keysWithBody) {
                generatedConfig.vehicles[vehicleIndex][key].body = `{"id":${site.id}}`
            }
            generatedConfig.vehicles[vehicleIndex].capacity = site.capacity;
        }
        for (let loadPointIndex in base.loadpoints) {
            generatedConfig.loadpoints[loadPointIndex].phases = site.phases;
            generatedConfig.loadpoints[loadPointIndex].mincurrent = site.mincurrent;
            generatedConfig.loadpoints[loadPointIndex].maxcurrent = site.maxcurrent;
        }
        
        generatedConfig = getAppTransformedConfig(site.id,generatedConfig)
        fs.writeFileSync(__dirname+`/dist/site${site.id.toString()}.yaml`,yml.dump(generatedConfig));   
    }
}

function getYamlAsObject(yamlPath) {
    let yamlAsText = fs.readFileSync(yamlPath, 'utf8');
    return yml.load(yamlAsText);
}

export function generateConfigs(){
    try {
        let simulation = getYamlAsObject(path.join(__dirname, '/src/simulation.yaml'))
        let base = getYamlAsObject(path.join(__dirname, '/src/base.yaml'))
    
        generateSimulatioConfigurations(simulation, base);
    
    } catch (e) {
        console.log(e);
    }
}
