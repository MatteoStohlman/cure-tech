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
  import Temp from 'components/Temperature/Temperature'
  import Humidity from 'components/Humidity/Humidity'
  import Paper from 'material-ui/Paper';
  import SectionHeader from 'components/Headers/SectionHeader'
  import Slider from 'components/Controls/Slider'
  import Margin from 'components/Layout/Margin'
  import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine} from 'recharts';
  import Dialog from 'material-ui/Dialog';
  import RaisedButton from 'material-ui/RaisedButton';
  import FlatButton from 'material-ui/FlatButton';
//ACTIONS//




const COMPONENT_NAME = ({
  //PROPS FROM PARENT//

  //REDUX//
    room1,room2,
  //STATE
    openTargetSelect,setOpenTargetSelect,
    updateTargetValue,setUpdateTargetValue,
  //HANDLER
    updateTargetSelect,
  //OTHER
    muiTheme,firebase,...props
}) => {
  if(!room1||!room2){
    return(
      <div>Loading...</div>
    )
  }
  const Room = ({roomName,roomObj,style}) =>{
    return(
      <div style={style}>
        <SectionHeader>{roomName}</SectionHeader>
        <div style={{...styles.split,height:100,borderRight:'2px solid gray'}}>
          <div style={{...styles.subHeader,position:'absolute',top:2,right:5,color:'red'}} onClick={()=>updateTargetSelect(roomName,'target_temp')}>
            {numeral(roomObj.target_temp).format('0.0')+"°F"}
          </div>
          <div style={{...styles.centeredText,lineHeight:'100px',fontSize:25,}}>
            {numeral(roomObj.temp).format('0.00')+"°F"}
          </div>
          {roomObj.isTempOn&&<div className='blinkText' style={{...styles.subHeader,position:'absolute',bottom:2,left:5}}>
            cooling...
          </div>}
        </div>
        <div style={{...styles.split,height:100}}>
          <div style={{...styles.subHeader,position:'absolute',top:2,right:5,color:'red'}} onClick={()=>updateTargetSelect('roomName','target_humidity')}>
            {numeral(roomObj.target_humidity).format('0.0')+"%"}
          </div>
          <div style={{...styles.centeredText,lineHeight:'100px',fontSize:25,}}>
            {numeral(roomObj.humidity).format('0.00')+"%"}
          </div>
          {roomObj.isHumOn&&<div className='blinkText' style={{...styles.subHeader,position:'absolute',bottom:2,left:5}}>
            humidifying...
          </div>}
        </div>
        {roomObj.updated && <div style={{...styles.subHeader}}>Last updated: {roomObj.updated.format('MM/DD HH:mm')}</div>}
      </div>
    )
  }
  return (
    <div>
      <Room roomName='room1' roomObj={room1} style={{marginBottom:40}}/>
      <div style={{width:'90%',marginLeft:'auto',marginRight:'auto',height:1,backgroundColor:'gray'}}/>
      <Room roomName='room2' roomObj={room2} style={{marginTop:40}}/>


      <Dialog
        title={"Update Target "+(updateTargetValue.dataType=='target_temp'?'Temperature':'Humidity')}
        actions={[
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={()=>setOpenTargetSelect(false)}
          />,
          <RaisedButton
            label="Save"
            primary={true}
            onClick={()=>{
              var path = updateTargetValue.roomName+"/"+updateTargetValue.dataType
              console.log(path,updateTargetValue);
              firebase.update(path,{value:Number(updateTargetValue.value),date_modified:NOW()})
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
          value={updateTargetValue.value}
          onChange={(e,value)=>setUpdateTargetValue({...updateTargetValue,value:value})}
          hintText="target value"
          type='number'
          fullWidth
          inputStyle={{textAlign:'center'}}
          autoFocus
        />
      </Dialog>
    </div>
  )
}

const mapStateToProps = state => ({
  room1:state.firebase.data.room1,
  room2:state.firebase.data.room2,
})

function matchDispatchToProps(dispatch){
  return  bindActionCreators({
  },dispatch)
}

export default compose(
  withFirebase,
  connect(mapStateToProps,matchDispatchToProps),
  firebaseConnect([
    { path: '/room1/log', queryParams: [ 'limitToFirst=300' ] },
    'room1/currentState',
    'room1/isHumOn',
    'room1/isTempOn',
    'room1/target_humidity',
    'room1/target_temp',
    'room1/updated',
    { path: '/room2/log', queryParams: [ 'limitToFirst=300' ] },
    'room2/currentState',
    'room2/isHumOn',
    'room2/isTempOn',
    'room2/target_humidity',
    'room2/target_temp',
    'room2/updated',
  ]),
  withProps(props=>({
    room1:{
      target_temp:(props.room1&&props.room1.target_temp)?props.room1.target_temp.value:0,
      target_humidity:(props.room1&&props.room1.target_humidity)?props.room1.target_humidity.value:0,
      temp:(props.room1&&props.room1.currentState)?props.room1.currentState.temp:0,
      humidity:(props.room1&&props.room1.currentState)?props.room1.currentState.hum:0,
      isTempOn:props.room1 && props.room1.isTempOn,
      isHumOn:props.room1 && props.room1.isHumOn,
      log:props.room1 && props.room1.log,
      updated:props.room1 && moment(props.room1.updated),
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
    }
  })),
  muiThemeable(),
  withState('openTargetSelect','setOpenTargetSelect',false),
  withState('updateTargetValue','setUpdateTargetValue',{}),
  withHandlers({
    updateTargetSelect:props=>(roomName,dataType)=>{
      props.setOpenTargetSelect(true),
      props.setUpdateTargetValue({roomName:roomName,dataType:dataType,value:props[roomName][dataType]})
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
