const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Hotels = require('../models/hotels');
const Users = require('../models/users');
const Bookings =require('../models/bookingHistory');

// ROUTE 1: Fetch All the Hotels
router.get('/fetchhotels',fetchuser,async (req, res) => {
    try {
        // Checking if any Hotel booking has Completed, if completed reseting the booked value = false
        let hotels = await Hotels.find();
        let currDate =new Date();
        for(var i=0;i<hotels.length;i++){
            let hotel = await Hotels.findById(hotels[i]._id);
            if(currDate>hotel.endingDate){
                hotel = await Hotels.findByIdAndUpdate(hotels[i]._id, {booked:false}, { new: true })
            }
        }
        //Sending hotels data which is not booked or it is booked by the logged user
        hotels =await Hotels.find({$or:[{booked:"false"},{userId:req.userId}]});
        res.json(hotels)
    } catch (error) {
        res.status(500).json({ "Server Error": error.message });
    }
})

// ROUTE 2: Fetch Searched hotel
router.get('/fetchhotels/:name', async (req, res) => {
    try {
        const hotels = await Hotels.find({name:new RegExp(req.params.name, 'i')});
        res.json(hotels)
    } catch (error) {
        res.status(500).json({ "Server Error": error.message });
    }
})

// ROUTE 3: Book Hotel
router.post('/bookhotel/:hotelId/:startDate/:endDate',fetchuser, async (req, res) => {
    let success=false;
    try {
        let {hotelId,startDate,endDate} = req.params;
        let hotel = await Hotels.findById(hotelId);
        if (!hotel){
            return res.status(400).json({ error: "Hotel not Found" ,success});
        }
        let user = await Users.findById(req.userId);
        if(hotel && hotel.booked==true){
            return res.status(400).json({ error: `Hotel Is alread Booked by ${user.name}` ,success});
        }
        hotel = await Hotels.findByIdAndUpdate(hotelId, {
            booked:true,
            userId:req.userId,
            startingDate:startDate,
            endingDate :endDate
        }, { new: true })
        
        // Adding Booking data in Booking history
        await Bookings.create({
            action:"Booked",
            hotelId:hotel._id,
            userId:req.userId,
            name:hotel.name,
            from:hotel.startingDate,
            to:hotel.endingDate
        })
        success=true;
        res.json({ success,hotel });
    } catch (error) {
        res.status(500).json({ "Server Error": error.message });
    }
})
// ROUTE 4: Cancel Booking
router.put('/cancelbooking/:hotelId',fetchuser, async (req, res) => {
    let success=false;
    try {
        let {hotelId} = req.params;
        let hotel = await Hotels.findById(hotelId);
        if (!hotel){
            return res.status(400).json({ error: "Hotel not Found" ,success});
        }
        // Adding Cancellation data in Booking history
        await Bookings.create({
            action:"Cancelled",
            hotelId:hotel._id,
            userId:req.userId,
            name:hotel.name,
            from:hotel.startingDate,
            to:hotel.endingDate
        })
        hotel = await Hotels.findByIdAndUpdate(hotelId, {
            booked:false,
            userId:null,
            startingDate:null,
            endingDate :null
        }, { new: true })
        success=true;
        res.json({ success,hotel});
    } catch (error) {
        res.status(500).json({ "Server Error": error.message });
    }
})

// ROUTE 5: Fetch user booking history
router.get('/bookinghistory', fetchuser, async (req, res) => {
    try {
        const bookings = await Bookings.find({userId:req.userId});
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ "Server Error": error.message });
    }
})

//Route 6 : Adding hotel
router.post('/addhotel',async (req, res) => {
    let success=false;
    try {
        const { name,about,address,imgUri,price } = req.body;
        let hotel = await Hotels.findOne({ name });
        if (hotel) {
            return res.status(400).json({ error: "Hotel already Present",success });
        }
        hotel = new Hotels({
            name,about,address,imgUri,price
        })
        const savedHotel = await hotel.save();
        success=true;
        res.json({success,savedHotel})
    } catch (error) {
        res.status(500).json({ "Server Error": error.message });
    }
})

module.exports = router