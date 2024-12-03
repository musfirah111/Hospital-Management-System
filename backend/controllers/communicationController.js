const StreamChat = require('stream-chat').StreamChat;
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Initialize Stream Chat
const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY);

const initializeChat = async (req, res) => {
    try {
        const { userId, userType } = req.body;

        // Generate a user token
        const token = serverClient.createToken(userId);

        // Create or update the user in Stream
        let userData;
        if (userType === 'doctor') {
            userData = await Doctor.findOne({ user_id: userId }).populate('user_id');
        } else {
            userData = await Patient.findOne({ user_id: userId }).populate('user_id');
        }

        await serverClient.upsertUser({
            id: userId,
            role: userType,
            name: userData.user_id.name,
        });

        res.status(200).json({
            success: true,
            token,
            apiKey: process.env.STREAM_API_KEY
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error initializing chat',
            error: error.message
        });
    }
};

const createChannel = async (req, res) => {
    try {
        const { doctorId, patientId } = req.body;

        // Create a unique channel ID
        const channelId = `${doctorId}-${patientId}`;

        const channel = serverClient.channel('messaging', channelId, {
            members: [doctorId, patientId],
            created_by_id: req.user.id
        });

        await channel.create();

        res.status(201).json({
            success: true,
            channelId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating chat channel',
            error: error.message
        });
    }
};

const deleteChannel = async (req, res) => {
    try {
        const { channelId } = req.body;
        
        const channel = serverClient.channel('messaging', channelId);
        await channel.delete();

        res.status(200).json({
            success: true,
            message: 'Channel deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting channel',
            error: error.message
        });
    }
};

module.exports = {
    initializeChat,
    createChannel,
    deleteChannel
};
