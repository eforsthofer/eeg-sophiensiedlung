import * as yml from "js-yaml";
import * as fs from "fs";
import * as path from "path";

import {getYamlAsObject, transformUsingObjects} from '../YAMLTransformer.js'

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export function getAppTransformedConfig(id,config){
    let distributorTransformation = getYamlAsObject(path.join(__dirname,"distributorTransformation.yaml"))
    let output = transformUsingObjects(config,distributorTransformation);

    /* const influxToken = getYamlAsObject(path.join(__dirname,"influxToken.yaml")).token
    let influxTransformation = getYamlAsObject(path.join(__dirname,"influxTransformation.yaml"))
    influxTransformation.influx.database = "EVCC"+id.toString()
    influxTransformation.influx.token = influxToken
    output = transformUsingObjects(output,influxTransformation);
 */
    return output;
    
}