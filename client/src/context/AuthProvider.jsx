import { createContext, useEffect, useState } from 'react'
import { getFromSession } from '../utils/session'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)
  console.log(user)

  useEffect(() => {
    setLoading(true)
    const user = getFromSession('user')
    const accessToken = getFromSession('accessToken')

    if (!user || !accessToken) {
      setUser(null)
      setAccessToken(null)
      setLoading(false)
    } else {
      setUser(user)
      setAccessToken(accessToken)
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, setUser, accessToken, setAccessToken }}
    >
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
