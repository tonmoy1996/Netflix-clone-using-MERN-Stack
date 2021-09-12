const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const verify = require("../verifyToken");

//UPADTE
router.put("/:id", verify, async (req, res) => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            res.status(200).json("Updated Successfully");

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).send("You can update only your acount")
    }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted Successfully");

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).send("You can update only your acount")
    }
});

// Get
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc;
        res.status(200).json(info);

    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All 
router.get("/", verify, async (req, res) => {
    console.log(req.user);
    if (req.user._id === req.params.id || req.user.isAdmin) {

        try {
            const query = req.query.new;
            const users = query ? await User.find().sort({ _id: -1 }).limit(2) :
                await User.find().sort({ _id: -1 }); // sort -1 means descending order

            res.status(200).json(users);

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).send("You are not allowed to see all usres")
    }
});

// GET USER STATS

router.get("/stats", async (req, res) => {
    try {
        const monthWiseUsers = await User.aggregate([
            {
                $project: {
                    month: {
                        $month: "$createdAt"
                    }
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);
        const yearWiseUsers = await User.aggregate([
            {
                $project: {
                    year: {
                        $year: "$createdAt"
                    }
                },
            },
            {
                $group: {
                    _id: "$year",
                    total: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            monthStat: monthWiseUsers,
            yearStat: yearWiseUsers,
        });

    } catch (err) {
        res.status(500).json(err);
    }

});



module.exports = router;