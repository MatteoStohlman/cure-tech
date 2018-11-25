import React from 'react';
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import {compose,withProps,withState} from 'recompose'
import moment from 'moment'
import muiThemeable from 'material-ui/styles/muiThemeable';
import { withFirebase, firebaseConnect } from 'react-redux-firebase'
import {NOW} from 'Utilities/Date'
//COMPONENTS//
  import TextField from 'material-ui/TextField';
  import Temp from 'components/Temperature/Temperature'
  import Humidity from 'components/Humidity/Humidity'
  import Paper from 'material-ui/Paper';
  import SectionHeader from 'components/Headers/SectionHeader'
  import Slider from 'components/Controls/Slider'
  import Margin from 'components/Layout/Margin'
  import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
//ACTIONS//




const COMPONENT_NAME = ({
  //PROPS FROM PARENT//

  //REDUX//
    room1,room2,
  //STATE
    room1Targets,updateRoom1Targets,
    room2Targets,updateRoom2Targets,
  //HANDLER
    createTodo,
  //OTHER
    muiTheme,firebase,...props
}) => {
  console.log(room2.log);
  return (
    <div>
      <Paper style={{padding:20}}>
        <SectionHeader>Room 1</SectionHeader>
        <Temp temp={room1.temp} target={room1Targets.temp||room1.target_temp} isOn={room1.isTempOn}/>
        <Slider
          value={room1Targets.temp||room1.target_temp}
          onDragStop={(e)=>firebase.update('room1/target_temp',{value:room1Targets.temp,date_modified:NOW()})}
          onChange={(value)=>updateRoom1Targets({...room1Targets,temp:value})}
        />
        <Margin left={40}/>
        <Humidity humidity={room1.humidity} target={room1Targets.hum||room1.target_humidity} isOn={room1.isHumOn}/>
        <Slider
          value={room1.target_humidity}
          onDragStop={(e)=>firebase.update('room1/target_humidity',{value:room1Targets.hum,date_modified:NOW()})}
          onChange={(value)=>updateRoom1Targets({...room1Targets,hum:value})}
        />
      </Paper>
      <Paper style={{padding:20}}>
        <SectionHeader>Room 2</SectionHeader>
        <Temp temp={room2.temp} target={room2.target_temp} isOn={room2.isTempOn}/>
        <Slider
          value={room2.target_temp}
          onDragStop={(e)=>firebase.update('room2/target_temp',{value:room2Targets.temp,date_modified:NOW()})}
          onChange={(value)=>updateRoom2Targets({...room2Targets,temp:value})}
        />
        <Margin left={40}/>
        <Humidity humidity={room2.humidity} target={room2.target_humidity} isOn={room2.isHumOn}/>
        <Slider
          value={room2.target_humidity}
          onDragStop={(e)=>firebase.update('room2/target_humidity',{value:room2Targets.hum,date_modified:NOW()})}
          onChange={(value)=>updateRoom2Targets({...room2Targets,hum:value})}
        />
      </Paper>
      {(room2.log) &&
        <Paper>
          <LineChart width={800} height={200} data={Object.keys(room2.log).filter((logId,index)=>index<100).map((logId)=>room2.log[logId])}>
            <Line type="monotone" dataKey='hum' stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
          </LineChart>
        </Paper>
      }
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
    'room1','room2'
  ]),
  withProps(props=>({
    room1:{
      target_temp:(props.room1&&props.room1.target_temp)?props.room1.target_temp.value:0,
      target_humidity:(props.room1&&props.room1.target_humidity)?props.room1.target_humidity.value:0,
      temp:(props.room1&&props.room1.currentState)?props.room1.currentState.temp:0,
      humidity:(props.room1&&props.room1.currentState)?props.room1.currentState.hum:0,
      isTempOn:props.room1 && props.room1.isTempOn,
      isHumOn:props.room1 && props.room1.isHumOn
    },
    room2:{
      target_temp:(props.room2&&props.room2.target_temp)?props.room2.target_temp.value:0,
      target_humidity:(props.room2&&props.room2.target_humidity)?props.room2.target_humidity.value:0,
      temp:(props.room2&&props.room2.currentState)?props.room2.currentState.temp:0,
      humidity:(props.room2&&props.room2.currentState)?props.room2.currentState.hum:0,
      isTempOn:props.room2 && props.room2.isTempOn,
      isHumOn:props.room2 && props.room2.isHumOn,
      log:props.room2 && props.room2.log
    }
  })),
  muiThemeable(),
  withState('room1Targets','updateRoom1Targets',{temp:false,hum:false}),
  withState('room2Targets','updateRoom2Targets',{temp:false,hum:false}),
)(COMPONENT_NAME)
