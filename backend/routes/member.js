const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await Member.findOne({ username: req.user.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'Member not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

router.put('/', verifyToken, async (req, res) => {
  try {
    const updateFields = { ...req.body };
    delete updateFields.username;

    const updatedUser = await Member.findOneAndUpdate(
      { username: req.user.username },
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

router.delete('/', verifyToken, async (req, res) => {
  try {
    await Member.findOneAndDelete({ username: req.user.username });
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
