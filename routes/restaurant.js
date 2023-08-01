const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");

// Route to add a new restaurant
router.post("/", async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get details of all restaurants
router.get("/", async (req, res) => {
  try {
    // Find all restaurants in the database
    const restaurants = await Restaurant.find();

    // If there are no restaurants, return an empty array
    if (restaurants.length === 0) {
      return res.json({ restaurants: [], message: "No restaurants found." });
    }

    // Return the list of restaurants
    res.json({ restaurants, message: "Restaurants fetched successfully." });
  } catch (err) {
    // Handle internal server error
    console.error(err);
    res
      .status(500)
      .json({ error: "Some error occurred while fetching the Restaurants." });
  }
});

router.get("/categories", async (req, res) => {
  try {
    // Find distinct categories in the database
    const categories = await Restaurant.distinct("category");

    // Return the list of categories
    res.json(categories);
  } catch (err) {
    // Handle internal server error
    console.error(err);
    res
      .status(500)
      .json({ error: "Some error occurred while fetching the Categories." });
  }
});

router.get("/categories/:categoryName", async (req, res) => {
  const categoryName = req.params.categoryName;
  try {
    // Find restaurants with the given category
    const restaurants = await Restaurant.find({ category: categoryName });

    // Return the list of restaurants for the given category
    res.json(restaurants);
  } catch (err) {
    // Handle internal server error
    console.error(err);
    res
      .status(500)
      .json({ error: "Some error occurred while fetching the Restaurant." });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Find the restaurant by its ID
    const restaurant = await Restaurant.findById(id);

    // If restaurant not found, return 404 status
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    // Return the restaurant details
    res.json(restaurant);
  } catch (err) {
    // Handle internal server error
    console.error(err);
    res
      .status(500)
      .json({ error: "Some error occurred while fetching the Restaurant." });
  }
});

// Route to get details of restaurants with ratings greater than or equal to the given rating
router.get("/rating/:ratingValue", async (req, res) => {
  const ratingValue = parseFloat(req.params.ratingValue);
  try {
    // Find restaurants with ratings greater than or equal to the given rating
    const restaurants = await Restaurant.find({
      rating: { $gte: ratingValue },
    });

    // Return the list of restaurants with the given rating
    res.json(restaurants);
  } catch (err) {
    // Handle internal server error
    console.error(err);
    res
      .status(500)
      .json({ error: "Some error occurred while fetching the Restaurant." });
  }
});

// Route to update details of a restaurant by its ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedRestaurantData = req.body;
  try {
    // Find the restaurant by its ID and update its details
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updatedRestaurantData,
      {
        new: true,
      }
    );

    // If restaurant not found, return 404 status
    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    // Return success message
    res.json({ message: "Restaurant updated successfully." });
  } catch (err) {
    // Handle internal server error
    console.error(err);
    res
      .status(500)
      .json({ error: "Some error occurred while updating the Restaurant." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Find the restaurant by its ID and delete it
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    // If restaurant not found, return 200 status
    if (!deletedRestaurant) {
      return res
        .status(200)
        .json({ message: "Restaurant not found.", restaurant: null });
    }

    // Return deleted restaurant details and success message
    res.json({
      restaurant: deletedRestaurant,
      message: "Restaurant deleted successfully.",
    });
  } catch (err) {
    // Handle internal server error
    console.error(err);
    res
      .status(500)
      .json({ error: "Some error occurred while deleting the Restaurant." });
  }
});

// Route to delete all restaurants
router.delete("/", async (req, res) => {
  try {
    // Delete all restaurants
    const deletedRestaurants = await Restaurant.deleteMany();

    // Return deleted count and success message
    res.json({
      restaurants: deletedRestaurants,
      message: "Restaurants deleted successfully.",
    });
  } catch (err) {
    // Handle internal server error
    console.error(err);
    res
      .status(500)
      .json({ error: "Some error occurred while deleting the Restaurants." });
  }
});

router.post("/add", async (req, res) => {
  try {
    // Extract the restaurant data from the request body
    const { name, description, category, imageURL, location, phone, rating } =
      req.body;

    // Check if the request body is empty
    if (
      !name ||
      !description ||
      !category ||
      !imageURL ||
      !location ||
      !phone ||
      !rating
    ) {
      return res
        .status(400)
        .json({ error: "Restaurant details are missing in the request body" });
    }

    // Create a new restaurant document
    const restaurant = await Restaurant.create(req.body);

    // Return the newly created restaurant data
    res.status(200).json(restaurant);
  } catch (err) {
    // Handle internal server error
    console.error(err);
    res
      .status(500)
      .json({ error: "Some error occurred while creating the Restaurant" });
  }
});

module.exports = router;
