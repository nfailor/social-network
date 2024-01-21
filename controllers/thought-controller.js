const { User, Thought } = require('../models')

module.exports = {
  // Get to all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single thought by _id
  async getThoughtById(req, res) {
    const thoughtId = req.params.thoughtId;

    try {
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Post to create a new thought
  async createThought(req, res) {
    const { thoughtText, username, userId } = req.body;

    try {
      const thought = await Thought.create({ thoughtText, username, userId });

      // Push the created thought's _id to the associated user's thoughts array field
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Put to update a thought by _id
  async updateThought(req, res) {
    const thoughtId = req.params.thoughtId;

    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        req.body,
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(updatedThought);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Delete to remove a thought by _id
  async deleteThought(req, res) {
    const thoughtId = req.params.thoughtId;

    try {
      const deletedThought = await Thought.findByIdAndDelete(thoughtId);
      if (!deletedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      // Remove the thought's _id from the associated user's thoughts array field
      const user = await User.findByIdAndUpdate(
        deletedThought.userId,
        { $pull: { thoughts: thoughtId } },
        { new: true }
      );

      res.json(deletedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Post to create a reaction stored in a single thought's reactions array field
  async addReaction(req, res) {
    const thoughtId = req.params.thoughtId;
    const { reactionBody, username } = req.body;

    try {
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      // Create a new reaction
      const newReaction = {
        reactionBody,
        username,
      };

      // Add the reaction to the thought's reactions array field
      thought.reactions.push(newReaction);
      await thought.save();

      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Delete to pull and remove a reaction by the reaction's 'reactionId' value
  async removeReaction(req, res) {
    const thoughtId = req.params.thoughtId;
    const reactionId = req.params.reactionId;

    try {
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      // Find the index of the reaction with the given reactionId
      const reactionIndex = thought.reactions.findIndex(
        (reaction) => reaction.reactionId.toString() === reactionId
      );

      // Check if the reactionId was not found
      if (reactionIndex === -1) {
        return res.status(404).json({ message: "Reaction not found" });
      }

      // Remove the reaction from the thought's reactions array field
      thought.reactions.splice(reactionIndex, 1);
      await thought.save();

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
