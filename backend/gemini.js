import axios from "axios";

const mistralResponse = async (
  command,
  assistantName,
  userName
) => {
  try {
    const apiUrl = process.env.GROQ_URL;

    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",
  "userInput": "<original user input> {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai toh userInput me only bo search waala text jaye",
  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": determine the intent of the user.
- "userinput": original sentence the user spoke.
- "response": A short voice-friendly reply.
- "general": if it's a factual or informational question.
- "google-search": if user wants to search something on Google.
- "youtube-search": if user wants to search something on YouTube.
- "youtube-play": if user wants to directly play a video or song.
- "calculator-open": if user wants to open a calculator.
- "instagram-open": if user wants to open instagram.
- "facebook-open": if user wants to open facebook.
- "weather-show": if user wants to know weather.
- "get-time": if user asks for current time.
- "get-date": if user asks for today's date.
- "get-day": if user asks what day it is.
- "get-month": if user asks for the current month.

Important:
- Use ${userName} agar koi puche tume kisne banaya.
- Only respond with the JSON object, nothing else.

now your userInput- ${command}
`;

    let result;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        result = await axios.post(
          apiUrl,
          {
            model: process.env.GROQ_MODEL,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        break;
      } catch (error) {
        if (
          attempt === 1 ||
          error.response?.status < 500
        ) {
          throw error;
        }
      }
    }

    return result.data.choices[0].message.content;

  } catch (error) {
    console.error(
      "Mistral request error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export default mistralResponse;