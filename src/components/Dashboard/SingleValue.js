import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
//COMPONENTS//
  import Paper from 'material-ui/Paper';
//ACTIONS//




const COMPONENT_NAME = ({
  //PROPS FROM PARENT//
    value,wrapperStyles,
  //OTHER
    muiTheme,...props
}) => {
  const styles = {
    width:100,height:100,fontSize:25,lineHeight:'100px',textAlign:'center',
    display:'inline-block',
    position:'relative',
    ...wrapperStyles
  }
  return (
    <Paper style={styles}>
      {value}
      {props.children}
    </Paper>
  )
}

export default muiThemeable()(COMPONENT_NAME)
