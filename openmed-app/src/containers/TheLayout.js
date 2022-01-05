import React from 'react'
import { TheContent, TheSidebar, TheFooter, TheHeader } from './index'
// import { apiServer } from '../api/config'

const TheLayout = () => {
  // const [currentUser, setCurrentUser] = useState('')

  // useEffect(() => {
  //   apiServer.interceptors.request.use(
  //     function (config) {
  //       apiServer
  //         .get('/v1/users/currentuser')
  //         .then((response) => {
  //           setCurrentUser(response.data.currentUser)
  //         })
  //         .catch((err) => {
  //           console.error(err)
  //           Promise.reject(err)
  //         })
  //       if (currentUser) {
  //         console.log(currentUser)
  //         config.headers.Cookie = currentUser
  //       }
  //       return config
  //     },
  //     function (error) {
  //       return Promise.reject(error)
  //     }
  //   )
  // }, [])

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
