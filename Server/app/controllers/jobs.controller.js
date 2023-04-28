const mongoose = require("mongoose");

const db = require("../models");
const Jobs = db['jobs'];

exports.countJob = async (req, res) => {
    try {
        var condition = {
            user_id: req.user.id,
            status : 1
        };
        const data = await Jobs.find(condition).count();
        res.send({
            count: data
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
}

exports.createJob = async (req, res) => {
    console.log("req brenda butonit submit per create: ");
    try {

        if (req.user.user_type == 1) {
            res.status(400).send({
                message: "Your don't have permission for post the job."
            });
            return;
        }

        const ObjectId = mongoose.Types.ObjectId;
        let user_id = ObjectId(req.user.id);
        req.body.user_id = user_id;
        const jobs = new Jobs(req.body);
        const data = await jobs.save(jobs);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.findJobs = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const data = await Jobs.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $match: {
                user_id: ObjectId(req.user.id)
            }
        }
        ]).sort({ updatedAt: -1 });
        if (!data) {
            res.status(400).send({
                message: `No data`
            });
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.findJobsUsingStatus = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const data = await Jobs.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $match: {
                user_id: ObjectId(req.user.id),
                status : parseInt(req.params.status)
            }
        }
        ]).sort({ updatedAt: -1 });
        if (!data) {
            res.status(400).send({
                message: `No data`
            });
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.search = async (req, res) => {
    try {
        var data;
        if (req.query.title || req.query.zip_code) {
            data = await Jobs.find(
                {
                    $or: [
                        {
                            title: {
                                $in: [req.query.title]
                            }
                        },
                        {
                            address: {
                                $in: [req.query.zip_code]
                            }
                        },
                        {
                            zip_code: {
                                $in: [req.query.zip_code]
                            }
                        }
                    ],
                    $and : [{
                        status : 1
                    }]
                }
            );
        } else {
            data = await Jobs.find({
                $and : [{
                    status : 1
                }]
            }).sort({ updatedAt: -1 });
        }

        if (!data) {
            res.status(400).send({
                message: `No data`
            });
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};