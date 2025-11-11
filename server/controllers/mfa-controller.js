import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';
import qrcode from 'qrcode';
import User from "../models/user.js";

export const generateMFA = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const secret = speakeasy.generateSecret(
    { 
      name: `${user.name} ${user.email}`,
      issuer: "PanetiPortal",
      length: 20
    });
  await User.findByIdAndUpdate(req.params.id, { secret: secret.base32 });
  const qr = await qrcode.toDataURL(secret.otpauth_url);
  res.json({ qr, secret: secret.base32 });
};

export const verifyMFASetup = async (req, res) => {
  const { userId, token } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: 'base32',
    token
  });

  if (verified) {
    user.isMfaEnabled = true;
    await user.save();
    return res.json({ message: 'MFA setup complete', user: { id: user._id, isMfaEnabled: user.isMfaEnabled } });
  }

  res.status(400).json({ message: 'Invalid code' });
}

export const verifyMFA = async (req, res) => {
  const { userId, token } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ message: "User not found" });
  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: "base32",
    token
  });

  if (!verified) return res.status(400).json({ message: "Invalid MFA code" });

  const authToken = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
  res.json({ message: "Login success", token: authToken, user : { id: user._id, name: user.name, email: user.email, isMfaEnabled: user.isMfaEnabled } } );
};
