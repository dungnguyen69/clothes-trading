import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import {useSelector, useDispatch} from 'react-redux'


const initialState = {
    name: '',
    totalPrice: 0,
    address: '',
    province:'',
    district:'',
    phoneNumber:'',
    err: '',
    success: ''
}
function Checkout() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [data, setData] = useState(initialState)
    const {name,
    totalPrice,
    address,
    province,
    district,
    phoneNumber,
    err,
    success} = data
    const [total,setTotal] = useState(0)
    useEffect(() => {
        const getTotal = () =>{
            const total = cart.reduce((prev,item)=>{
                return prev + (item.price*item.quantity)
            }, 0)
            setTotal(total)
        } 
        getTotal()
    }, [cart])
    const handleChange = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err:'', success: ''})
    }
    const tranSuccess = async(payment) =>{
        const {paymentID, address} = payment;
 
         await axios.post('/api/payment', {cart, paymentID, address}, {
             headers: {Authorization: token}
         })
        // setCart([])
        // addToCart([])
        alert("You have successfully placed an order.")
     }
    return (
        <div className="profile_page">
            <div className="col-left">

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name"
                    placeholder="Your name"/>
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="text" name="phone" id="phone"
                    placeholder="Phone number" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="province">Province</label>
                    <input type="text" name="province" id="province"
                    placeholder="Province" onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="district">District</label>
                    <input type="text" name="district" id="district"
                    placeholder="District" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" name="address" id="address"
                    placeholder="Address" onChange={handleChange}/>
                </div>
                <button onClick={tranSuccess}> Update</button>

            </div>
        </div>
    )
}

export default Checkout
