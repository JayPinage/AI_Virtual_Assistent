import { useContext, useRef, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authImage.png";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
function Customize() {
    const navigate=useNavigate()
    const {serverUrl,
    userData,
    setUserData,backendImage,
     setBackendImage,
     frontendImage,
      setFrontendImage,
      selectedImage,setSelectedImage}=useContext(userDataContext)

  const inputImage = useRef();


  // Handle file selection and preview generation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col gap-6 py-10 px-4">
                 <IoMdArrowRoundBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]" onClick={()=>navigate("/")} />
      <h1 className="text-white text-xl md:text-2xl font-medium mb-2">
        Select Your Assistant Image
      </h1>

      {/* Preset Cards Container */}
      <div className="w-full max-w-2xl flex justify-center items-center flex-wrap gap-4">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
      </div>


      {/* Custom Image Upload Card */}
      <div
        onClick={() => {
          inputImage.current.click();
          setSelectedImage("input");
        }}
        className={`w-[100px] h-[160px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg ${
          selectedImage === "input"
            ? "border-cyan-400 scale-105 shadow-cyan-500/20"
            : "border-blue-500 hover:border-white"
        }`}
      >
        {frontendImage ? (
          <img
            src={frontendImage}
            alt="Custom Upload Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <RiImageAddLine className="text-white w-7 h-7" />
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputImage}
        onChange={handleImageChange}
        hidden
      />

      {/* Next Button */}
      {selectedImage &&  <button onClick={()=>navigate("/customize2")} className="min-w-[160px] h-[50px] mt-4 bg-white rounded-full text-black font-semibold text-lg hover:bg-gray-200 transition-colors cursor-pointer shadow-md 
      cursor-pointer">
        Next 
      </button>}
     
    </div>
  );
}

export default Customize;