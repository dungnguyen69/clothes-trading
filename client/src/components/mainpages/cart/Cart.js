import React, { useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import {Link} from 'react-router-dom'
// import { Button } from 'react-native'
import { useSelector, useDispatch} from 'react-redux'
// import {fetchHistory, dispatchHistory} from '../../../redux/actions/usersAction'

import axios from 'axios'
import PaypalButton from './PaypalButton'
function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const token = useSelector(state => state.token)
    const [total,setTotal] = useState(0)
    // const [callback, setCallback] = useState(false)
    // const [loading, setLoading] = useState(false)

    // const dispatch = useDispatch()

    console.log(cart);
    useEffect(() => {
        const getTotal = () =>{
            const total = cart.reduce((prev,item)=>{
                return prev + (item.price*item.quantity)
            }, 0)
            setTotal(total)
        } 
        getTotal()
    }, [cart])
    // useEffect(()=>{
    //     fetchHistory(token).then(res =>{
    //         dispatch(dispatchHistory(res))
    //     })
    // },[token, dispatch, callback])

    const addToCart = async(cart) =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }
    const increment = (id,size) =>{
        cart.forEach(item => {
            if(item.product_id === id && item.size === size){
                item.quantity +=1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }
    const decrement = (id,size) =>{
        cart.forEach(item => {
            if(item.product_id === id && item.size === size){
                item.quantity ===1 ? item.quantity = 1: item.quantity -=1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }
    const removeProduct = (id,size) =>{
        if(window.confirm("Do you want to delete this product ?")){
            cart.forEach((item,index) =>{
                if(item.product_id === id && item.size === size)
                    cart.splice(index, 1)
            })
            setCart([...cart])
            addToCart(cart)
        }
    }
    const tranSuccess = async(payment) =>{
       const {paymentID, address} = payment;
        await axios.post('/api/payment', {cart, paymentID, address}, {
            headers: {Authorization: token}
        })
       setCart([])
       addToCart([])
       alert("You have successfully placed an order.")
    }
    if(cart.length ==0) 
        return <h2 style = {{textAlign: "center", fontSize: "5rem"}}>Cart Empty</h2>

    return (
        <div>
            {
                cart.map(product=>(
                    <div className="detail cart" key={product.product_id}>
                        <img src={product.images.url} alt=""/>
                        <div className="box-detail">
                            <h2>{product.title}</h2>
                            <h3>$ {product.price * product.quantity}</h3>
                            <p>{product.description}</p>
                            <p>{product.content}</p>
                            <p>Size: <span className='size'>{product.size}</span></p>

                            <div className="amount">
                                <button onClick = {()=>decrement(product.product_id,product.size)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick = {()=>increment(product.product_id,product.size)}> + </button>
                            </div>

                            <div className="delete" 
                            onClick = {()=> removeProduct(product.product_id,product.size)}>
                                X
                            </div>
                        </div>
                    </div>
                ))
            }

            <div className="total">
                <h3>Total: $ {total}</h3>

                <div className="checkout">
                <Link id="btn_checkout" to={`/checkout`}>
                        Checkout
                </Link>
                </div>

                <PaypalButton 
                total={total}
                tranSuccess = {tranSuccess} />

            </div>

        </div>
    )
}

export default Cart
