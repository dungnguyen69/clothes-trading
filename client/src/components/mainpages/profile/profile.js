import Head from 'next/head'
import { useState, useContext, useEffect,useSelector } from 'react'
import { GlobalState } from '../../../GlobalState'
import Link from 'next/link'
import {useParams} from 'react-router-dom'
import valid from '../utils/valid'
import { patchData } from '../utils/fetchData'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { imageUpload } from '../utils/imageUpload'
import { isLength, isMatch } from '../utils/validation/validation'
import { showErrMsg, showSuccessMsg } from '../utils/notification/Notification'
import axios from 'axios'

import React from 'react'

const Profile = () => {
    const initialSate = {
        name: '',
        password: '',
        cf_password: '',
        err: '',
        success: ''
    }

    const state = useContext(GlobalState)
    const [user, setUser] = useState(initialSate)
    const {  name, password, cf_password, err, success } = user
    const [users] = state.userAPI.users
    const [loading, setLoading] = useState(false)
    const [token] = state.token
    const [avatar, setAvatar] = useState(false)
    // const [callback, setCallback] = useState(false)
 
    const handleChange = e => {
        const {name, value} = e.target
        setUser({...user, [name]:value, err: '', success: ''})
    }
    const handleSubmit = async e =>{
            e.preventDefault()
            if(password) updatePassword()

        
            if(name !== users.name || avatar) updateInfor()
    }
    const updateInfor = () => {
        try {
            axios.patch('/user/update', {
                name: name ? name : users.name,
                avatar: avatar ? avatar : users.avatar
            },{
                headers: {Authorization: token}
            })
            setUser({...user, err: '' , success: "Updated Success!"})
        } catch (err) {
            setUser({...user, err: err.response.data.msg , success: ''})
        }
    }

    const updatePassword = () => {
        if(isLength(password))
            return setUser({...user, err: "Password must be at least 6 characters.", success: ''})

        if(!isMatch(password, cf_password))
            return setUser({...user, err: "Password did not match.", success: ''})

        try {
            axios.post('/user/reset', {password},{
                headers: {Authorization: token}
            })

            setUser({...user, err: '' , success: "Updated Success!"})
        } catch (err) {
            setUser({...user, err: err.response.data.msg , success: ''})
        }
    }
    const changeAvatar = async(e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]

            if(!file) return setUser({...user, err: "No files were uploaded." , success: ''})

            if(file.size > 1024 * 1024)
                return setUser({...user, err: "Size too large." , success: ''})

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setUser({...user, err: "File format is incorrect." , success: ''})

            let formData =  new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload_avatar', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading(false)

            setAvatar(res.data.url)
            
        } catch (err) {
            setUser({...user, err: err.response.data.msg , success: ''})
        }
    }
    useEffect(() => {
        if(users) setUser({...user, name: users.name})
    },[users])

    if(!user) return null;
    
    return (
        <>
        <div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            {loading && <h3>Loading.....</h3>}
        </div>
        <div className="profile_page">
           
              <h3 className="text-center text-uppercase">
                    {users.role === 0 ? 'User Profile': 'Admin profile'}
                </h3>
                <div className="avatar">
                
                    <img src = {avatar ? avatar : users.avatar} alt = {users.avatar}></img>
                    <span>
                        <i class="fas fa-camera"></i>
                        <p>Change</p>
                        <input type="file" name="file" id="file_up" onChange={changeAvatar}/>
                    </span>
                </div>
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Name </label><br/>
                        <input type='text' name='name' value={name} className='form-control' 
                        placeholder="Your name" onChange={handleChange} />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email </label><br/>
                        <input type='text' name='email' defaultValue={users.email} className='form-control' 
                        placeholder="Your name" disabled={true}/>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password </label><br/>
                        <input type='password' name='password' value={password} className='form-control' 
                        placeholder="Your new password" onChange={handleChange}/>
                    </div>

                    <div className="form-group">
                         <label htmlFor="cf_password">Confirm New Password </label><br/>
                         <input type="password" name="cf_password" value={cf_password} className="form-control"
                        placeholder="Confirm new password" onChange={handleChange}/>
                    </div>
                    <button className="form-group" onClick={handleSubmit} disabled={loading}>Update</button>
                </form>
        </div>
        </>
    )
}

export default Profile

