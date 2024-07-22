const storeInSession = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value))
  // return sessionStorage.setItem(key, JSON.stringify(value))
}

const getFromSession = (key) => {
  return JSON.parse(localStorage.getItem(key))
  // return JSON.parse(sessionStorage.getItem(key))
}

const removeFromSession = (key) => {
  return localStorage.removeItem(key)
  // return sessionStorage.removeItem(key)
}

const logOutUser = () => {
  return localStorage.clear()
  // return sessionStorage.clear()
}

export { storeInSession, getFromSession, removeFromSession, logOutUser }
