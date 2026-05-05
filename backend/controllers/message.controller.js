import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const { message, replyTo } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        const newMessage = await Message.create({
            senderId,
            message,
            replyTo: replyTo || null
        });

        const populatedMessage = await newMessage.populate([
            { path: "senderId", select: "fullname profile" },
            { path: "replyTo", select: "message senderId", populate: { path: "senderId", select: "fullname" } }
        ]);

        return res.status(201).json({
            success: true,
            message: populatedMessage
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate("senderId", "fullname profile")
            .populate({
                path: "replyTo",
                select: "message senderId",
                populate: { path: "senderId", select: "fullname" }
            })
            .sort({ createdAt: 1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get messages."
        });
    }
};

export const editMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const { text } = req.body;
        const userId = req.id;

        const message = await Message.findById(messageId);
        
        if (!message) return res.status(404).json({ success: false, message: "Message not found." });
        if (message.senderId.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized." });

        message.message = text;
        message.isEdited = true;
        await message.save();

        return res.status(200).json({ success: true, message: "Message updated." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.id;

        const message = await Message.findById(messageId);
        
        if (!message) return res.status(404).json({ success: false, message: "Message not found." });
        if (message.senderId.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized." });

        await Message.findByIdAndDelete(messageId);

        return res.status(200).json({ success: true, message: "Message deleted." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error." });
    }
};
