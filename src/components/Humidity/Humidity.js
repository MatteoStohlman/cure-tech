import React from 'react';
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import {withState,compose,withHandlers} from 'recompose'
import PropTypes from 'prop-types';
import moment from 'moment'
import muiThemeable from 'material-ui/styles/muiThemeable';
import { withFirebase, firebaseConnect } from 'react-redux-firebase'
import './style.css'
import numeral from 'numeral'
//COMPONENTS//
  import SingleValue from 'components/Dashboard/SingleValue'

//ACTIONS//




const COMPONENT_NAME = ({
  //PROPS FROM PARENT//
    humidity,target,isOn,
  //REDUX//

  //STATE

  //OTHER
    muiTheme,
}) => {
  return (
    <SingleValue value={numeral(humidity).format('0.00')+"%"} min={10} max={99}>
      <div style={{position:'absolute',top:2,right:2,color:'red',fontSize:13,fontWeight:'normal',lineHeight:'normal'}}>
        {target}%
      </div>
      {isOn && <div className='blinkText' style={{position:'absolute',bottom:2,left:2,color:'cyan',fontSize:11,fontWeight:'normal',lineHeight:'normal'}}>
        humidifying...
      </div>}
    </SingleValue>
  )
}

COMPONENT_NAME.propTypes={
  //label:PropTypes.string.isRequired
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
