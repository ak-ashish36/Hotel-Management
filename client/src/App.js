import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import UserBooking from './components/UserBookings';

function App() {
  document.title = "Hotel Management";

  //Custom Alert
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <>
      <Router>
        <Navbar showAlert={showAlert} />
        <Alert alert={alert} />
        <div className="container my-5 py-3">
          <Routes className>
            <Route exact path='/' element={< Home showAlert={showAlert} />}></Route>
            <Route exact path='/userlogin' element={< Login showAlert={showAlert} user="user" />}></Route>
            <Route exact path='/usersignup' element={< Signup showAlert={showAlert} />}></Route>
            <Route exact path='/bookinghistory' element={< UserBooking showAlert={showAlert} />}></Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
