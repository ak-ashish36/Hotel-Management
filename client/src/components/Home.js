import React, { useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom';
import Spinner from './Spinner';

function Home(props) {
    // const host = "http://localhost:5000";
    const host ="https://hotel-management-ak.herokuapp.com";

    const [loading, setLoading] = useState(true);           // for rendering spinner while datas are fetching
    const [search, setSearch] = useState("");               // Search field
    const [modal, setModal] = useState({ value: false, data: "" });         // Popup menu for selecting date while boooking
    const [date, setDate] = useState({ from: "", to: "" });//YYYY-MM-DD     // Booking Date
    const onChange = (e) => {
        setSearch(e.target.value);
    }
    const onChangeDate = (e) => {
        console.log(e.target.value);
        const newDate = e.target.value;
        setDate({ ...date, [e.target.name]: newDate });
    };

    const [hotels, setHotels] = useState([])
    // Get all Hotels
    const getBooks = async () => {
        // API Call 
        const response = await fetch(`${host}/fetchhotels`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "user-token": localStorage.getItem('user-token')
            }
        });
        const json = await response.json();
        setHotels(json);
        setLoading(false);
    }

    let navigate = useNavigate();
    useEffect(() => {
        document.title = "Hotel Management";
        if (localStorage.getItem('user-token')) {
            getBooks();
        }
        else {
            navigate('/userlogin');
        }
        // eslint-disable-next-line
    }, [])

    // Get Search Result
    const handleClick = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/fetchhotels/${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "user-token": localStorage.getItem('user-token')
            }
        });
        const json = await response.json();
        setSearch("");
        setHotels(json);
    }

    const bookHotel = async (id) => {
        // API Call
        const response = await fetch(`${host}/bookhotel/${id}/${date.from}/${date.to}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "user-token": localStorage.getItem('user-token')
            }
        });
        const json = await response.json();
        if (json.success) {
            // Logic to edit in client
            for (let i = 0; i < hotels.length; i++) {
                const element = hotels[i];
                if (element._id === id) {
                    hotels[i].booked = true;
                    break;
                }
            }
            setModal({ value: false });
            setDate({ from: "", to: ""});
            props.showAlert(`${json.hotel.name} Booked Successfully`, 'success');
        }
        else {
            props.showAlert(json.error, 'danger');
        }
    }
    const cancelBooking = async (id) => {
        // API Call
        const response = await fetch(`${host}/cancelbooking/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "user-token": localStorage.getItem('user-token')
            }
        });
        const json = await response.json();
        if (json.success) {
            // Logic to edit in client
            for (let i = 0; i < hotels.length; i++) {
                const element = hotels[i];
                if (element._id === id) {
                    hotels[i].booked = false;
                    break;
                }
            }
            props.showAlert(`${json.hotel.name} Booking Cancelled`, 'success');
        }
        else {
            props.showAlert(json.error, 'danger');
        }
    }

    return (
        <>
        {/* Popup window for selecting date fro booking hotel  */}
            <>{modal.value &&
                <div className="modal-content fixed-top " style={{ width: '25rem', marginLeft: "35rem", marginTop: "10rem" }}>
                    <div className="modal-header">
                        <h5 className="modal-title" >Book {modal.data.name}</h5>
                        <button type="button" className="close" onClick={() => setModal({ value: false })} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-row">
                                <div className="col">
                                    <label htmlFor="">From</label>
                                    <input type="date" className="form-control" name="from" value={date.from} onChange={onChangeDate} />
                                </div>
                                <div className="col">
                                    <label htmlFor="">To</label>
                                    <input type="date" className="form-control" name="to" value={date.to} onChange={onChangeDate} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={() => setModal({ value: false })} className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" onClick={() => {
                            bookHotel(modal.data._id);
                        }} className="btn btn-primary">Book Now</button>
                    </div>
                </div>}
            </>

            <div className="container my-1">
                {loading ? <Spinner /> : <>
                    {hotels.length === 0 ? <h2 className='container text-center'>No Hotels are Available Right Now</h2> :
                        <h2 className='text-center'>Available Hotels</h2>}
                    <form className="d-flex">
                        <input className="form-control me-2" type="search" name="seacch" value={search} onChange={onChange} placeholder="Search Hotels" aria-label="Search" />
                        <button className="btn btn-outline-success" onClick={handleClick} type="submit">Search</button>
                    </form>
                    <hr />
                    <div className='container row d-flex justify-content-center'>
                        {hotels.map((hotel) => (
                            <div className="col-md-6 px-5" key={hotel._id}>
                                <div className="my-3 px-5">
                                    <div className="" style={{ width: '30rem' }}>
                                        <img src={hotel.imgUri} style={{ width: '30rem' }} className="card-img-top" alt={hotel.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{hotel.name}</h5>
                                            <p className="card-text">{hotel.about}</p>
                                            <p className="card-text"><b>Address : </b>{hotel.address}</p>
                                            <b className="card-text text-danger"><b className='text-primary'>Price : </b>${hotel.price}+ per night</b><br /><br />
                                            {hotel.booked === true ? <b className="btn btn-danger  btn-sm" onClick={() => cancelBooking(hotel._id)}>Cancel Booking</b> :
                                                <b className="btn btn-primary" onClick={() => setModal({ value: true, data: hotel })}>Book Now</b>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>}
            </div>
        </>
    )
}

export default Home