import express from 'express';
import * as SetupProvider from "./SetupProvider.js";
import * as cp from "child_process"

import { generateConfigs } from './configurations/generateConfigs.js';
import * as fs from 'fs';
import * as path from 'path'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));;
//======== Server: General ========
const app = express();
const port = SetupProvider.getSimulationServerPort();
const sites = SetupProvider.getSites();
app.use(express.json());
app.all('*', (req, res, next) => {
    const id = req.body.id;
    res.locals = { site: sites[id] };
    next();
});
app.get("*", (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});
app.get('/physical/meter/gridPower', (req, res) => {
    const site = res.locals.site;
    res.send({ value: site.gridPowerMeter.CurrentPower() });
});
app.get('/physical/meter/pvPower', (req, res) => {
    const site = res.locals.site;
    res.send({ value: site.pvPowerMeter.CurrentPower() });
});
app.get('/physical/meter/chargerPower', (req, res) => {
    const site = res.locals.site;
    res.send({ value: site.chargerPowerMeter.CurrentPower() });
});
app.get('/physical/charger/enable', (req, res) => {
    const site = res.locals.site;
    res.send({ value: site.charger.Enable() });
});
app.get('/physical/charger/enabled', (req, res) => {
    const site = res.locals.site;
    res.send({ value: site.charger.Enabled() });
});
app.get('/physical/charger/status', (req, res) => {
    const site = res.locals.site;
    res.send({ value: site.charger.Status() });
});
app.put('/physical/charger/maxCurrent', (req, res) => {
    if (!req.body.maxcurrent) {
        res.sendStatus(500);
    }
    const site = res.locals.site;
    site.charger.MaxCurrent(req.body.maxcurrent);
    res.sendStatus(200);
});
app.get('/physical/vehicle/soc', (req, res) => {
    const site = res.locals.site;
    res.send({ value: site.vehicle.SoC() });
});
app.get('/physical/vehicle/capacity', (req, res) => {
    const site = res.locals.site;
    res.send({ value: site.vehicle.Capacity() });
});




function startEVCCInstances() {
    let configs = fs.readdirSync(path.join(__dirname,"configurations/dist"))
    configs = configs.map(config => path.join(__dirname,"/configurations/dist",config))

    const evccCommand = `${path.resolve(__dirname,'..','evcc/evcc')}`
    const runConfig = (config) => cp.exec(`${evccCommand} -c ${config}`)
    const childObjects = configs.map(runConfig);
    childObjects.forEach((co) => {co.on('error',(err)=>{console.log(err)})})
    //childObjects.forEach((co) => {co.stdout.setEncoding("utf-8")})
    //childObjects.forEach((co) => {co.stdout.on('data',(err)=>{console.log(err)})})

}


    app.listen(port, () => { console.log('Simulation Server started:\thttp://127.0.0.1:' + port); });
    generateConfigs();
    startEVCCInstances();



