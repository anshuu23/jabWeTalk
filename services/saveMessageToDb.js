const messageMap = require("./map")
const roomModel = require("../models/room")

async function saveMessageToDb(room) {
    
    try {
       
        if (!messageMap.has(room)) {
            console.log(`No messages found for room: ${room}`);
            return;
        }

        const messages = messageMap.get(room); 

        if (!messages || messages.length === 0) {
            console.log(`No messages to save for room: ${room}`);
            return;
        }

        // Save messages to the database
        await roomModel.findOneAndUpdate(
            { roomName:room }, 
            { $push: { messages: { $each: messages } } }, 
            { upsert: true, new: true } 
        );

        
        messageMap.delete(room);

        
    } catch (error) {
        console.error(`Failed to save messages for room: ${room}`, error);
    }
}

module.exports = {saveMessageToDb}

