import React, {useContext, useState} from 'react'
import {GlobalState} from '../../GlobalState'
import Menu from './icon/menu.svg'
import Close from './icon/close.svg'
import Cart from './icon/cart.svg'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
function Header() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [users] = state.userAPI.users
    const [cart] = state.userAPI.cart
    const [menu, setMenu] = useState(false)
    const logoutUser = async () =>{
        try {
            await axios.get('/user/logout')
            localStorage.removeItem('firstLogin')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }
    const userLink = () => {
        return <li className="drop-nav">
            <Link to="#" className="avatar">
            <img src={users.avatar} alt=""/> {users.name} <FontAwesomeIcon icon={faAngleDown} />
            </Link>
            <ul className="dropdown">
                <li><Link to="/profile">Profile</Link></li>
                {isAdmin?<li><Link to="/history">History</Link></li>:""}
                <li><Link to="/" onClick={logoutUser}>Logout</Link></li>
            </ul>
            
            
        </li>
    }
    const adminRouter = () =>{
        return(
            <>
                <li><Link to="/create_product">Create Product</Link></li>
                <li><Link to="/category">Categories</Link></li>
            </>
        )
    }


    const loggedRouter = () =>{
        return(
            <>

                {
                    isLogged
                    ? userLink()
                    :""                  
                }
            </>
        )
    }


    const styleMenu = {
        left: menu ? 0 : "-100%",
        transform: isLogged ? "translateY(-5px)" : 0

    }
    
    return (
        <header>
            <div className="menu" onClick={() => setMenu(!menu)}>
                <img src={Menu} alt="" width="30" />
            </div>

            <div className="logo">
                <h1>
                    <Link to="/">{isAdmin ? 'Admin' : 'Group 04'}</Link>
                </h1>
            </div>

            <ul style={styleMenu}>
                <li><Link to="/">{isAdmin ? 'Product': 'Group 04'}</Link></li>


                {isAdmin && adminRouter()}{
                    isLogged ? loggedRouter():    <li><Link to="/login">Login ✥ Register</Link></li>
                }
                

                <li onClick = {()=> setMenu(!menu)}>
                    <img src={Close} alt="" width="30" className="menu" />
                </li>

            </ul>

            {
                isAdmin ? '' :
                <div className="cart-icon">
                    <span>{cart.length}</span>
                    <Link to="/cart">
                        <img src={Cart} alt="" width="30" />
                    </Link>
                </div>
            }
            
        </header>
    )
}

export default Header