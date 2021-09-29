exports.setToken = token => {
  localStorage.setItem('access_token', token)
}

exports.setUser = user => {
  localStorage.setItem('user', user)
}

exports.getToken = () => {
  return localStorage.getItem('access_token')
}

exports.getUser = () => {
  return localStorage.getItem('user')
}
