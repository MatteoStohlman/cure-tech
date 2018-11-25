import React from 'react';
import {withState,compose,withHandlers} from 'recompose'
import moment from 'moment'
import muiThemeable from 'material-ui/styles/muiThemeable';
//COMPONENTS//
  import TextField from 'material-ui/TextField';

//ACTIONS//




const COMPONENT_NAME = ({label,muiTheme,...props}) => {
  return (
    <TextField
      hintText={label}
      floatingLabelText={label}
    />
  )
}

export default muiThemeable()(COMPONENT_NAME)
