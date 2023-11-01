import Listing from '../models/listing.model.js';
export const createlisting = async (req, res, next) => {
    try {
        console.log("hey from control")
        const newListing = await Listing.create(req.body);
        res.status(200).json(newListing);
    } catch (error) {
        next(error);
    }
};