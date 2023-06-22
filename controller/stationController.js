const axios = require('axios');
const Station = require('../models/stationModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

let latitude = '';
let longitude = '';

const createStastion = asyncHandler(async (req, res) => {
    const { username } = req.user;
    const user = await User.findOne({ username });

    const stationExists = user.stations.find(s => s.station_name === req.body.station_name);

    try {
        if (stationExists) {
            return res.send({
                success: false,
                message: 'Station already exists',
            });
        }
        if (!stationExists) {
            const newStation = await Station.create(req.body);
            await User.findByIdAndUpdate(user._id, { $push: { stations: newStation._id } }, { new: true });

            res.send({
                success: true,
                message: 'Station created successfully',
                data: newStation,
            })
        }
    } catch (error) {
        res.send({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }

});

const getAllStations = asyncHandler(async (req, res) => {
    const { username } = req.user;
    const user = await User.findOne({ username }).populate('stations');
    try {
        const stations = user.stations;
        res.send({
            success: true,
            message: 'Stations retrieved successfully',
            data: stations,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}
);

const getaStation = asyncHandler(async (req, res) => {
    const { username } = req.user;
    const user = await User.findOne({ username }).populate('stations');
    const station = await user.stations.find(station => {
        return station._id == req.params.id;
    });
    try {

        if (!station) {
            return res.send({
                success: false,
                message: 'Station not found',
            });
        }

        res.send({
            success: true,
            message: 'Station retrieved successfully',
            data: station,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});

const updateaStation = asyncHandler(async (req, res) => {
    const stationId = req.params.id;
    const { username } = req.user;
    const updateData = req.body;
    try {
        const user = await User.findOne({ username }).populate('stations');

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User or station not found',
            });
        }

        const station = user.stations.find(station => station._id.toString() === stationId);

        if (!station) {
            return res.status(404).send({
                success: false,
                message: 'Station not found',
            });
        }

        const updatedStation = await Station.findByIdAndUpdate(stationId, updateData, { new: true });
        res.send({
            success: true,
            message: 'Station updated successfully',
            data: updatedStation,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});

const deleteaStation = asyncHandler(async (req, res) => {
    const stationId = req.params.id;
    const { username } = req.user;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        const stationIndex = user.stations.findIndex(station => station._id.toString() === stationId);

        if (stationIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Station not found',
            });
        }

        user.stations.splice(stationIndex, 1);
        await user.save();

        res.send({
            success: true,
            message: 'Station deleted successfully',
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
            data: error.message,
            error: error.message,
        });
    }
});

const getMyStations = asyncHandler(async (req, res) => {
    const { _id } = req.user;


    res.send({
        success: true,
        message: 'Stations retrieved successfully',
        data: user,
    });
});

const getoneOfMyStations = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const id = req.params.id;
    const user = await User.findById(_id);
    const station = user.stations.find(station => {
        return station._id === id;
    });
    res.send({
        success: true,
        message: 'Station retrieved successfully',
        data: station,
    });
});

const deleteStation = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
        const stationIndex = user.stations.findIndex(station => station._id.toString() === id);
        if (stationIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Station not found',
            });
        }
        user.stations.splice(stationIndex, 1);
        await user.save();
        res.send({
            success: true,
            message: 'Station deleted successfully',
            data: user.stations,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
            data: error.message,
            error: error.message,
        });
    }
});

const searchStation = asyncHandler(async (req, res) => {
    const { stationName, city, zip } = req.query;
    const { username } = req.user;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        let filteredStations = user.stations;

        if (stationName) {
            filteredStations = filteredStations.filter(station => station.station_name.includes(stationName));
        }

        if (city) {
            filteredStations = filteredStations.filter(station => station.city.includes(city));
        }

        if (zip) {
            filteredStations = filteredStations.filter(station => station.zip === zip);
        }

        res.send({
            success: true,
            message: 'Stations retrieved successfully',
            data: filteredStations,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});

module.exports = { createStastion, getAllStations, getaStation, updateaStation, deleteaStation, getMyStations, getoneOfMyStations, deleteStation, searchStation };