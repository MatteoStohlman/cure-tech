import React from 'react';
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import {compose,withProps,withState,withHandlers} from 'recompose'
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
    updateTarget,setUpdateTarget,updateUpdateTarget,
    error,setError,
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
  const Room = ({roomName,roomObj,style, disabled=false}) =>{
    return(
      <div style={{height:'33%',...style}}>
        <SectionHeader>{roomName}</SectionHeader>
        <div style={{...styles.split,height:100,borderRight:'2px solid gray'}} onClick={()=>!disabled&&updateTargetSelect(roomName,'target_temp',roomObj)}>
          <div style={{...styles.subHeader,position:'absolute',top:2,right:15,color:'red'}}>
            {!disabled&&(roomObj.coolingMode?'cooling to ':'heating to: ')}
            {!disabled&&numeral(roomObj.target_temp).format('0.0')+"°F"}
          </div>
          <div style={{...styles.centeredText,lineHeight:'100px',fontSize:25,}}>
            {numeral(roomObj.temp).format('0.00')+"°F"}
          </div>
          {roomObj.isTempOn&&<div className='blinkText' style={{...styles.subHeader,position:'absolute',bottom:2,left:5}}>
            {roomObj.coolingMode?"cooling...":'heating...'}
          </div>}
        </div>
        <div style={{...styles.split,height:100}} onClick={()=>!disabled&&updateTargetSelect(roomName,'target_humidity',roomObj)}>
          <div style={{...styles.subHeader,position:'absolute',top:2,right:15,color:'red'}}>
            {!disabled&&(roomObj.humidifyingMode?'humidifying to: ':'dehumidifying to: ')}
            {!disabled&&numeral(roomObj.target_humidity).format('0.0')+"%"}
          </div>
          <div style={{...styles.centeredText,lineHeight:'100px',fontSize:25,}}>
            {numeral(roomObj.humidity).format('0.00')+"%"}
          </div>
          {roomObj.isHumOn&&<div className='blinkText' style={{...styles.subHeader,position:'absolute',bottom:2,left:5}}>
            {roomObj.humidifyingMode?"humidifying...":"dehumidifying..."}
          </div>}
        </div>
        {roomObj.updated && <div style={{...styles.subHeader}}>Last updated: {roomObj.updated.format('MM/DD HH:mm')}</div>}
      </div>
    )
  }
  return (
    <div style={{height:'100%'}}>
      <Room roomName='room1' roomObj={props.room1} style={{paddingBottom:20,paddingTop:10,backgroundColor:'#ffffba'}}/>
      <Room roomName='room2' roomObj={props.room2} style={{paddingTop:10,paddingBottom:20,backgroundColor:'#ffdfba'}}/>
      <Room
        roomName='Garage'
        roomObj={props.controller}
        style={{paddingTop:10,paddingBottom:20,backgroundColor:'#bae1ff'}}
        disabled
      />
      {updateTarget.roomObj&&<Dialog
        title={"Update Target "+(updateTarget.dataType=='target_temp'?'Temperature':'Humidity')}
        actions={[
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={()=>setOpenTargetSelect(false)}
          />,
          <RaisedButton
            label="Save"
            primary={true}
            disabled={error||!updateTarget.value||updateTarget.value<10}
            onClick={()=>{
              var path = updateTarget.roomName+"/"+updateTarget.dataType
              firebase.update(path,{value:Number(updateTarget.value),date_modified:NOW()})
              handleStatusChange(updateTarget.roomName)
              setOpenTargetSelect(false)
            }}
          />,
        ]}
        modal={false}
        open={openTargetSelect}
        onRequestClose={()=>setOpenTargetSelect(false)}
        contentStyle={{width:'98%'}}
        titleStyle={{whiteSpace:'nowrap'}}
      >
        <TextField
          value={updateTarget.value}
          onChange={(e,value)=>updateUpdateTarget({value:value})}
          hintText="target value"
          type='number'
          fullWidth
          inputStyle={{textAlign:'center'}}
          autoFocus
        />
      {error&&<p style={{color:'red'}}>{error}</p>}
        <Toggle
          label={updateTarget.dataType=='target_temp'?props[updateTarget.roomName].coolingMode?"Cooling Mode":'Heating Mode':props[updateTarget.roomName].humidifyingMode?"Humidifying Mode":'Dehumidifying Mode'}
          toggled={updateTarget.dataType=='target_temp'?props[updateTarget.roomName].coolingMode:props[updateTarget.roomName].humidifyingMode}
          onToggle={(e,value)=>{
            var updateValue = {}
            if(updateTarget.dataType=='target_temp'){
              updateValue.coolingMode=value
            }else{
              updateValue.humidifyingMode=value
            }
            firebase.update(updateTarget.roomName,updateValue)
            handleStatusChange(updateTarget.roomName,setTimeout(()=>setOpenTargetSelect(false),500))
          }}
        />
      </Dialog>}
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
  withState('openTargetSelect','setOpenTargetSelect',false),
  withState('updateTarget','setUpdateTarget',{}),
  withState('error','setError',false),
  withHandlers({
    updateUpdateTarget:props => ({value}) => {
      console.log(value);
      props.setUpdateTarget({...props.updateTarget,value:value})
      var limit = {temp:{min:35,max:99,minFirstDigit:3},hum:{min:20,max:99,minFirstDigit:2}};
      var dataType = props.updateTarget.dataType=='target_temp'?'temp':'hum'
      if(!value>0){props.setError(false);return}
      if(dataType=='temp'){
        console.log(dataType,value,limit);
        if(value < limit.temp.minFirstDigit){
          console.log('Failed At: minFirstDigit');
          props.setError('Minimum temperature value is '+limit.temp.min)
        }else if(value > 10 && (value < limit.temp.min || value > limit.temp.max)){
          console.log('Failed At: not between limits');
          props.setError('Temperature should be between '+limit.temp.min+' and '+limit.temp.max)
        }else{
          props.setError(false)
        }
      }else if(dataType=='hum'){
        if(value < limit.hum.minFirstDigit){
          console.log('Failed At: minFirstDigit');
          props.setError('Minimum humidity value is '+limit.hum.min)
        }else if(value > 10 && (value < limit.hum.min || value > limit.hum.max)){
          console.log('Failed At: not between limits');
          props.setError('Humidity should be between '+limit.hum.min+' and '+limit.hum.max)
        }else{
          props.setError(false)
        }
      }else{
        props.setError(false)
      }
    },
    updateTargetSelect:props=>(roomName,dataType,roomObj)=>{
      props.setOpenTargetSelect(true),
      props.setUpdateTarget({roomName:roomName,dataType:dataType,value:props[roomName][dataType],roomObj:roomObj})
    },
    compareTargetToState:props=>(target,currentState,shouldTargetBeHigher)=>{
      //console.log(target,currentState,shouldTargetBeHigher);
      if(shouldTargetBeHigher){
        return Number(target)>Number(currentState)
      }else{
        return Number(target)<Number(currentState)
      }
    }
  }),
  withHandlers({
    handleStatusChange:props=>(roomName)=>{
      return;
      var roomObj = props[roomName]
      if(props.updateTarget.roomName==roomName){
        roomObj[props.updateTarget.dataType]=props.updateTarget.value
      }
      var isHumOn = props.compareTargetToState(roomObj.target_humidity,roomObj.humidity,roomObj.humidifyingMode)
      //console.log(isHumOn);
      var isTempOn = props.compareTargetToState(roomObj.target_temp,roomObj.temp,!roomObj.coolingMode)
      //console.log(isTempOn);
      props.firebase.update(roomName,{isHumOn:isHumOn})
      props.firebase.update(roomName,{isTempOn:isTempOn})
      props.firebase.update(roomName,{heatPadOn:(isTempOn&&roomObj.coolingMode?'1':false)})
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
