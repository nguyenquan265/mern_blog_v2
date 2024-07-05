import { createContext, useEffect, useState } from 'react'
import { getFromSession } from '../utils/session'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  console.log(user)

  useEffect(() => {
    setLoading(true)
    const user = getFromSession('user')

    if (user) {
      setUser(user)
      setLoading(false)
    } else {
      setUser(null)
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
