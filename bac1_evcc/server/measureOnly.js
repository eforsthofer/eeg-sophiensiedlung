import * as path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {EEGMember} from './EEGMember.js'
import * as yaml from 'js-yaml'
import * as fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getUpdatedMembers(members) {
  await Promise.all(members.map((member) => member.updateState()))
  return members.filter((member) => member.stateValid)
}

async function logMembers(){
  await getUpdatedMembers(eegMembers)
}



function readConfig(filename){
  try {
    //read eegMember data from config.yaml
    let config = yaml.load(fs.readFileSync(path.join(__dirname, filename), 'utf8'))
    return config
  } catch (error) {
    global.logger.error("Error while reading config.yaml: " + error)
    process.exit(1)
  }

}
const eegMembers = []
let config = readConfig("config.yaml")

//Instantiate eegMembers from config.yaml
config.EEGMembers.forEach((eegMember) => {
  eegMembers.push(new EEGMember(eegMember.ID, eegMember.Username, eegMember.Evcc_Host, eegMember.Evcc_Port, eegMember.Evcc_StatePath))
})


const evccControlTime = 1000
setInterval(logMembers, 2 * evccControlTime)//Higher time -> more stable controlling!
