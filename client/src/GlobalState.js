import React, {createContext, useState, useEffect,useReducer} from 'react'
import ProductsAPI from './api/ProductsAPI'
import axios from 'axios'
import UserAPI from './api/UserAPI'
import CategoriesAPI from './api/CategoriesAPI'
import {useDispatch, useSelector} from 'react-redux'
import {dispatchLogin, fetchUser, dispatchGetUser} from './redux/actions/authAction'
export const GlobalState = createContext()


export const DataProvider = ({children}) =>{
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)    //////////// For UserAPI
    useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if(firstLogin){
      const getToken = async () => {
        const res = await axios.post('/user/refresh_token', null)
        dispatch({type: 'GET_TOKEN', payload: res.data.access_token})
      }
      getToken()
    }
  },[auth.isLogged, dispatch])
    useEffect(() => {
        if(token){
          const getUser = () => {
            dispatch(dispatchLogin())
            return fetchUser(token).then(res => {
              dispatch(dispatchGetUser(res))
            })
          }
          getUser()
        }
      },[token, dispatch])
    ////////////////////

  //   useEffect(() =>{
  //     const firstLogin = localStorage.getItem('firstLogin')
  //     if(firstLogin){
  //         const refreshToken = async () =>{
  //           const res = await axios.post('/user/refresh_token', null)
      
  //           setToken(res.data.access_token)
  
  //             setTimeout(() => {
  //                 refreshToken()
  //             }, 10 * 60 * 1000)
  //         }
  //         refreshToken()
  //     }
  // },[])


    const state = {
        token: token,
        productsAPI: ProductsAPI(),
        userAPI: UserAPI(token),
        categoriesAPI: CategoriesAPI() 
    }
    return (
        <GlobalState.Provider value={state}>
            {children} 
        </GlobalState.Provider>
    )
}
