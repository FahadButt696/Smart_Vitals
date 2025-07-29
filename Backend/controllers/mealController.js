import Meal from "../models/Meal.js";

export const addMeal = async (req, res) => {
  try {
    const { foodName, calories } = req.body;
    const userId = req.auth.userId;

    const newMeal = new Meal({ foodName, calories, userId });
    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (err) {
    res.status(500).json({ error: "Failed to log meal" });
  }
};
