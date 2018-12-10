import React from 'react';
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import {compose,withProps,withState,withHandlers,lifecycle} from 'recompose'
import moment from 'moment'
import muiThemeable from 'material-ui/styles/muiThemeable';
import { withFirebase, firebaseConnect } from 'react-redux-firebase'
import {NOW} from 'Utilities/Date'
import numeral from 'numeral'
//COMPONENTS//
  import TextField from 'material-ui/TextField';
  import Paper from 'material-ui/Paper';
  import SectionHeader from 'components/Headers/SectionHeader'
  import Margin from 'components/Layout/Margin'
  import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine} from 'recharts';
  import Dialog from 'material-ui/Dialog';
  import RaisedButton from 'material-ui/RaisedButton';
  import FlatButton from 'material-ui/FlatButton';
  import Toggle from 'material-ui/Toggle';
//ACTIONS//




const COMPONENT_NAME = ({
  //PROPS FROM PARENT//

  //REDUX//
  //STATE
    openTargetSelect,setOpenTargetSelect,
    updateTarget,setupdateTarget,
  //HANDLER
    updateTargetSelect,compareTargetToState,handleStatusChange,
  //OTHER
    muiTheme,firebase,...props
}) => {
  if(!props.room1||!props.room2){
    return(
      <div>Loading...</div>
    )
  }
  console.log(props.humLog);
  return(
    <div>
      <LineChart
        width={window.innerWidth}
        height={200}
        data={props.stats.humLog}
      >
        <Line type="monotone" dataKey='room1' stroke="red" dot={false}/>
        <Line type="monotone" dataKey='room2' stroke="black" dot={false}/>
        <Line type="monotone" dataKey='controller' stroke="yellow" dot={false}/>
        <Line type="monotone" dataKey='average' stroke="blue" strokeDasharray="5 5" dot={false}/>
        <CartesianGrid stroke="#ccc"/>
        <XAxis dataKey="timestamp" tickFormatter={(value)=>moment(value).format('MM/DD H:mm')}/>
        <YAxis domain={['dataMin', 'dataMax']}/>
        <Tooltip/>
      </LineChart>
      Cont_R1:
      {props.stats.cont_r1}
      <br/>
      Cont_R2:
      {props.stats.cont_r2}
      <LineChart
        width={window.innerWidth}
        height={200}
        data={props.stats.adjustedLogs}
      >
        <Line type="monotone" dataKey='room1' stroke="red" dot={false}/>
        <Line type="monotone" dataKey='room2' stroke="black" dot={false}/>
        <Line type="monotone" dataKey='controller' stroke="yellow" dot={false}/>
        <Line type="monotone" dataKey='average' stroke="blue" strokeDasharray="5 5" dot={false}/>
        <CartesianGrid stroke="#ccc"/>
        <XAxis dataKey="timestamp" tickFormatter={(value)=>moment(value).format('MM/DD H:mm')}/>
        <YAxis domain={['dataMin', 'dataMax']}/>
        <Tooltip/>
      </LineChart>
      
    </div>
  )
}

const mapStateToProps = state => ({
  room1:state.firebase.data.room1,
  room2:state.firebase.data.room2,
  controller:state.firebase.data.controller,
})

function matchDispatchToProps(dispatch){
  return  bindActionCreators({
  },dispatch)
}

export default compose(
  withFirebase,
  connect(mapStateToProps,matchDispatchToProps),
  firebaseConnect([
    { path: '/room1/log', queryParams: [ 'limitToLast=10000' ] },
    { path: '/room2/log', queryParams: [ 'limitToLast=10000' ] },
    'room1/config/sensors/dht21',
    'room2/config/sensors/dht21',
    'controller/currentState',
    { path: '/controller/log', queryParams: [ 'limitToLast=1000' ] },
  ]),
  withProps(props=>{
    var room1Log = props.room1&&props.room1.log
    var room2Log = props.room2&&props.room2.log
    var controllerLog = props.controller&&props.controller.log
    if(room1Log&&room2Log&&controllerLog){
      var logAgg = {}
      Object.keys(room1Log).map((logId)=>{
        var log = room1Log[logId]
        var timehash = moment(log.timestamp).format('DDHHmm')
        if(logAgg[timehash]&&logAgg[timehash]!=undefined){
          if(logAgg[timehash]&&logAgg[timehash].room1&&logAgg[timehash].room1!=undefined){
            logAgg[timehash].room1=log.hum
          }else{
            logAgg[timehash].room1=log.hum
          }
        }else{
          logAgg[timehash]={}
          logAgg[timehash].room1=log.hum
        }
      })
      Object.keys(room2Log).map((logId)=>{
        var log = room2Log[logId]
        var timehash = moment(log.timestamp).format('DDHHmm')
        if(logAgg[timehash]&&logAgg[timehash]!=undefined){
          if(logAgg[timehash]&&logAgg[timehash].room2&&logAgg[timehash].room2!=undefined){
            logAgg[timehash].room2=log.hum
          }else{
            logAgg[timehash].room2=log.hum
          }
        }else{
          logAgg[timehash]={}
          logAgg[timehash].room2=log.hum
        }
      })
      Object.keys(controllerLog).map((logId)=>{
        var log = controllerLog[logId]
        var timehash = moment(log.timestamp).format('DDHHmm')
        if(logAgg[timehash]&&logAgg[timehash]!=undefined){
          if(logAgg[timehash]&&logAgg[timehash].controller&&logAgg[timehash].controller!=undefined){
            logAgg[timehash].controller=log.hum
          }else{
            logAgg[timehash].controller=log.hum
          }
        }else{
          logAgg[timehash]={}
          logAgg[timehash].controller=log.hum
        }
      })
    }
    if(logAgg){
      var filteredLogAgg = []
      Object.keys(logAgg).map((logAggKey)=>{
        if(logAgg[logAggKey].room1&&logAgg[logAggKey].room2&&logAgg[logAggKey].controller){
          var r1 =logAgg[logAggKey].room1
          var r2 =logAgg[logAggKey].room2
          var cont=logAgg[logAggKey].controller
          var cont_r1 = cont-r1
          var cont_r2 = cont-r2
          filteredLogAgg.push({...logAgg[logAggKey],timestamp:logAggKey,average:(r1+r2+cont)/3,cont_r1,cont_r2})
        }
      })
    }
    if(filteredLogAgg){
      var cont_r1 = 0;
      var cont_r2 = 0;
      filteredLogAgg.map((log)=>{
        cont_r1+=log.cont_r1
        cont_r2+=log.cont_r2
      })
      var DEVIATION_cont_r1=cont_r1/filteredLogAgg.length
      var DEVIATION_cont_r2=cont_r2/filteredLogAgg.length
    }
    if(filteredLogAgg&&DEVIATION_cont_r1&&DEVIATION_cont_r2){
      var adjustedLogs = filteredLogAgg.map((log)=>({...log,room1:log.room1+DEVIATION_cont_r1,room2:log.room2+DEVIATION_cont_r2}))
    }
    return({
      room1:{
        target_temp:(props.room1&&props.room1.target_temp)?props.room1.target_temp.value:0,
        target_humidity:(props.room1&&props.room1.target_humidity)?props.room1.target_humidity.value:0,
        temp:(props.room1&&props.room1.currentState)?props.room1.currentState.temp:0,
        humidity:(props.room1&&props.room1.currentState)?props.room1.currentState.hum:0,
        isTempOn:props.room1 && props.room1.isTempOn,
        isHumOn:props.room1 && props.room1.isHumOn,
        log:props.room1 && props.room1.log,
        updated:props.room1 && moment(props.room1.updated),
        coolingMode:props.room1 && props.room1.coolingMode?true:false,
        humidifyingMode:props.room1 && props.room1.humidifyingMode?true:false
      },
      room2:{
        target_temp:(props.room2&&props.room2.target_temp)?props.room2.target_temp.value:0,
        target_humidity:(props.room2&&props.room2.target_humidity)?props.room2.target_humidity.value:0,
        temp:(props.room2&&props.room2.currentState)?props.room2.currentState.temp:0,
        humidity:(props.room2&&props.room2.currentState)?props.room2.currentState.hum:0,
        isTempOn:props.room2 && props.room2.isTempOn,
        isHumOn:props.room2 && props.room2.isHumOn,
        log:props.room2 && props.room2.log,
        updated:props.room2 && moment(props.room2.updated),
        coolingMode:props.room2 && props.room2.coolingMode?true:false,
        humidifyingMode:props.room2 && props.room2.humidifyingMode?true:false
      },
      controller:{
        temp:(props.controller&&props.controller.currentState)&&props.controller.currentState.temp,
        humidity:(props.controller&&props.controller.currentState)&&props.controller.currentState.hum,
        probe:(props.controller&&props.controller.currentState)&&props.controller.currentState.probe,
      },
      stats:{
        humLog:filteredLogAgg,
        adjustedLogs:adjustedLogs,
        cont_r1:DEVIATION_cont_r1,
        cont_r2:DEVIATION_cont_r2,
      }
    })
  }),
  muiThemeable(),
  withState('lastRunForMins','setLastRunForMins',false),
  lifecycle({
    componentDidUpdate(){
      if((moment().format('mm')%5==0) && (this.props.lastRunForMins != moment().format('mm'))){
        var room1Hum = this.props.room1.humidity
        var room2Hum = this.props.room2.humidity
        var controllerHum = this.props.controller.humidity
        if(room1Hum&&room2Hum&&controllerHum){
          this.props.setLastRunForMins(moment().format('mm'))
          this.props.firebase.push(
            'humidityStats',
            {
              'one_two':room1Hum-room2Hum,
              'two_controller':room2Hum-controllerHum,
              'one_controller':room1Hum-controllerHum,
              room1Hum:room1Hum,
              room2Hum:room2Hum,
              controllerHum:controllerHum,
              'timestamp':NOW()
            })
        }
      }
    }
  })
)(COMPONENT_NAME)

const styles={
  split:{
    width:'50%',display:'inline-block',verticalAlign:'top',position:'relative'
  },
  centeredText:{
    width:'100%',textAlign:'center',
  },
  subHeader:{
    display:'inline-block',fontSize:12,fontWeight:'normal',marginLeft:10
  }
}
