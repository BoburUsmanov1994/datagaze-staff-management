// ** React Imports
import {createContext, useEffect, useState} from 'react'

// ** Next Import
import {useRouter} from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import {request} from "../services/api";
import {get} from "lodash";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  checkAuth:() => Promise.resolve(),
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({children}) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
       checkAuth();
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    request
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
       window.localStorage.setItem(authConfig.storageTokenKeyName, response.data?.jwt)
        const returnUrl = router.query.returnUrl
        setUser({...response.data.userData})
        window.localStorage.setItem('userData', JSON.stringify(response.data?.user))
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
        checkAuth()
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({email: params.email, password: params.password})
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const checkAuth = async (token=null) => {
    if(token){
      setLoading(true)
      await request
        .get(authConfig.meEndpoint, {params: {populate: '*'},headers:{Authorization:`Bearer ${token}`}})
        .then(async response => {
          window.localStorage.setItem('accessToken',token)
          setUser({...response.data})
          window.localStorage.setItem('userData', JSON.stringify(response.data))
          setLoading(false)
          setUser({...response.data})
        })
        .catch(() => {
          localStorage.removeItem('userData')
          localStorage.removeItem('accessToken')
          setUser(null)
          setLoading(false)
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login')
          }
        })
    }else {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await request
          .get(authConfig.meEndpoint, {params: {populate: '*'}})
          .then(async response => {
            setLoading(false)
            setUser({...response.data})
            // if(get(response,'data.company')) {
            //
            // }else{
            //   localStorage.removeItem('userData')
            //   localStorage.removeItem('accessToken')
            //   setUser(null)
            //   router.replace({
            //     pathname: '/register',
            //     query: {token: storedToken, userId: get(response, 'data.id')}
            //   })
            // }
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    checkAuth:checkAuth
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export {AuthContext, AuthProvider}
