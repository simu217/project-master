const express = require("express");
const router = express.Router();
const Hive = require("../models/Hive");
const Member = require("../models/Member");
const verifyToken = require("../middleware/auth");
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const { sendInviteEmail } = require("../utils/mailer");
const { preview } = require("../utils/crystal");

router.post("/", verifyToken, async (req, res) => {
  const { name, shieldMode } = req.body;
  const stargateKey = nanoid(8);

  try {
    const hive = new Hive({
      name,
      stargateKey,
      shieldMode,
      queen: req.user._id,
      members: [
        {
          email: req.user.email,
          member: req.user._id,
          status: "accepted",
          joinedAt: new Date(),
        },
      ],
    });

    await hive.save();
    res.status(201).json({ message: "Hive created successfully", hive });
  } catch (err) {
    res.status(500).json({ message: "Error creating Hive", error: err });
  }
});

router.post("/:hiveId/invite", verifyToken, async (req, res) => {
  const { email } = req.body;

  try {
    const hive = await Hive.findById(req.params.hiveId);
    if (!hive) return res.status(404).json({ message: "Hive not found" });

    if (!hive.queen.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only the Queen can send invitations" });
    }

    const alreadyInvited = hive.members.find((m) => m.email === email);
    if (alreadyInvited) {
      return res
        .status(400)
        .json({ message: "User already invited or a member" });
    }

    const member = await Member.findOne({ email });

    hive.members.push({
      email,
      member: member ? member._id : null,
      status: "sent",
    });

    await hive.save();

    const inviteLink = `${process.env.APP_URL}/join/${hive.stargateKey}`;
    await sendInviteEmail(email, hive.name, inviteLink);

    res.status(200).json({ message: "Invitation created", inviteLink });
  } catch (err) {
    res.status(500).json({ message: "Error sending invite", error: err });
  }
});

router.post("/accept/:key", verifyToken, async (req, res) => {
  try {
    const hive = await Hive.findOne({ stargateKey: req.params.key });
    if (!hive) return res.status(404).json({ message: "Hive not found" });

    const memberEntry = hive.members.find((m) => m.email === req.user.email);

    if (!memberEntry) {
      return res
        .status(403)
        .json({ message: "You have not been invited to this Hive" });
    }

    if (memberEntry.status === "accepted") {
      return res.status(400).json({ message: "Invite already accepted" });
    }

    memberEntry.status = "accepted";
    memberEntry.member = req.user._id;
    memberEntry.joinedAt = new Date();

    await hive.save();

    res.status(200).json({ message: "You’ve joined the Hive", hive });
  } catch (err) {
    res.status(500).json({ message: "Error accepting invite", error: err });
  }
});

router.post("/:id/crystals", verifyToken, async (req, res) => {
  const hiveId = req.params.id;
  const userId = req.user._id;

  const { crystals } = req.body;

  if (!Array.isArray(crystals) || crystals.length === 0) {
    return res.status(400).json({ message: "Please send a list of crystals." });
  }

  try {
    const hive = await Hive.findById(hiveId);
    if (!hive) return res.status(404).json({ message: "Hive not found" });

    // 🛡️ Check permission
    const isQueen = hive.queen.toString() === userId.toString();
    const isApprovedMember = hive.members.some(
      (m) =>
        m.member.toString() === userId.toString() && m.status === "accepted"
    );

    if (!isQueen && !isApprovedMember) {
      return res
        .status(403)
        .json({ message: "Access denied: not a member or queen." });
    }

    // 🧿 Enrich and add crystals

    const enrichedCrystals = await Promise.all(
      crystals.map((c) => preview(c, userId))
    );

    hive.crystals.push(...enrichedCrystals);
    await hive.save();

    res.status(201).json({
      message: `${enrichedCrystals.length} crystals added to the hive.`,
      crystals: enrichedCrystals,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add crystals", error: err.message });
  }
});

router.get("/mine", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get hives the user owns
    const ownedHives = await Hive.find({ queen: userId });

    // Get hives the user is a member of (and accepted)
    const memberHives = await Hive.find({
      members: {
        $elemMatch: {
          member: userId,
          status: "accepted",
        },
      },
      queen: { $ne: userId }, // not the queen
    });

    const publicHives = await Hive.find({ shieldMode: "public" });

    res.status(200).json({
      ownedHives,
      memberHives,
      publicHives,
    });
  } catch (err) {
    console.error("Error fetching user hives:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:hiveId", verifyToken, async (req, res) => {
  try {
    const hive = await Hive.findById(req.params.hiveId)
      .populate("queen", "username")
      .populate("members.member", "username")
      .populate("crystals.addedBy", "username");

    if (!hive) return res.status(404).json({ message: "Hive not found" });

    const isMember = hive.members.some(
      (m) =>
        m.member?._id.toString() === req.user._id.toString() &&
        m.status === "accepted"
    );

    const isPublic = hive.shieldMode === "public";

    if (!isPublic && !isMember) {
      return res.status(403).json({ message: "This Hive is private" });
    }

    res.status(200).json(hive);
  } catch (err) {
    res.status(500).json({ message: "Error fetching Hive", error: err });
  }
});

// DELETE /api/hive/:hiveId
router.delete("/:hiveId", verifyToken, async (req, res) => {
  try {
    const { hiveId } = req.params;
    const hive = await Hive.findById(hiveId);

    if (!hive) return res.status(404).json({ message: "Hive not found" });

    if (hive.owner.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Only the owner can delete this hive" });
    }

    await hive.remove();
    res.status(200).json({ message: "Hive deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hive", error });
  }
});

// DELETE /api/hives/:hiveId/crystals/:crystalId
router.delete("/:hiveId/crystals/:crystalId", verifyToken, async (req, res) => {
  try {
    const { hiveId, crystalId } = req.params;
    const hive = await Hive.findById(hiveId);

    if (!hive) return res.status(404).json({ message: "Hive not found" });

    const crystal = hive.crystals.id(crystalId);
    if (!crystal) return res.status(404).json({ message: "Crystal not found" });

    const isQueen = hive.queen.toString() === req.user._id;
    const isAddedBy = crystal.addedBy?.toString() === req.user._id;

    if (!isQueen && !isAddedBy) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this crystal" });
    }

    hive.crystals.pull({ _id: crystalId });
    await hive.save();

    res.status(200).json({ message: "Crystal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting crystal", error });
  }
});

module.exports = router;
