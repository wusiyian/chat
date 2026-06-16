const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const { sendMessage,
    allMessages,
    clearOfflineMessages,
    getOfflineMessages } = require("../controllers/messageControllers")
const router = express.Router()

router.route('/').post(protect, sendMessage)

router.route('/:chatId').get(protect, allMessages)

router.route('/offline').get(protect, getOfflineMessages)
router.route('/offline/clear').delete(protect, clearOfflineMessages)

module.exports = router