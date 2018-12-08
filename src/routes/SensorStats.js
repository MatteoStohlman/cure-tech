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

  return (
    <div>
      Humidity:<br/>
      Room1 - Room2: {props.room1.humidity-props.room2.humidity}<br/>
      Room2 - Controller: {props.room2.humidity-props.controller.humidity}<br/>
      Room1 - Controller: {props.room1.humidity-props.controller.humidity}<br/>
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
    //{ path: '/room1/log', queryParams: [ 'limitToFirst=300' ] },
    'room1/currentState',
    'room1/isHumOn',
    'room1/isTempOn',
    'room1/target_humidity',
    'room1/target_temp',
    'room1/updated',
    'room1/coolingMode',
    'room1/humidifyingMode',
    //{ path: '/room2/log', queryParams: [ 'limitToFirst=300' ] },
    'room2/currentState',
    'room2/isHumOn',
    'room2/isTempOn',
    'room2/target_humidity',
    'room2/target_temp',
    'room2/updated',
    'room2/coolingMode',
    'room2/humidifyingMode',

    'controller/currentState',
  ]),
  withProps(props=>{
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
      }
    })
  }),
  muiThemeable(),
  withState('lastRunForMins','setLastRunForMins',false),
  lifecycle({
    componentDidUpdate(){
      if((moment().format('mm')%14==0) && (this.props.lastRunForMins != moment().format('mm'))){
        var room1Hum = this.props.room1.humidity
        var room2Hum = this.props.room2.humidity
        var controllerHum = this.props.controller.humidity
        if(room1Hum&&room2Hum&&controllerHum){
          this.props.setLastRunForMins(moment().format('mm'))
          this.props.firebase.push(
            'humidityStats',
            {
              'one_two':Math.abs(room1Hum-room2Hum),
              'two_controller':Math.abs(room2Hum-controllerHum),
              'one_controller':Math.abs(room1Hum-controllerHum),
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
