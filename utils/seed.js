const mongoose = require('mongoose');
const User = require('../models/User'); // Update the path accordingly
const Thought = require('../models/Thought'); // Update the path accordingly

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/social-network');

// Sample user data
const userData = [
  {
    username: "Disco",
    email: "disco@gmail.com",
  },
  {
    username: "Gumby",
    email: "gumby@gmail.com",
  },
];


// Could not get seed thought IDs to connect to user, commenting out
// // Sample thought data
// const thoughtData = [
//   {
//     thoughtText: "This is a sample thought.",
//     username: "Disco", // Username of the user who created the thought
//   },
//   {
//     thoughtText: "Another sample thought.",
//     username: "Gumby", // Username of the user who created the thought
//   },
// ];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Thought.deleteMany();

    // Create users
    const users = await User.create(userData);

    // // Update thoughtData with userIds
    // const thoughtsWithUserIds = thoughtData.map((thought, index) => ({
    //   ...thought,
    //   userId: users[index]._id,
    // }));

    // // Create thoughts
    // await Thought.create(thoughtsWithUserIds);

    console.log("Seed data inserted successfully.");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
};

// Invoke the seedDatabase function
seedDatabase();
