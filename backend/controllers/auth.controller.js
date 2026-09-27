import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"


// signup
export const signUp = async (req , res)=>{
    try{
  const {name,email,password} = req.body

  const existEmail = await User.findOne({email})

  if (existEmail){
    return res.status(400).json({message:"email already exist"})
  }

  if (password.length<6){
    return res.status(400).json({message:"password must be at least 6 characters"})
  }

  const hashPassword = await bcrypt.hash(password,10)

  const user = await User.create({
    name,password:hashPassword,email
  })
  const token = await genToken(user._id)

  res.cookie("token",token,{
    httpOnly  :true,
    maxAge : 7*24*60*60*1000,
    sameSite:"strict",
    secure : false



  })

  return res.status(201).json(user)
  


    }catch(error){

        return res.status(500).json({message:"sign up error"})

    }
}

// login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existEmail = await User.findOne({ email });

    if (!existEmail) {
      return res.status(400).json({
        message: "Email does not exist"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      existEmail.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect"
      });
    }

    const token = await genToken(existEmail._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: existEmail._id,
        name: existEmail.name,
        email: existEmail.email
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Login error",
      error: error.message
    });
  }
};

// logout

export const logOut = async (req,res) =>{

    try{

        res.clearCookie("token")

        return res.status(200).json({message:"logout success"})


    }catch(error){

        return res.status(500).json({message:"logout error"})

    }
}