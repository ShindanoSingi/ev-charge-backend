const router = require('express').Router();
const axios = require('axios');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createStastion, getAllStations, getaStation, updateaStation, deleteaStation, addaStation, getMyStations, getoneOfMyStations, deleteStation } = require('../controller/stationController');


// Create a new station
router.post('/new-station', authMiddleware, createStastion);
// Get all stations
router.get('/get-all-stations', authMiddleware, getAllStations);
// Get a station by id
router.get('/get-station/:id', authMiddleware, getaStation);
// Update a station by id
router.put('/update-station/:id', authMiddleware, updateaStation);
// Geta station
router.get('/search/:location/:fuel', async (req, res) => {
    const { location, fuel } = req.params;

    axios.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1.json?limit=100&api_key=${process.env.REACT_APP_NREL_API_KEY}&fuel_type=ELEC&state=ME`)
        .then(response => {
            res.json(response.data);

        })
});
// Get my stations
router.get('/my-stations', authMiddleware, getMyStations);
// Get one of my stations by id
router.get('/my-stations/:id', authMiddleware, getoneOfMyStations);
// Delete one of my stations by id
router.delete('/my-station/:id', authMiddleware, deleteStation);


module.exports = router;