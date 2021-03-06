import {useState, useEffect} from 'react'
import axios from 'axios'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [users, setUsers] = useState([])
    const [history, setHistory] = useState([])
    const [callback, setCallback] = useState(false)
    useEffect(() =>{
        if(token){
            const getUser = async () =>{
                try {
                    const res = await axios.get('/user/infor', {
                        headers: {Authorization: token}
                    })
                    setIsLogged(true)
                    setUsers(res.data)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    setCart(res.data.cart)

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUser()
            
        }
    },[token])

    useEffect(() => {
       if(token){
           const getHistory = async() =>{
               if(isAdmin){
                const res = await axios.get('api/payment',{
                    headers: {Authorization:token}
                })
                setHistory(res.data);
               }else{
                const res = await axios.get('user/history',{
                    headers: {Authorization:token}
                })
                setHistory(res.data);
               }
                
           }
           getHistory()
       }
    }, [token, callback, isAdmin])
    
    const addCart = async (product) => {
        if(!product.size) return alert("Please choose size")

        if(!isLogged) return alert("Please login to continue buying")
        
        const check = cart.every(item =>{
            return item.product_id !== product.product_id
        })
        const filter = cart.filter(item=> (item.product_id === product.product_id))
        const checkSize = filter.every(item =>{
            return item.size !== product.size
        })

        if(check){ //item.product_id =/= product.product_id
            setCart([...cart, {...product, quantity: 1}])
            await axios.patch('/user/addcart', {cart: [...cart, {...product, quantity: 1}]}, {
                headers: {Authorization: token}
            })
        }
        else{ // item._id === product._id
                if(checkSize){
                    setCart([...cart, {...product, quantity: 1}])
                    await axios.patch('/user/addcart', {cart: [...cart, {...product, quantity: 1}]}, {
                        headers: {Authorization: token}
                    })
                }
                else alert("This product is already added to cart")

        }
    }
    
    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        users: [users, setUsers],
        addCart: addCart,
        history: [history, setHistory],
        callback: [callback, setCallback]
    }
}

export default UserAPI
 