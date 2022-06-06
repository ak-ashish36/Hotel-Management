import React from 'react'
import { Link, useLocation} from "react-router-dom";

const Navbar = (props) => {
    let location = useLocation();
    //Handeling Logout 
    let usertoken = localStorage.getItem('user-token');
    const handleLogout = () => {
        localStorage.removeItem('user-token');
    }
    return (
        <nav className="fixed-top navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Hotel-Management</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {usertoken && <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/bookinghistory" ? "active" : ""}`} aria-current="page" to="/bookinghistory">My Bookings</Link>
                        </li>}
                    </ul>
                    <form className="d-flex">
                        {usertoken ? <button onClick={handleLogout} className="btn btn-outline-primary mx-2">Logout</button> :
                            <Link className="btn btn-outline-primary mx-2" role="button" to="/userlogin" type="submit">UserLogin</Link>
                        }
                    </form>
                </div>
            </div>
        </nav >
    )
}

export default Navbar