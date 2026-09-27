import User from "../models/user.model.js"

import mistralResponse from "../gemini.js"
import localModelResponse from "../local_model.js";
// import { JsonWebTokenError } from "jsonwebtoken"
import moment from "moment/moment.js"

export const getCurrentUser = async (req, res) => {

    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")

        if (!user) {
            return res.status(400).json({ message: "not found" })


        }

        return res.status(200).json(user)

    } catch (error) {

        return res.status(400).json({ message: "get current user error" })



    }

}

export const updateAssistent = async (req, res) => {
    try {
        const { assistantName, assistentname, imageUrl } = req.body;
        const finalAssistantName = assistantName || assistentname; let assistantImage;
        if (req.file) { assistantImage = await uploadOnCloudinary(req.file.path); }
        else if (imageUrl) { assistantImage = imageUrl; }
        const user = await User.findByIdAndUpdate(req.userId, { assistantName: finalAssistantName, assistantImage, },
            { new: true }).select("-password"); return res.status(200).json(user);
    }
    catch (error) {
        console.error("update assistant user error", error);
        return res.status(400).json({ message: "update assistant user error" });
    }
}
export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                response: "User not found"
            });
        }

        // Save command in history
        if (!user.history) {
            user.history = [];
        }

        user.history.push(command);
        await user.save();

        const userName = user.name;
        const assistantName = user.assistantName;

        const result = await localModelResponse(
            command,
            assistantName,
            userName
        );

        if (!result) {
            return res.status(503).json({
                response: "Assistant is temporarily unavailable"
            });
        }

        console.log("Mistral result:", result);

        const jsonMatch = result.match(/{[\s\S]*}/);

        if (!jsonMatch) {
            return res.status(400).json({
                response: "Sorry, can't understand"
            });
        }

        const gemResult = JSON.parse(jsonMatch[0]);

        const type = gemResult.type;

        switch (type) {
            case "get-date":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`
                });

            case "get-time":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current time is ${moment().format("hh-mm-A")}`
                });

            case "get-day":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("dddd")}`
                });

            case "get-month":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("MMMM")}`
                });

            case "google-search":
            case "youtube-search":
            case "youtube-play":
            case "general":
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response
                });

            default:
                return res.status(400).json({
                    response: "I didn't understand"
                });
        }

    } catch (error) {
        console.error(
            "ASK ASSISTANT ERROR:",
            error.response?.data || error.message
        );

        if (error.response?.status === 429) {
            return res.status(503).json({
                response: "Assistant service is temporarily unavailable. Please try again later."
            });
        }

        return res.status(500).json({
            response: "ask error",
            error: error.message
        });
    }
};