import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import moment from 'moment';

function UserBookings(props) {
    
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([])

    // Get all Bookings data
    const getBooks = async () => {
        // API Call 
        const response = await fetch(`${props.host}/bookinghistory`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "user-token": localStorage.getItem('user-token')
            }
        });
        const json = await response.json();
        setBookings(json);
        setLoading(false);
    }
    let navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('user-token')) {
            getBooks();
        }
        else {
            navigate('/userlogin');
            props.showAlert('Please Login First', 'danger');
        }
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div className="container my-1">
                {loading ? <Spinner /> : <>
                    {bookings.length === 0 ? <h2 className='container text-center'>No History Available</h2> :
                        <h2 className='text-center'>Your Booking History</h2>}
                    <hr />
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Hotel</th>
                                <th scope="col">Action</th>
                                <th scope="col">Transaction Time</th>
                                <th scope="col">From</th>
                                <th scope="col">To</th>
                                <th scope="col">Booking Id</th>
                            </tr>
                        </thead>
                        <tbody id='tableBody'>
                            {bookings.map((trans) => {
                                return <tr>
                                    <td>{trans.name}</td>
                                    <td className={`${trans.action==="Booked"?"text-primary":"text-danger"}`} >{trans.action}</td>
                                    <td>{moment(trans.time).format("hh:mm A DD/MM/YYYY")}</td>
                                    <td>{moment(trans.from).format("DD/MM/YYYY")}</td>
                                    <td>{moment(trans.to).format("DD/MM/YYYY")}</td>
                                    <td>{trans._id}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </>}
            </div>
        </>
    )
}

export default UserBookings