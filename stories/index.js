import React from 'react'
import { storiesOf } from '@storybook/react'
import Header from '../src/components/Header/Header'
import Temp from '../src/components/Temperature/temp.js'
import { muiTheme } from 'storybook-addon-material-ui'
import addons, { mockChannel } from '@storybook/addons';

addons.setChannel(mockChannel());
storiesOf('Temperature', module)
  .addDecorator(muiTheme())
  .add('TempReadout', () => <Temp label='test'/>)

storiesOf('Header', module)
  .addDecorator(muiTheme())
  .add('Header', () => <Header testSaga={{ message: 'my header' }} />)
