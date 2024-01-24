const { User, Thought } = require("../models");

module.exports = {
  // Get All Users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single user by its _id and populated thought and friend data
  async getUserById(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        "-__v"
      );

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Post a new user:
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Put to update user by its _id
  async updateUser(req, res) {
    const userId = req.params.userId;

    try {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Delete to remove a user by its _id
  async deleteUser(req, res) {
    const userId = req.params.userId;

    try {
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove associated thoughts
      await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });

      res.json(deletedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  // Post to add a new friend to a user's friend list
  async addFriend(req, res) {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the friendId is already in the user's friends list
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "User is already a friend" });
      }

      // Add the friendId to the user's friends list
      user.friends.push(friendId);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete to remove a friend from a user's friend list
  async removeFriend(req, res) {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the friendId is in the user's friends list
      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ message: "User is not a friend" });
      }

      // Remove the friendId from the user's friends list
      user.friends = user.friends.filter(
        (friend) => friend.toString() !== friendId
      );
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
