const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
// const sendVerificationMail = require('../lib/sendverificationcode');
const { sendVerificationMail } = require('../lib/sendverificationcode');
const prisma = new PrismaClient();

// Register user
exports.registerUser = async (req, res) => {
   const { email, password, role } = req.body;

   try {
       // Check if the user already exists
       const existingUser = await prisma.user.findUnique({
         where: { email }
      });

      if (existingUser) {
         return res.status(400).json({ success: false, error: 'Email already in use' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
         data: { email, password: hashedPassword, role }
      });

      const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY, { expiresIn: process.env.JWT_EXPIRE });

      res.status(201).json({ success: true, token });
   } catch (error) {
      res.status(400).json({ success: false, error: error.message });
   }
};


// Login user with verification code
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide an email and password"
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials, user not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials, password does not match" });
        }

        // Generate a 6-digit verification code
        const verificationCode = crypto.randomInt(100000, 999999).toString();

        // Store the code temporarily (in DB or cache, here using Prisma)
        await prisma.user.update({
            where: { email },
            data: { verificationCode,
               verificationCodeExpire: new Date(Date.now() + 10 * 60 * 1000) // Expires in 10 mins
             }
        });

        // Send the verification code via email
        await sendVerificationMail(email, verificationCode);

        res.status(200).json({
            success: true,
            message: "Verification code sent to your email. Please verify to continue."
        });
    } catch (error) {
        next(error);
    }
};

// Verify the code and log the user in
exports.verifyCode = async (req, res, next) => {
    const { email, verificationCode } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.verificationCode !== verificationCode) {
            return res.status(401).json({ success: false, message: "Invalid or expired verification code" });
        }

        // Clear the verification code after successful verification
        await prisma.user.update({
            where: { email },
            data: { verificationCode: null }
        });

        const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY, { expiresIn: "1d" });

        res.status(200).json({ success: true, token, user });
    } catch (error) {
        next(error);
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
   try {
      const user = await prisma.user.findUnique({
         where: { id: req.user.id }
      });

      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, user });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

// Update user
exports.updateUser = async (req, res) => {
   try {
      const user = await prisma.user.update({
         where: { id: req.user.id },
         data: req.body
      });

      res.status(200).json({ success: true, data: user });

   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
   }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
   const { email } = req.body;

   try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
         return res.status(404).json({ success: false, message: 'No user found with this email' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      await prisma.user.update({
         where: { email },
         data: {
            resetPasswordToken: hashedToken,
            resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000)
         }
      });

      res.status(200).json({ success: true, resetToken });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};

// Reset password
exports.resetPassword = async (req, res) => {
   const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

   try {
      const user = await prisma.user.findFirst({
         where: {
            resetPasswordToken,
            resetPasswordExpire: { gt: new Date() }
         }
      });

      if (!user) {
         return res.status(400).json({ success: false, message: 'Invalid or expired token' });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      await prisma.user.update({
         where: { id: user.id },
         data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpire: null
         }
      });

      res.status(200).json({ success: true, message: 'Password reset successful' });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
};
