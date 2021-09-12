const router = require('express').Router();
const Movie = require('../models/Movie');
const verify = require("../verifyToken");

// Craete
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newMOvie = new Movie(req.body);
        try {
            const movie = await newMOvie.save();
            res.status(201).json(movie);
        } catch (err) {
            res.status(500).send(err);
        }

    } else {
        res.status(403).send("You are not allowed to add or delete movie")
    }
});
// Update
router.put("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { $new: true })

            res.status(200).json(updatedMovie);
        } catch (err) {
            res.status(500).send(err);
        }

    } else {
        res.status(403).send("You are not allowed to add or delete movie")
    }
});
// Delete
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted Successfully");
        } catch (err) {
            res.status(500).send(err);
        }

    } else {
        res.status(403).send("You are not allowed to add or delete movie")
    }
});

// Get Movie By ID
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get Random Movie
router.get("/random", async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if (type === "series") {
            movie = await Movie.aggregate([
                {
                    $match: { $isSeries: true }
                },
                { $sample: { size: 1 } }
            ]);
        } else {
            movie = await Movie.aggregate([
                {
                    $match: { $isSeries: false }
                },
                { $sample: { size: 1 } }
            ]);
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;