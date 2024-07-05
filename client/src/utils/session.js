const storeInSession = (key, value) => {
  return sessionStorage.setItem(key, JSON.stringify(value))
}

const getFromSession = (key) => {
  return JSON.parse(sessionStorage.getItem(key))
}

const removeFromSession = (key) => {
  return sessionStorage.removeItem(key)
}

const logOutUser = () => {
  return sessionStorage.clear()
}

export { storeInSession, getFromSession, removeFromSession, logOutUser }
