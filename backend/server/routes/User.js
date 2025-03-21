const {
  AddUser,
  getUserDetails,
  login,
  updateUserDetails,
  getResume,
  generateCustomAnswer,
  matchPercentage
} = require("../controllers/User");

const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/multerUpload");

const router = require("express").Router();


router.post("/signup", AddUser);
router.post("/login", login);

router.get("/", authMiddleware, getUserDetails);
router.patch(
  "/",
  authMiddleware,
  uploadMiddleware.single("resume"),
  updateUserDetails
);

router.post("/custom-answer", authMiddleware, generateCustomAnswer);
router.post("/match-percentage", authMiddleware, matchPercentage);
router.get("/resume", authMiddleware, getResume);


module.exports = router;
