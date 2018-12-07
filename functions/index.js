// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
var req = require('request');
const {google} = require('googleapis');
const admin = require('firebase-admin');
var moment = require('moment-timezone');
admin.initializeApp();
// // The Firebase Admin SDK to access the Firebase Realtime Database.
// const admin = require('firebase-admin');
// admin.initializeApp();

exports.helloWorld4 = functions.https.onRequest((request, response) => {
  response.send(
    req('https://postman-echo.com/get?foo1=bar1&foo2=bar2', function (error, response, body) {
        return response
    })
  )
});

exports.requestLog = functions.https.onRequest((request, response) => {
  console.log(JSON.stringify(request.query));
  response.send(JSON.stringify(request.query))
});

exports.updateDeviceConfig = functions.https.onRequest((request, response) => {
  var device_id = request.query.deviceId
  var value = request.query.value
  response.send(updateDeviceConfig(device_id,{led:Number(value)}))
});

exports.controlSub = functions.pubsub.topic('control').onPublish((message) => {
  console.log(message)
  const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
  console.log('message body is ',messageBody);
  var message_json=false;
  try{
    message_json = JSON.parse(messageBody);
  }catch(e){
    console.log('Unreadable Message: ',message);
    return 'Not Updating at this time'
  }
  console.log("Message JSON is: ",message_json);
  if(message_json.temp && message_json.hum){
    admin.database().ref('/room1/log').push({temp: message_json['temp'],hum:message_json['hum'],timestamp:timestamp()})
    return admin.database().ref('/room1/currentState').update({temp: message_json['temp'],hum:message_json['hum']})
  }else{
    return 'Not Updating at this time'
  }
});

exports.room1StateWatcher = functions.database.ref('/room1/currentState')
    .onWrite((change, context) => {
      checkStatus(change)
    });
exports.room2StateWatcher = functions.database.ref('/room2/currentState')
    .onWrite((change, context) => {
      checkStatus(change)
    });

exports.targetHumidityWatcher = functions.database.ref('/room1/target_humidity')
  .onWrite((change, context) => {
    checkStatus(change)
  });
exports.targetTempWatcher = functions.database.ref('/room1/target_temp')
  .onWrite((change, context) => {
    checkStatus(change)
  });

exports.targetHumidityWatcher2 = functions.database.ref('/room2/target_humidity')
  .onWrite((change, context) => {
    checkStatus(change)
  });
exports.targetTempWatcher2 = functions.database.ref('/room2/target_temp')
  .onWrite((change, context) => {
    checkStatus(change)
  });

function checkStatus(change){
  if (!change.after.exists()) {
    return null;
  }
  return change.after.ref.parent.once('value').then((snapshot)=>{
      let roomState = snapshot.val();
      let targetTemp = roomState.target_temp.value
      let targetHum = roomState.target_humidity.value
      let currentTemp = roomState.currentState.temp
      let currentHum = roomState.currentState.hum
      let coolingMode = roomState.coolingMode
      let humidifyingMode = roomState.humidifyingMode
      change.after.ref.parent.child('isTempOn').set(handleComparison(targetTemp,currentTemp,!coolingMode));
      change.after.ref.parent.child('isHumOn').set(handleComparison(targetTemp,currentTemp,humidifyingMode));
      //updateDeviceConfig("2814072940603127",deviceConfig);
      change.after.ref.parent.child('log').push({hum:currentHum,temp:currentTemp,timestamp:timestamp()})
      return true
    }).then(()=>{
      change.after.ref.parent.child('updated').set(timestamp())
      return true
  })
}
function handleComparison(target,current,shouldTargetBeHigher){
  if(shouldTargetBeHigher){
    return Number(target)>Number(current)
  }else{
    return Number(target)<Number(current)
  }
}

function updateDeviceConfig(deviceId,config){
  console.log('Updating Config',config);
  const projectId = 'cure-tech';
  const cloudRegion = 'us-central1';
  var resp = google.auth.getClient().then(client => {
    google.options({
      auth: client
    });
    console.log('START setDeviceConfig');
    const parentName = `projects/cure-tech/locations/us-central1`;
    const registryName = `${parentName}/registries/cure-tech`;
    const binaryData = Buffer.from(JSON.stringify(config)).toString('base64');
    const request = {
      name: `${registryName}/devices/${deviceId}`,
      versionToUpdate: 0,
      binaryData: binaryData
    };
    console.log('Set device config.');
    return google.cloudiot('v1').projects.locations.registries.devices.modifyCloudToDeviceConfig(request);
  }).then(result => {
    return result
  });
  return "200 OK"
}
function timestamp(){
  return moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
}
