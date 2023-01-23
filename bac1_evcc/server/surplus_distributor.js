import * as fs from 'fs'
import fetch from 'node-fetch'
import * as yaml from 'js-yaml'
import { EEGMember } from './EEGMember.js'
import { logger } from './logger.js'

import * as path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

global.logger = logger


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

function getConsumers(members) {
  const drawsEnergyFromGrid = (member) => member.getGridPower() >= 0
  return members.filter(drawsEnergyFromGrid)
}

function getProducers(members) {
  const inputsEnergyIntoGrid = (member) => member.getGridPower() < 0
  return members.filter(inputsEnergyIntoGrid)
}

async function getUpdatedMembers(members) {
  await Promise.all(members.map((member) => member.updateState()))
  return members.filter((member) => member.stateValid)
}

function setAssignedSurplusToZero(members){
  members.forEach(member => member.setResidualPower(0))
}

function calculateProductionAndConsumption(members){
  const producers = getProducers(members)
  const consumers = getConsumers(members)
  const production = -producers.reduce((production,curr,i,producers) => production + producers[i].getGridPower(),0)
  const consumption = consumers.reduce((consumption,curr,i,consumers) => consumption + consumers[i].getGridPower(),0)
  return {production, consumption}
}

function reduceAssignedSurplusEnergy(members, surplus){
  const membersDrawingFromEEG = members.filter(member => member.getResidualPower() > 0)
    const totalPowerToReduce = -surplus
    let remainingPowerToReduce = totalPowerToReduce
    for(let i = 0; i < membersDrawingFromEEG.length; ++i){
      const member = membersDrawingFromEEG[i];
      const maximumPowerToReduceForThisMember = Math.min(member.getResidualPower(), remainingPowerToReduce)
      member.setResidualPower(member.getResidualPower() - maximumPowerToReduceForThisMember)
      remainingPowerToReduce -= maximumPowerToReduceForThisMember
      if(remainingPowerToReduce <= 0){
        break;
      }
    }
}

function increaseAssignedSurplusEnergy(members, surplus){
  const consumers = getConsumers(members)
  let remainingSurplusToDistribute = surplus;
    
  for(let i = 0; i < consumers.length; ++i){
    //residual power nur erhöhen, wenn der consumer auch noch mehr energie verbrauchen kann!! sonst gleich lassen
    //der consumer kann noch mehr verbrauchen wenn: 1. er im pv oder minpv mode ist; 2. die derzeitige ladeleistung kleiner als die maximale ladeleistung ist
    const member = consumers[i];
    const additionalPowerTheMemberCanConsume = member.getMaximumChargingPower() - member.getCurrentChargingPower() //calculate how much power the loadpoints of the member can consume additionally
    const maximumPowerToAssign = Math.min(remainingSurplusToDistribute, additionalPowerTheMemberCanConsume)
    member.setResidualPower(member.getResidualPower() + maximumPowerToAssign)
    remainingSurplusToDistribute -= maximumPowerToAssign
    if(remainingSurplusToDistribute <= 0){
      break;
    }
  }

}


async function distribute() {
  //Definition consumer:  Draws power from the grid
  //Definition producer:  Feeds power into the grid

  const members = await getUpdatedMembers(eegMembers)
  const producers = getProducers(members)
  const consumers = getConsumers(members)
  
  //If a producer has assigned surplus, set the assigned surplus to 0, cause a producer will not consume energy from the grid
  setAssignedSurplusToZero(producers)

  const {production, consumption} = calculateProductionAndConsumption(members)
  const surplus = production - consumption
  global.logger.debug(`Available Surplus: ${surplus}`)

  //if surplus is below 0, no more surplus is available
  if(surplus < 0){
    reduceAssignedSurplusEnergy(members, surplus)
  }else if (surplus > 0){ //if surplus is above 0, surplus is available
    increaseAssignedSurplusEnergy(members, surplus)
  }

}

//========  MAIN ========
const eegMembers = []


  let config = readConfig("config.yaml")

  //Instantiate eegMembers from config.yaml
  config.EEGMembers.forEach((eegMember) => {
    eegMembers.push(new EEGMember(eegMember.ID, eegMember.Username, eegMember.Evcc_Host, eegMember.Evcc_Port, eegMember.Evcc_StatePath))
  })

  //Set all residual powers to zero at startup
  setAssignedSurplusToZero(eegMembers)

  const evccControlTime = 1000
  setInterval(distribute, 2 * evccControlTime)//Higher time -> more stable controlling!
