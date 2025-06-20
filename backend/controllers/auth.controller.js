import {User} from "../models/user.model.js"
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const {email, password, name} = req.body;

  try {
    if(!email || !password || !name) {
      throw new Error("All fields are required")
    }

    const userAlreadyExist = await User.findOne({email});
    if(userAlreadyExist) {
      return res.status(400).json({success:false, message: "User already exists"})
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); //✅ 1. Defines and exports a function export const generateVerificationCode = () => { ... }This creates an arrow function named generateVerificationCode and exports it so it can be used in other files.✅ 2. Generates a 6-digit random numberMath.floor(100000 + Math.random() * 900000)Math.random() generates a number between 0 (inclusive) and 1 (exclusive), like 0.76352.Math.random() * 900000 gives a number between 0 and 899999.999...Adding 100000 ensures the result is between:100000 and 999999.999...Math.floor(...) cuts off the decimal part, so you get a whole number between 100000 and 999999 — a 6-digit number.✅ 3. Converts the number to a string.toString()This turns the number (like 748302) into a string ("748302"), which is useful if you want to send it as a code via email, SMS, etc.🔚 Final resultYou get a random 6-digit verification code as a string, like "384761".
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 *1000, //24 hours
    })

    await user.save();

    //jwt
    generateTokenAndSetCookie(res, user._id); //Recordá que ponemos guión bajo porque MongoDB guarda los id así (por ejemplo el la base de datos mostraría algo así "_id:87653234")

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({success: false, message: error.message});
  }
}

export const verifyEmail= async (req, res) => {
  const {code} = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: {$gt: Date.now()}
    })

    if(!user) {
      return res.status(400).json({success: false, message: "Invalid or expired vverification code"})
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      }
    })
  } catch (error) {
    console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
  }
}

export const login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({success: false, message: "Invalid credentias"});
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if(!isPasswordValid) {
      return res.status(400).json({success: false, message: "Invalid credentials"});
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });

  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({success: false, message: error.message});
  }
}

export const logout = async (req, res) => {
  res.clearCookie("token")
  res.status(200).json({success: true, message: "Logged out successfully"});
}

export const forgotPassword = async (req, res) => {
  const {email} = req.body;
  try {
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({success:false, message: "User not found"});
    }

    //Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //send email.
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

    res.status(200).json({success: true, message: "Password reset link sent to your email"});
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({success: false, message: error.message});
  }
}

export const resetPassword = async (req, res) => {
  try {
    const {token} = req.params;
    const {password} = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: {$gt: Date.now()},
    });

    if(!user){
      return res.status(400).json({success:false, message: "Invalid or expired reset token"});
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({success: true, message: "Password reset successful"});
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({success: false, message: error.message});
  }
}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({success: false, message: "User not found"});
    }

    res.status(200).json({success: true, user});
  } catch (error) {
    console .log("Error in checkAuth ", error);
    res.status(400).json({success: false, message: error.message});
  }
}