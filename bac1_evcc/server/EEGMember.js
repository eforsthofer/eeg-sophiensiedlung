import fetch from 'node-fetch'
import { logger } from './logger.js'
import * as persistence from './persistence/persistence.js'

global.logger = logger

const residualPowerPath = "/api/residualpower/"

function parseToObject(response) {
  if (!response.ok) {
    global.logger.error("Error: " + response.statusText + " when requesting " + response.url)
    throw Error(response.statusText);
  }
  return response.json();
}

export class EEGMember {
  constructor(id, name, Evcc_Host, Evcc_Port, Evcc_StatePath) {
    this.ID = id
    this.Username = name
    this.Evcc_Host = Evcc_Host
    this.Evcc_Port = Evcc_Port
    this.Evcc_StatePath = Evcc_StatePath
    this.state = {}
    this.stateValid = false;
    global.logger.info(`User ${this.Username} successfully imported from config.yaml (ID: ${this.ID}, EVCC Host: ${this.Evcc_Host}, EVCC Port: ${this.Evcc_Port}, EVCC StatePath: ${this.Evcc_StatePath})`)
  }


  updateState() {
    const url = `http://${this.Evcc_Host}:${this.Evcc_Port}${this.Evcc_StatePath}`
    return fetch(url)
      .then(parseToObject)
      .then((data) => {
        this.state = data.result
        this.stateValid = true;
        persistence.writeMemberState(this);
      })
      .catch((error) => {
        this.stateValid = false;
        global.logger.error(`Error while fetching state from ${url} for user ${this.Username}: ${error}`)
      })
  }

  setResidualPower(power){
    if(power > this.getMaximumChargingPower()){
      global.logger.error(`Error: Cannot set residual power to ${power} for user ${this.Username} because it is higher than the maximum charging power of ${this.getMaximumChargingPower()}`)
      power = this.getMaximumChargingPower()
    }

    const url = `http://${this.Evcc_Host}:${this.Evcc_Port}${residualPowerPath}${-(power)}`
    fetch(url,{method:'POST'})
    .then(parseToObject)
    .catch((error)=>{global.logger.error(`Error while setting residualpower from ${url} for user ${this.Username}: ${error}`)})
  }

  getResidualPower(){
    return this.state.residualPower * -1
  }

  getGridPower(){
    if(this.stateValid){
      return this.state.gridPower
    }
    else{
      return 0
    }
  }


  //calculate the maximum charging power of all loadpoints that are connected and in pv or minpv mode (only those loadpoints must be considered for surplus distribution)
  getMaximumChargingPower(){
    let maxChargingPower = 0
    if(this.stateValid){
      for (const loadpoint of this.state.loadpoints) {
        if (loadpoint.connected && (loadpoint.mode == "pv" || loadpoint.mode == "minpv")) 
        maxChargingPower += loadpoint.maxCurrent * loadpoint.phasesEnabled * 230 //TODO: how must the power at 3 phases be calculated?
      }
      return maxChargingPower
    }
    else{
      return 0
    }
  }

  //calculate the current charging power of all loadpoints that are connected and in pv or minpv mode (only those loadpoints must be considered for surplus distribution)
  getCurrentChargingPower(){
    let currentChargingPower = 0
    if(this.stateValid){
      for (const loadpoint of this.state.loadpoints) {
        if (loadpoint.connected && (loadpoint.mode == "pv" || loadpoint.mode == "minpv"))
        currentChargingPower += loadpoint.chargePower 
      }
      return currentChargingPower
    }
    else{
      return 0
    }
  }



}