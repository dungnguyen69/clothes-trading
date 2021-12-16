import React, {useState} from 'react'
import {Link} from 'react-router-dom' 
import axios from "axios"
import { showSuccessMsg, showErrMsg } from '../utils/notification/Notification'
import {isEmpty, isEmail, isLength, isMatch} from '../utils/validation/validation'
const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}
function Register() {
    const [user, setUser] = useState(initialState)
    const {name, email, password,cf_password, err, success} = user

    const onChangeInput = e =>{
        const {name,value} = e.target;
        setUser({...user,[name]:value, err: '', success: ''})
    }
    const registerSubmit = async e=>{
        e.preventDefault();
        if(isEmpty(name) || isEmpty(password))
                return setUser({...user, err: "Please fill in all fields.", success: ''})

        if(!isEmail(email))
            return setUser({...user, err: "Invalid emails.", success: ''})

        if(isLength(password))
            return setUser({...user, err: "Password must be at least 6 characters.", success: ''})
        
        if(!isMatch(password, cf_password))
            return setUser({...user, err: "Password did not match.", success: ''})

        try {
            const res = await axios.post('/user/register', {
                name, email, password
            })
            
            setUser({...user, err: '', success: res.data.msg})
        } catch (error) {
            error.response.data.msg && 
            setUser({...user, err: error.response.data.msg, success: ''})
        }
    }
    
    return (
        <div className="login-page">
            <h2>Register</h2>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            <form onSubmit = {registerSubmit}>
               <label htmlFor='name'>Name</label>

                <input type = "text" name="name" placeholder="Name" id='name'
                 value= {name} onChange = {onChangeInput}/>
                <label htmlFor='email'>Email</label>

                <input type = "email" name="email" placeholder="Email" id='email'
                 value= {email} onChange = {onChangeInput}/>
                <label htmlFor='password'>Password</label>

                <input type = "password" name="password" placeholder="Password" id='password'
                 value= {password} onChange = {onChangeInput} autoComplete = "on"/>

                <label htmlFor='cf_password'>Confirm password</label>
                 <input type = "password" name="cf_password" placeholder="Confirm Password" id='cf_password'
                 value= {cf_password} onChange = {onChangeInput} autoComplete = "on"/>
                <div className="row">
                    <button type="Submit">Register</button>
                    {/* <Link to="/login">Login</Link> */}
                    <p>Already an account? <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Register
