const router = require("express").Router();
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const authMiddleware = require("../middlewares/authMiddleware");


// new message
router.post('/new-message', async (req, res) => {
    try {
        // store message
        const newMessage = new Message(req.body);
        const saveMessage = await newMessage.save();

        // update last message of chat
        await Chat.findOneAndUpdate(
            { _id: req.body.Chat },
            {
                lastMessage: saveMessage._id,
                unreadMessages: {
                    $inc: 1,
                }
            }
        );
        
        res.send({
            success: true,
            message: "Message sent successfully",
            data: saveMessage,
        });
    } catch(error) {
        res.send({
            success: false,
            message: "Error sending message",
            error: error.message,
        });
    }
})

// get all messages of a chat
 router.get("/get-all-messages/:chatId", async (req, res) => {
    try {
        const messages = await Message.find({
            chat: req.params.chatId,
        }).sort({ createdAt: 1 });
        req.send({
            success: true,
            message: "Messages fetched successfully",
            data: message,
        })
    } catch (error) {
        res.send({
            success: false,
            message: "Error fetching messages",
            error: error.message,
        });
    }
 });

module.exports = router;