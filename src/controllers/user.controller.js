import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res, next) => {
    // get user details from frontend
    // preform validation 
    // check if user already exists in database using email and username
    // check for image existance, avatar
    // upload image to cloudinary
    // validate cloudinary return url and it is stored in database
    // save the data
    // return response to frontend  but remove password and any sensitive information from being sent

    const { fullName, email, username, password } = req.body

    if(fullName.trim() === ""){
        throw new ApiError(400, "Fullname is required")
    }
    if(email.trim() === ""){
        throw new ApiError(400, "Email is required")
    }
    if(username.trim() === ""){
        throw new ApiError(400, "Username is required")
    }
    if(password.trim() === ""){
        throw new ApiError(400, "Password is required")
    }

    const existedUser = await User.findOne({
        $or: [ { username }, { email } ]
    })

    if(existedUser) {
        throw new ApiError(409, "Username or Email Address already exists")
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalPath = req.files?.avatar[0].path;
    }
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files?.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar File is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar File is not Uploaded")
    }
    
    const user = await User.create({
        fullName, 
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email: email,
        username: username,
        password: password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) throw new ApiError(500, "Something went wrong while registering the user")

    await res.status(201).json(
        new ApiResponse(201, createdUser, "User Registered Successfully")
    )
})

export {
    registerUser
}