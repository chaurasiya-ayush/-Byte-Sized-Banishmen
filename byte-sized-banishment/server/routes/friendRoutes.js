import express from "express";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendsAndRequests,
} from "../controllers/friendController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get("/search", searchUsers);
router.get("/", getFriendsAndRequests);
router.post("/request/:userId", sendFriendRequest);
router.post("/accept/:userId", acceptFriendRequest);
router.post("/decline/:userId", declineFriendRequest);

export default router;
