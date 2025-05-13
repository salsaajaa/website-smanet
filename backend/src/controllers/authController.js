// PERIKSA BARIS INI: Pastikan path dan nama file model user Anda benar
const userModel = require('../models/userModels'); 

const passwordResetTokenModel = require('../models/passwordResetTokenModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';

if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined. Please set it in your .env file.');
}
if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('WARNING: Email user or password not defined. Password reset emails will not be sent.');
}


const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi.' });
        }

        const user = await userModel.findByEmail(email);

        const isPasswordValid = user && await bcrypt.compare(password, user.password);

        if (!user || !isPasswordValid) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const userDataForFrontend = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            message: 'Login Berhasil!',
            token: token,
            user: userDataForFrontend,
        });

    } catch (error) {
        console.error('AuthController: Error pada proses login:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat login.' });
    }
};

const register = async (req, res) => {
        try {
            const { email, password, username } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email dan password wajib diisi.' });
            }

                const existingUserByEmail = await userModel.findByEmail(email);
            if (existingUserByEmail) {
                return res.status(409).json({ message: 'Email sudah terdaftar.' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const role = 'user';
            const finalUsername = username || email;

            const newUserResult = await userModel.createUser(finalUsername, hashedPassword, email, role);

            res.status(201).json({ message: 'Registrasi berhasil!', userId: newUserResult.id });

        } catch (error) {
            console.error('AuthController: Error pada proses registrasi:', error);
            res.status(500).json({ message: 'Terjadi kesalahan pada server saat registrasi.' });
        }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findByEmail(email);

        if (!user) {
            return res.status(200).json({ message: 'Jika email terdaftar, link reset password akan dikirim.' });
        }

        await passwordResetTokenModel.deleteByEmail(email);

        const resetToken = crypto.randomBytes(32).toString('hex');

        const expiresAt = new Date(Date.now() + 3600000);

        await passwordResetTokenModel.create(user.email, resetToken, expiresAt);


        // --- Implementasi Pengiriman Email ---
        const mailOptions = {
            to: user.email,
            from: EMAIL_USER,
            subject: 'Permintaan Reset Password',
            text: `Anda menerima email ini karena Anda (atau seseorang lain) telah meminta reset password untuk akun Anda.\n\n`
                  + `Silakan klik link berikut, atau salin dan tempel di browser Anda untuk menyelesaikan prosesnya:\n\n`
                  + `http://localhost:8080/reset-password?token=${resetToken}\n\n`
                  + `Jika Anda tidak meminta ini, abaikan email ini dan password Anda akan tetap tidak berubah.\n`
        };

        await transporter.sendMail(mailOptions);
        // --- Akhir Implementasi Pengiriman Email ---


        res.status(200).json({ message: 'Jika email terdaftar, link reset password akan dikirim.' });

    } catch (error) {
        console.error('AuthController: Error pada proses forgot password:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat meminta reset password.' });
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token dan password baru harus disediakan.' });
    }

    try {
        const resetTokenEntry = await passwordResetTokenModel.findByToken(token);

        if (!resetTokenEntry) {
            return res.status(400).json({ message: 'Token reset password tidak valid atau sudah kedaluwarsa.' });
        }

        const user = await userModel.findByEmail(resetTokenEntry.email);

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.updatePassword(user.id, hashedPassword);

        await passwordResetTokenModel.deleteByToken(token);

        res.status(200).json({ message: 'Password berhasil direset.' });

    } catch (error) {
        console.error('AuthController: Error during password reset:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mereset password.' });
    }
};

const verifyToken = (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token == null) {
          return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
      }

      jwt.verify(token, JWT_SECRET, (err, user) => {
          if (err) {
              return res.status(403).json({ message: 'Akses ditolak. Token tidak valid atau expired.' });
          }

          req.user = user;
          next();
      });
};

module.exports = {
    login,
    register,
    verifyToken,
    forgotPassword,
    resetPassword,
};
