import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup(props) {
    document.title = "Hotel Management-Registration";
    
    //Setting the value of name,email and password which is to be send to fetch api 
    const [credentials, setCredentials] = useState({ name: '', email: '', password: '' })
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    // useNavigate hook is used for redirecting to pages
    let navigate = useNavigate();
    //Action to be done after clicking Register button
    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = `${props.host}/usersignup`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //Manually sending the name, email and password as a body 
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
        });
        //Getting the response from backend
        const json = await response.json()
        if (json.success) {
            navigate('/userlogin');
            props.showAlert('Registration Success', 'success');
        }
        else {
            props.showAlert(json.error, 'danger');
        }
    }
    return (
        <div className="container">
            <h3 className="mb-3">Create an Account</h3>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-10">
                        <input type="text" required='true' minLength="3" className="form-control" name="name" value={credentials.name} onChange={onChange} id="name" />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" name="email" value={credentials.email} onChange={onChange} id="email" />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" required='true' minLength="5" className="form-control" name="password" value={credentials.password} onChange={onChange} id="password" />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )
}
export default Signup
