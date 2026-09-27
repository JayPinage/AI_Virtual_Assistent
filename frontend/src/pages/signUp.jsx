import React, { useContext, useState } from "react";
import bg from "../assets/authImage.png"
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios"

function SignUp(){

const {serverUrl,userData,setUserData}=useContext(userDataContext)
const navigate = useNavigate()
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [err,setError] =useState("")
const [loading,setLoading] = useState(false)

const handleSignUp = async (e)=>{
  e.preventDefault()
  setError("")
  setLoading(true)
  try{
    let result = await axios.post(`${serverUrl}/api/auth/signup`,
      {name,email,password},{withCredentials:true}
    );
    setUserData(result.data)
     navigate("/customize")
    setLoading(false)
   

  }catch(error){
    console.log(error)

    setLoading(false)
    setUserData(null)
    setError(error.response.data.message)

  }
  

}


  return (
    <div className='w-full h-[100vh] bg-cover flex 
    justify-center items-center' 
    style={{backgroundImage:`url(${bg})`}}>
     <form className='w-[90%] h-[600px] max-w-[500px] 
     bg-[#00000069]] backdrop-blur shadow-black 
     flex flex-col items-center justify-center gap-[20px] px-[20px]'
     onSubmit={handleSignUp}>
      <h1 className="text-white text-[30px] font-semibold mb-[30px]">Register to 
        <span className="text-blue-500"> Virtual Assistent</span></h1>

        <input type="text" placeholder="Enter Your Name" 
        className="w-full h-[60px] outline-none border-2
        border-white bg-transparent text-white placeholder-grey-300 px-[20px] py-[20px] rounded-full
        " required onChange={(e)=>setName(e.target.value)} value={name}>
        </input>

         <input type="email" placeholder="Email" 
        className="w-full h-[60px] outline-none border-2
        border-white bg-transparent text-white placeholder-grey-300 px-[20px] py-[20px] rounded-full"
        required onChange={(e)=>setEmail(e.target.value)} value={email}>
        </input>

        <div className="w-full h-[60px] outline-none border-2
        border-white bg-transparent text-white placeholder-grey-300 px-[20px] py-[20px] rounded-full">
          <input type="password" placeholder="password" 
          className="w-full h-full rounded-full outline-none bg-transparent text-white 
          placeholder-grey-300 px-[20px] rounded-full" required onChange={(e)=>setPassword(e.target.value)} value={password}>
          
          </input>

        </div>
        {err.length>0 && (<p className="text-red-500">{err}</p>)}

        <button className="min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full 
        text-black font-semibold bg-white text-[19px]" disabled={loading}>{loading ? "Loading...":"Sign Up"}
          

        </button>
        <p className="text-[white] text-[18px] cursor-pointer" 
        onClick={()=>navigate('/signin')}>Already have an account ?
          <span className="text-blue-400 "> Sign In</span> </p>
        

     </form>

    </div>
  )
}

export default SignUp