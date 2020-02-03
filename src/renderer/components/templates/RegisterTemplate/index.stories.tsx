import React from 'react'
import StoryRouter from 'storybook-react-router'
import { action } from '@storybook/addon-actions'
import RegisterTemplate from './'

export default {
  title: 'Components/Templates/RegisterTemplate',
  decorators: [StoryRouter()],
}

export const registerTemplate = () => (
  <div style={{ width: 1366, height: 768 }}>
    <RegisterTemplate onSubmit={action('onSubmit')} />
  </div>
)
