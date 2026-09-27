import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  // Check if this card is currently selected
  const isSelected = selectedImage === image;

  return (
    <div
      onClick={() => {setSelectedImage(image); 
        setBackendImage(null);
        setFrontendImage(null)}}
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-cyan-400 scale-105 shadow-lg shadow-cyan-500/20"
          : "border-blue-700 hover:border-white"
      }`}
    >
      <img src={image} alt="Assistant Option" className="w-full h-full object-cover" />
    </div>
  );
}

export default Card;