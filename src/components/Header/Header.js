import React from 'react'
import PropTypes from 'prop-types'

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'

export default class HeaderComponent extends React.Component {
  static propTypes = {
    testSaga: PropTypes.object
  }

  render() {
    const { message } = this.props.testSaga
    console.log(message)

    return (
      <div>
        <Toolbar style={{height:25}}>
          <ToolbarGroup>
            <div style={{position:'fixed',left:0,top:0,fontSize:20,lineHeight:'25px',letterSpacing:'2px',width:'100vw',textAlign:'center',fontVariant:'small-caps'}}>CureTech</div>
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  }
}
