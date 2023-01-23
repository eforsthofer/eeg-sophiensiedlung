import * as yml from "js-yaml";
import * as fs from "fs";
import * as path from "path";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

function transformNode(transformationNode,toTransform){
    //console.log(transformationNode)
    let keys = Object.keys(transformationNode)

    let keysOfLiterals = keys.filter((key) => transformationNode[key] !== null && typeof transformationNode[key] === "string" || typeof transformationNode[key] === "number");
    let keysOfNodes = keys.filter((key) => transformationNode[key] !== null && typeof transformationNode[key] === "object");

    keysOfLiterals.forEach((key) => {toTransform[key] = transformationNode[key]})

    const createNodeIfNotExists = (key) => {if(!toTransform[key]){toTransform[key] = {}}}
    keysOfNodes.forEach(createNodeIfNotExists)
    keysOfNodes.forEach((key) => {transformNode(transformationNode[key],toTransform[key])})
}

export function getYamlAsObject(yamlPath){
    let yamlAsText =  fs.readFileSync(yamlPath, 'utf8');
    return yml.load(yamlAsText);
}

export function transformUsingFiles(originalPath,transformationsPath,outputPath){
    let output = getYamlAsObject(originalPath);
    let transformations = getYamlAsObject(transformationsPath);

    transformNode(transformations,output)

    fs.writeFileSync(outputPath,yml.dump(output));
}

export function transformUsingObjects(original,transformations){
    let output = JSON.parse(JSON.stringify(original));
    transformNode(transformations,output)
    return output
}

function test(){
    const originalPath = __dirname+"/example/original.yaml"
    const transformationsPath = __dirname+"/example/transformations.yaml"
    const outputPath = __dirname+"/example/output.yaml"

    transformUsingFiles(originalPath,transformationsPath,outputPath)
}