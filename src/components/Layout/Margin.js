import React from 'react';
import {compose} from 'recompose'
import moment from 'moment'
import muiThemeable from 'material-ui/styles/muiThemeable';
//COMPONENTS//
  import TextField from 'material-ui/TextField';

//ACTIONS//




const COMPONENT_NAME = ({top=0,left=0,bottom=0,right=0,muiTheme,...props}) => {
  return (
    <div
      style={{
        marginTop:top,
        marginLeft:left,
        marginBottom:bottom,
        marginRight:right,
        display:'inline'
      }}
    />
  )
}

 export default muiThemeable()(COMPONENT_NAME)
