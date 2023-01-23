import { InfluxDB, Point } from '@influxdata/influxdb-client'

import * as yaml from "js-yaml"
import * as fs from "fs"
import * as path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { logger } from '../logger.js'
global.logger = logger

function getMemberIDs() {
    const yamlPath = path.resolve(__dirname, '../server/config.yaml')
    let config = {}
    try {
        config = yaml.load(fs.readFileSync(yamlPath, 'utf8'))
    } catch (error) {
        console.error("Error while reading config.yaml: " + error)
        process.exit(1)
    }
    return config.EEGMembers.map(member => member.ID);
}
function getMemberBucketName(memberID) {
    return `EEGMember_${memberID}`;

}

const url = "http://127.0.0.1:8086"
global.logger.info("Reading Influx Token from: " + path.join(__dirname, 'influxToken.yaml'))
const token = yaml.load(fs.readFileSync(path.join(__dirname,"influxToken.yaml"), 'utf8')).token
const org = "EEG"
const memberBucket = "Members"


    const influxDB = new InfluxDB({ url, token })
    const memberWriteApi = influxDB.getWriteApi(org, memberBucket)


export function writeMemberState(eegMember) {

    const writeApi = memberWriteApi
    const point =
        new Point("MemberState")
            .tag("ID", `${eegMember.ID}`)
            .floatField('gridPower', eegMember.state.gridPower)
            .floatField('homePower',eegMember.state.homePower)
            .floatField('pvPower',eegMember.state.pvPower)
            .floatField('residualPower', eegMember.state.residualPower)
            .floatField('chargePower',eegMember.getCurrentChargingPower())
        writeApi.writePoint(point)
        writeApi.flush()
        .then(() => {})
        .catch(e => {
            global.logger.error(`Error while writing point to InfluxDB. Is the database running?`)
        })
    
}