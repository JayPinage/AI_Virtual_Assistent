import { useContext, useEffect, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const isSpeakingRef = useRef(false);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      navigate("/signin");
      setUserData(null);
    } catch (error) {
      console.log(error);
    }
  };

  const speak = (text) => {
    isSpeakingRef.current = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      isSpeakingRef.current = false;
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google-search") {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, "_blank");
    }
    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube-search" || type === "youtube-play") {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, "_blank");
    }
  };

  useEffect(() => {
    if (!userData?.assistantName) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log("SpeechRecognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    const safeStart = () => {
      // Don't restart while assistant is speaking (avoids hearing itself)
      // or while already running.
      if (isRecognizingRef.current || isSpeakingRef.current) return;
      try {
        recognition.start();
        isRecognizingRef.current = true;
      } catch (err) {
        // start() throws if called while already running — ignore
        console.log("start() skipped:", err.message);
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      // Keep the mic "always on": restart shortly after it ends,
      // unless the assistant is currently speaking.
      setTimeout(() => {
        if (!isSpeakingRef.current) safeStart();
      }, 300);
    };

    recognition.onerror = (e) => {
      console.log("recognition error:", e.error);
      isRecognizingRef.current = false;
      // "no-speech" / "aborted" are normal; onend will fire and restart.
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard:" + transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        recognition.stop(); // pause while we process + speak, restarts via onend
      const data = await getGeminiResponse(transcript);

console.log("AI response:", data);

if (data) {
  handleCommand(data);
}
      }
    };

    safeStart();

    return () => {
      recognition.onend = null; // prevent restart-on-unmount
      recognition.stop();
      isRecognizingRef.current = false;
    };
  }, [userData?.assistantName]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col gap-6 relative px-4">
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <button onClick={() => navigate("/customize")} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-medium text-sm backdrop-blur-md transition-all cursor-pointer shadow-md">
          Customize
        </button>
        <button onClick={handleLogOut} className="px-5 py-2.5 bg-white hover:bg-gray-200 text-black rounded-full font-semibold text-sm transition-all shadow-lg cursor-pointer">
          Log Out
        </button>
      </div>

      <div className="w-[280px] h-[380px] md:w-[320px] md:h-[420px] bg-[#030326] border-2 border-cyan-500/40 flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl shadow-cyan-500/10">
        <img src={userData?.assistantImage} alt="Assistant" className="w-full h-full object-cover" />
      </div>

      <div className="text-center">
        <p className="text-cyan-400 text-xs md:text-sm uppercase tracking-widest font-semibold mb-1">
          Active Assistant
        </p>
        <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide uppercase">
          {userData?.assistantName ? `I'M ${userData.assistantName}` : "I'M YOUR ASSISTANT"}
        </h1>
      </div>
    </div>
  );
}

export default Home;