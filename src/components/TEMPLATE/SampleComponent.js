import React from 'react';
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import {withState,compose,withHandlers} from 'recompose'
import PropTypes from 'prop-types';
import moment from 'moment'
import muiThemeable from 'material-ui/styles/muiThemeable';
import { withFirebase, firebaseConnect } from 'react-redux-firebase'
//COMPONENTS//
  import TextField from 'material-ui/TextField';

//ACTIONS//




const COMPONENT_NAME = ({
  //PROPS FROM PARENT//
    temp,
  //REDUX//

  //STATE

  //OTHER
    muiTheme,
}) => {
  return (
    <TextField
      hintText={label}
      floatingLabelText={label}
    />
  )
}

const mapStateToProps = state => ({
})

function matchDispatchToProps(dispatch){
  return  bindActionCreators({
  },dispatch)
}

export default compose(
  withFirebase,
  connect(mapStateToProps,matchDispatchToProps),
  firebaseConnect([
    'todos'
  ]),
  connect(mapStateToProps,matchDispatchToProps),
  muiThemeable(),
  withHandlers({
    createTodo: props => event => {
      return props.firebase.push('todos', { some: 'data' })
    }
  })
  //withState('showSearchbox','toggleSearchbox',true)
)(COMPONENT_NAME)
