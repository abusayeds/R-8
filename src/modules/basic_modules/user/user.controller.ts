import { myReviewDB } from './user.service';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {
  createUser,
  findUserByEmail,
  findUserById,
  generateOTP,
  generateToken,
  getStoredOTP,
  getUserList,
  getUserRegistrationDetails,
  hashPassword,
  saveOTP,
  sendOTPEmail,
  signupDB,
  updateUserById,
  usarallReview,
  userDelete,
} from "./user.service";
import { OTPModel, PendingUserModel, UserModel } from "./user.model";
import { IPendingUser } from "./user.interface";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import AppError from "../../../errors/AppError";
import { JWT_SECRET_KEY, Nodemailer_GMAIL, Nodemailer_GMAIL_PASSWORD } from "../../../config";
import sendResponse from "../../../utils/sendResponse";
import { emitNotification } from "../../../utils/socket";

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }
  const isUserRegistered = await findUserByEmail(email);
  if (isUserRegistered) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "You already have an account.",
    );
  }
  await PendingUserModel.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password,
      confirmPassword,
    },
    { upsert: true },
  );
  const otp = generateOTP();
  await saveOTP(email, otp);
  await sendOTPEmail(email, otp);
  const token = jwt.sign({ email }, JWT_SECRET_KEY as string, {
    expiresIn: "7d",
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your email. Please verify to continue registration.",
    data: { token },
  });
});
export const resendOTP = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(httpStatus.UNAUTHORIZED,
      "No token provided or invalid format.",
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as {
    email: string;
  };
  const email = decoded.email;

  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please provide a valid email address.",
    );
  }

  const pendingUser = await PendingUserModel.findOne({ email });
  if (!pendingUser) {
    throw new AppError(httpStatus.NOT_FOUND,
      "No pending registration found for this email.",
    );
  }

  const newOTP = generateOTP();

  await saveOTP(email, newOTP);

  await sendOTPEmail(email, newOTP);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "A new OTP has been sent to your email.",
    data: { token },
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "This account does not exist.",
    );
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND,
      "your account is deleted by admin.",
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password as string,
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED,
      "Wrong password!",
    );
  }

  const token = generateToken({
    id: user._id,
    fristName: user.fristName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    image: user?.image,
    address: user?.address,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login complete!",
    data: {
      user: {
        id: user._id,
        fristName: user.fristName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        image: user?.image,
        address: user?.address,
      },
      token,
    },
  });
});

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new AppError(httpStatus.BAD_REQUEST,
        "Please provide an email.",
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND,
        "This account does not exist.",
      );
    }

    const otp = generateOTP();

    await saveOTP(email, otp);

    const token = jwt.sign({ email }, JWT_SECRET_KEY as string, {
      expiresIn: "7d",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: Nodemailer_GMAIL,
        pass: Nodemailer_GMAIL_PASSWORD,
      },
    });

    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; padding: 20px;">
      <h1 style="text-align: center; color: #452778; font-family: 'Times New Roman', Times, serif;">
        Like<span style="color:black; font-size: 0.9em;">Mine</span>
      </h1>
      <div style="background-color: white; padding: 20px; border-radius: 5px;">
        <h2 style="color:#d3b06c">Hello!</h2>
        <p>You are receiving this email because we received a password reset request for your account.</p>
        <div style="text-align: center; margin: 20px 0;">
          <h3>Your OTP is: <strong>${otp}</strong></h3>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request a password reset, no further action is required.</p>
        <p>Regards,<br>LikeMine</p>
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 10px;">If you're having trouble copying the OTP, please try again.</p>
    </div>
  `;

    const receiver = {
      from: "khansourav58@gmail.com",
      to: email,
      subject: "Reset Password OTP",
      html: emailContent,
    };

    await transporter.sendMail(receiver);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP sent to your email. Please check!",
      data: {
        token: token,
      },
    });
  },
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token as string, process.env.JWT_SECRET_KEY as string);
  const { email, } = decoded as { email: string; id: string };
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please provide both password and confirmPassword.",
    );
  }

  if (password !== confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Passwords do not match.",
    );
  }


  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }

  const newPassword = await hashPassword(password);
  user.password = newPassword;
  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully.",
    data: null,
  });
});

export const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { otp } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new AppError(httpStatus.UNAUTHORIZED,
      "No token provided or invalid format  ",
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as {
    email: string;
  };
  const email = decoded.email;

  const storedOTP = await getStoredOTP(email);

  if (!storedOTP || storedOTP !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Invalid or expired OTP",
    );
  }

  const { fristName, lastName, password } = (await getUserRegistrationDetails(
    email,
  )) as IPendingUser;
  //console.log(objective, "objective from controller");
  const hashedPassword = await hashPassword(password);

  const { createdUser } = await createUser({
    fristName,
    lastName,
    email,
    hashedPassword,
  });

  const userMsg = "Welcome to LikeMine_App.";
  const adminMsg = `${name} has successfully registered.`;

  await emitNotification({
    userId: createdUser._id as string,
    userMsg,
    adminMsg,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registration successful.",
    data: null,
  });
});

export const verifyForgotPasswordOTP = catchAsync(
  async (req: Request, res: Response) => {
    const { otp } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET_KEY as string);
    const { email, } = decoded as { email: string; id: string };
    const otpRecord = await OTPModel.findOne({ email });
    if (!otpRecord) {
      throw new AppError(httpStatus.NOT_FOUND,
        "User not found!",
      );
    }
    const currentTime = new Date();
    if (otpRecord.expiresAt < currentTime) {
      throw new AppError(httpStatus.BAD_REQUEST,
        "OTP has expired",
      );
    }
    if (otpRecord.otp !== otp) {
      throw new AppError(httpStatus.BAD_REQUEST,
        "Wrong OTP",
      );
    }
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP verified successfully.",
      data: null,
    });
  },
);
export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(httpStatus.UNAUTHORIZED,
        "No token provided or invalid format.",
      );
    }
    const token = authHeader.split(" ")[1];

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new AppError(httpStatus.BAD_REQUEST,

        "Please provide old password, new password, and confirm password.",
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as {
      email: string;
    };
    const email = decoded.email;

    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND,
        "User not found.",
      );
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password as string);
    if (!isMatch) {
      throw new AppError(httpStatus.BAD_REQUEST,
        "Old password is incorrect.",
      );
    }

    if (newPassword !== confirmPassword) {
      throw new AppError(httpStatus.BAD_REQUEST,
        "New password and confirm password do not match.",
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "You have successfully changed the password.",
      data: null,
    });
  },
);

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { name, address, bio, phone, age, about, gender } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(httpStatus.UNAUTHORIZED,
      "No token provided or invalid format.",
    );
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };

  const userId = decoded.id;

  const user = await findUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }
  const updateData: any = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;
  if (bio) updateData.bio = bio;
  if (age) updateData.age = age;
  if (about) updateData.about = about;
  if (gender) updateData.gender = gender;
  if (req.file) {
    const imagePath = `public\\images\\${req.file.filename}`;
    const publicFileURL = `/images/${req.file.filename}`;

    updateData.image = {
      path: imagePath,
      publicFileURL: publicFileURL,
    };
  }

  const updatedUser = await updateUserById(userId, updateData);

  if (updatedUser) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated.",
      data: updatedUser,
      pagination: undefined,
    });
  }
});

export const getSelfInfo = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(httpStatus.UNAUTHORIZED,
      "No token provided or invalid format.",
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
  const userId = decoded.id;

  const user = await findUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "profile information retrieved successfully",
    data: user,
    pagination: undefined,
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   throw new AppError(httpStatus.UNAUTHORIZED,
  //     "No token provided or invalid format.",
  //   );
  // }
  const token = authHeader!.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
  const adminId = decoded.id;

  // Find the user by userId
  const user = await findUserById(adminId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "This admin account doesnot exist.",
    );
  }
  // Check if the user is an admin
  if (user.role !== "admin") {
    throw new AppError(httpStatus.FORBIDDEN,
      "Only admins can access the user list.",
    );
  }
  // Pagination parameters
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Optional filters
  const date = req.query.date as string;
  const name = req.query.name as string;
  const email = req.query.email as string;

  // Get users with pagination
  const { users, totalUsers, totalPages } = await getUserList(
    adminId,
    skip,
    limit,
    date,
    name,
    email,
  );
  // Pagination logic for prevPage and nextPage
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  // Send response with pagination details
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User list retrieved successfully",
    data: users,
    pagination: {
      totalPage: totalPages,
      currentPage: page,
      prevPage: prevPage ?? 1,
      nextPage: nextPage ?? 1,
      limit,
      totalItem: totalUsers,
    },
  });
});

export const BlockUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(httpStatus.UNAUTHORIZED,
      "No token provided or invalid format.",
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as {
    id: string;
  };
  const adminId = decoded.id;

  const requestingUser = await UserModel.findById(adminId);

  if (!requestingUser || requestingUser.role !== "admin") {
    throw new AppError(httpStatus.FORBIDDEN,
      "Unauthorized: Only admins can change user status.",
    );
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }

  if (user.role === "admin") {
    throw new AppError(httpStatus.FORBIDDEN,
      "Cannot change status of an admin user.",
    );
  }

  // Toggle the status
  user.status = user.status === "active" ? "blocked" : "active";
  await user.save();

  // const userMsg =
  //   user.status === "blocked"
  //     ? "Your account has been blocked by an admin."
  //     : "Your account has been unblocked by an admin.";

  // Uncomment this when you're ready to use the notification function
  // await emitNotificationForChangeUserRole({
  //   userId,
  //   userMsg,
  // });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User status changed to ${user.status} successfully.`,
    data: null,
    pagination: undefined,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.query?.id as string;

  const user = await findUserById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "user not found .",
    );
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND,
      "user  is already deleted.",
    );
  }
  await userDelete(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user deleted successfully",
    data: null,
  });
});


//admin-login
export const adminloginUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // const lang = req.headers.lang as string;

    // // Check language validity
    // if (!lang || (lang !== "es" && lang !== "en")) {
    //  throw new AppError(httpStatus.BAD_REQUEST, {
    //      "Choose a language",
    //   );
    // }

    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND,


        "This account does not exist.",
      );
    }

    if (user.role !== "admin") {
      throw new AppError(httpStatus.FORBIDDEN,
        "Only admins can login.",
      );
    }

    // Check password validity
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!isPasswordValid) {
      throw new AppError(httpStatus.UNAUTHORIZED,

        // lang === "es" ? "¡Contraseña incorrecta!" :
        "Wrong password!",
      );
    }

    // Generate new token for the logged-in user
    const newToken = generateToken({
      id: user._id,
      fristName: user.fristName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      image: user?.image,
      // lang: lang,
    });

    // Send the response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        // lang === "es" ? "¡Inicio de sesión completo!" :
        "Login complete!",
      data: {
        user: {
          id: user._id,
          fristName: user.fristName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          image: user?.image,
        },
        token: newToken,
      },
    });
  },
);

export const getAllUserReview = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params
  const result = await usarallReview(userId as string)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Get All User Review successfully !",
    data: result,
  });

});



export const signup = catchAsync(async (req: Request, res: Response) => {
  const result = await signupDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " sing up successfully !",
    data: result,
  });
});
export const myReview = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params
  const result = await myReviewDB(userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Get All  successfully !",
    data: result,
  });
});


