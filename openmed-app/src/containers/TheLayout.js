import React, { useEffect } from 'react'
import { TheContent, TheSidebar, TheFooter, TheHeader } from './index'
import { apiServer } from '../api/config'

const TheLayout = () => {
  useEffect(() => {
    apiServer.interceptors.request.use(
      function (config) {
        let currentUser = null

        apiServer.get('/v1/users/currentuser').then((response) => {
          currentUser = response.body.currentUser
        })

        if (currentUser) {
          // config.headers.Cookie = `Bearer ${keycloak.token}`
        }
        return config
      },

      function (error) {
        return Promise.reject(error)
      }
    )
  }, [])

  return (
    <div>
      <div className="c-app c-default-layout">
        <TheSidebar />
        <div className="c-wrapper">
          <TheHeader />
          <div className="c-body">
            <TheContent />
          </div>
          <TheFooter />
        </div>
      </div>
    </div>
  )
}

export default TheLayout
