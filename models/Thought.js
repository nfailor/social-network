const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

// Reaction Schema
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

// Getter method to format timestamp
reactionSchema.virtual("formattedCreatedAt").get(function () {
  return this.createdAt.toISOString();
});

// Thought Schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true, // Include virtual properties when converting to JSON
      getters: true,
    },
    id: false, // Disable the default _id field
  }
);

// Getter method to format timestamp for the thought
thoughtSchema.virtual("formattedCreatedAt").get(function () {
  return this.createdAt.toISOString();
});

// Create a virtual property 'reactionCount'
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = mongoose.model("Thought", thoughtSchema);

module.exports = Thought;
