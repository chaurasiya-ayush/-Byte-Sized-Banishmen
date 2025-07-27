import User from "../models/userModel.js";

// @desc    Search for users by username
// @route   GET /api/friends/search?q=...
// @access  Private
export const searchUsers = async (req, res) => {
  const searchQuery = req.query.q
    ? {
        username: { $regex: req.query.q, $options: "i" }, // Case-insensitive search
      }
    : {};

  try {
    // Find users, exclude the current user from results, limit to 10
    const users = await User.find(searchQuery)
      .find({ _id: { $ne: req.user._id } })
      .limit(10)
      .select("username level rank");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Send a friend request
// @route   POST /api/friends/request/:userId
// @access  Private
export const sendFriendRequest = async (req, res) => {
  try {
    const recipient = await User.findById(req.params.userId);
    const sender = await User.findById(req.user._id);

    if (!recipient) return res.status(404).json({ message: "User not found" });
    if (
      sender.friends.includes(recipient._id) ||
      recipient.friendRequestsReceived.includes(sender._id)
    ) {
      return res
        .status(400)
        .json({ message: "Request already sent or you are already friends" });
    }

    recipient.friendRequestsReceived.push(sender._id);
    sender.friendRequestsSent.push(recipient._id);

    await recipient.save();
    await sender.save();

    res.json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Accept a friend request
// @route   POST /api/friends/accept/:userId
// @access  Private
export const acceptFriendRequest = async (req, res) => {
  try {
    const sender = await User.findById(req.params.userId);
    const recipient = await User.findById(req.user._id);

    if (!sender || !recipient.friendRequestsReceived.includes(sender._id)) {
      return res
        .status(400)
        .json({ message: "No friend request from this user" });
    }

    // Add each other to friends lists
    recipient.friends.push(sender._id);
    sender.friends.push(recipient._id);

    // Remove the request from both users' lists
    recipient.friendRequestsReceived = recipient.friendRequestsReceived.filter(
      (id) => id.toString() !== sender._id.toString()
    );
    sender.friendRequestsSent = sender.friendRequestsSent.filter(
      (id) => id.toString() !== recipient._id.toString()
    );

    await recipient.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Decline or cancel a friend request
// @route   POST /api/friends/decline/:userId
// @access  Private
export const declineFriendRequest = async (req, res) => {
  try {
    const otherUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    // Remove from received requests (declining)
    currentUser.friendRequestsReceived =
      currentUser.friendRequestsReceived.filter(
        (id) => id.toString() !== otherUser._id.toString()
      );
    otherUser.friendRequestsSent = otherUser.friendRequestsSent.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    // Also handle cancelling a request you sent
    currentUser.friendRequestsSent = currentUser.friendRequestsSent.filter(
      (id) => id.toString() !== otherUser._id.toString()
    );
    otherUser.friendRequestsReceived = otherUser.friendRequestsReceived.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await otherUser.save();

    res.json({ message: "Friend request removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all friends and pending requests for the current user
// @route   GET /api/friends/
// @access  Private
export const getFriendsAndRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "username level rank")
      .populate("friendRequestsReceived", "username level rank");

    res.json({
      friends: user.friends,
      requests: user.friendRequestsReceived,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
