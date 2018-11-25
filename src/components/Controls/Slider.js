import React from 'react';
import {compose,withState} from 'recompose'
import muiThemeable from 'material-ui/styles/muiThemeable';
//COMPONENTS//
  import Slider from 'material-ui/Slider';

//ACTIONS//




const COMPONENT_NAME = ({
  //PROPS FROM PARENT//
    value,min=32,max=100,onChange,onDragStop,
  //REDUX//

  //STATE
    newSetting,updateNewSetting,
  //OTHER
    muiTheme,
}) => {
  const styles = {
    root: {
      display: 'inline-block',
      height: 100,
      justifyContent: 'space-around',
      verticalAlign:'bottom'
    },
  };
  return (
    <div style={styles.root}>
      <Slider
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={(e,value)=>onChange&&onChange(value)}
        onDragStop={onDragStop}
        style={{height: 100,display:"inline-block"}}
        axis="y"
        sliderStyle={{marginTop:0,marginBottom:0}}/>
    </div>
  )
}

export default compose(
  muiThemeable(),
  withState('newSetting','updateNewSetting',props=>props.value)
)(COMPONENT_NAME)
