const mongoose = require("mongoose");

const HiveSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stargateKey: { type: String, required: true, unique: true },
  shieldMode: { type: String, enum: ["public", "private"], default: "private" },
  queen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  members: [
    {
      email: String, // always required
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        default: null,
      },
      status: { type: String, enum: ["sent", "accepted"], default: "sent" },
      joinedAt: { type: Date },
    },
  ],
  crystals: [
    {
      title: String,
      url: String,
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      meta: {
        title: { type: String },
        description: { type: String },
        image: { type: String },
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hive", HiveSchema);
