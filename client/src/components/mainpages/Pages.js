import React, {useContext} from 'react'
import {Switch, Route} from 'react-router-dom'
import Products from './products/Products'
import DetailProduct from './detailProduct/DetailProduct'
import Login from './auth/Login'
import Register from './auth/Register'
import ActivationEmail from './auth/ActivationEmail'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import OrderHistory from './history/OrderHistory'
import OrderDetails from './history/OrderDetails'
import Profile from './profile/profile'
import Cart from './cart/Cart'
import Checkout from './cart/checkout'
import EditUser from './profile/EditUser'

import NotFound from './utils/not_found/NotFound'
import Categories from './categories/Categories'
import CreateProduct from './createProduct/CreateProduct'
import { GlobalState } from '../../GlobalState'
function Pages() {
    const state =  useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin

    return (
        <Switch>
            <Route path="/" exact component={Products} />
            <Route path="/detail/:id" exact component={DetailProduct} />

            <Route path="/login" exact component={isLogged ? NotFound : Login} />
            <Route path="/register" exact component={isLogged ? NotFound : Register} />
            <Route path="/forgot_password" exact component={isLogged ? NotFound : ForgotPassword} />
            <Route path="/user/reset/:token" component={isLogged ? NotFound : ResetPassword} exact />
            <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />

            <Route path="/category" exact component={isAdmin ? Categories : NotFound} />

            <Route path="/history" exact component={isLogged ?  OrderHistory : NotFound} />
            <Route path="/history/:id" exact component={isLogged ?  OrderDetails : NotFound} />
            <Route path="/create_product" exact component={isAdmin ?  CreateProduct : NotFound} />
            <Route path="/edit_product/:id" exact component={isAdmin ?  CreateProduct : NotFound} />

            <Route path="/cart" exact component={Cart} />
            <Route path="/checkout" exact component={Checkout} />

            <Route path="/profile" exact component={isLogged ?  Profile : NotFound} />
            <Route path="/edit_user/:id" exact component={isAdmin ?  EditUser : NotFound} />


            <Route path="*" exact component={NotFound} />
        </Switch>
    )
}

export default Pages
