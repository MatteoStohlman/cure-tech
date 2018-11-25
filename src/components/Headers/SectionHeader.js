import React from 'react';
import {withState,compose,withHandlers} from 'recompose'
import moment from 'moment'
import muiThemeable from 'material-ui/styles/muiThemeable';
//COMPONENTS//
  import TextField from 'material-ui/TextField';

//ACTIONS//




const COMPONENT_NAME = ({style,center,muiTheme,...props}) => {
  const styles = {
    fontSize:20,
    marginTop:5,
    marginBottom:10,
    marginLeft:10,
    fontWeight:'bold',
    letterSpacing:'1px',
    textAlign:center?"center":'left',
    ...style
  }
  return (
    <div style={styles}>
      {props.children}
    </div>
  )
}

export default compose(
  muiThemeable(),
)(COMPONENT_NAME)
