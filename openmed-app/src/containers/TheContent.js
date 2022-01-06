import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { CContainer, CFade, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'

// import { apiServer } from '../api/config'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
//
// Currently, this configuration is unnecessary since the keycloak provider requires the user to log in during the init phase
//
// eslint-disable-next-line react/prop-types
function AuthRoute({ ...params }) {
  // const [currentUser, setCurrentUser] = useState(null)

  // apiServer
  //   .get('/v1/users/currentuser')
  //   .then((response) => {
  //     setCurrentUser(response.data.currentUser)
  //     console.log('currentUser', currentUser)
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   })

  // if (!currentUser) {
  //   return <Redirect to="/login" />
  // }

  return (
    <Route
      {...params}
      render={(props) => (
        <CFade>
          <params.component {...props} />
        </CFade>
      )}
    />
  )
}

const TheContent = () => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={<CSpinner color="primary" />}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <AuthRoute
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    private={route.private}
                    component={route.component}
                  />
                )
              )
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
