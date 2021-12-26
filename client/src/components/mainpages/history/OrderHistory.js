import React, {useState, useContext, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import {Link} from 'react-router-dom'
import axios from 'axios'
import Loading from '../utils/loading/Loading'
import { FaTrashAlt, FaEye } from "react-icons/fa";
import {useSelector} from 'react-redux'

function OrderHistory() {
    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const token = useSelector(state => state.token)
    const [loading, setLoading] = useState(false)
    const [callback, setCallback] = state.userAPI.callback

    useEffect(() => {
        if(token){
            const getHistory = async() =>{
                if(isAdmin){
                    const res = await axios.get('/api/payment', {
                        headers: {Authorization: token}
                    })
                    setHistory(res.data)
                }else{
                    const res = await axios.get('/user/history', {
                        headers: {Authorization: token}
                    })
                    setHistory(res.data)
                }
            }
            getHistory()
        }
    },[token, isAdmin, setHistory])

    const handleDelete = async (id) => {
        try {
                if(window.confirm("Are you sure you want to delete this order?")){
                    setLoading(true)
                    const deleteOrder =  axios.delete(`/api/payment/${id}`, {
                        headers: {Authorization: token}
                    })
                    await deleteOrder
                    setCallback(!callback)
                    setLoading(false)
                }
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    if(loading) return <div><Loading /></div>

    return (
        <div className="history-page">
            <h2>History</h2>

            <h4>You have {history.length} orders</h4>

            <table>
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Date of Purchased</th>
                        <th>View</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history.map(items => (
                            <tr key={items._id}>
                                <td>{items.paymentID}</td>
                                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                                <td><Link to={`/history/${items._id}`}><FaEye/></Link></td>
                                <td><FaTrashAlt title="Remove"  onClick={() => handleDelete(items._id)}/></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OrderHistory