const Goal = require('../models/goalModel');

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const setGoal = async (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ message: 'Please add a text field' });
    return; // Ensure function stops after sending the response
  }

  try {
    const goal = await Goal.create({
      text: req.body.text,
      user: req.user.id,
    })
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(400).json({ message: 'Goal not found' });
      return; // Ensure function stops after sending the response
    }

    // Check for user
    if (!req.user) {
      res.status(401).json({ message: 'User not found' });
      return; // Ensure function stops after sending the response
    }

    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return; // Ensure function stops after sending the response
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(400).json({ message: 'Goal not found' });
      return; // Ensure function stops after sending the response
    }

    // Check for user
    if (!req.user) {
      res.status(401).json({ message: 'User not found' });
      return; // Ensure function stops after sending the response
    }

    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'User not authorized' });
      return; // Ensure function stops after sending the response
    }

    await goal.remove();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};