import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { CFade } from '@coreui/react'

import { apiServer } from '../api/config'

const isLogged = async () => {
  const response = await apiServer.get('/v1/users/currentuser')

  if (!response.data.currentUser) return false

  console.log('currentUser', response.data.currentUser)
  return true
}

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ ...params }) => {
  console.log(params)

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page

    <Route
      {...params}
      render={(props) =>
        isLogged() ? (
          <CFade>
            <params.component {...props} />
          </CFade>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  )
}

export default React.memo(PrivateRoute)
