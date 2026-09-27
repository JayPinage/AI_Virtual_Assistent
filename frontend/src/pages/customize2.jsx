import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Customize2() {
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
    const navigate = useNavigate()

    const handleUpdateAssistant = async () => {
        try {
            if (!assistantName.trim()) return;

            const formData = new FormData();
            formData.append("assistantName", assistantName.trim());

            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else if (selectedImage) {
                formData.append("imageUrl", selectedImage);
            }

            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true });
            console.log(result.data);
            setUserData(result.data);
            navigate("/")
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col gap-6 py-10 px-4">
            <IoMdArrowRoundBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]" onClick={()=>navigate("/customize")} />

            <h1 className="text-white text-xl md:text-2xl font-medium">Enter Your Assistant Name</h1>

            {/* Input fixed: Added 'px' to max-w, corrected placeholder color, removed '</input>' */}
            <input
                type="text"
                placeholder="eg. Jarvis"
                className="w-full max-w-[500px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-400 px-[20px] rounded-full focus:border-cyan-400 transition-all"
                required
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
            />

            {assistantName && (
                <button
                    onClick={handleUpdateAssistant}
                    className="min-w-[160px] h-[50px] mt-4 bg-white rounded-full text-black font-semibold text-lg hover:bg-gray-200 transition-colors cursor-pointer shadow-md"
                >
                    Create Assistant
                </button>
            )}
        </div>
    );
}

export default Customize2;