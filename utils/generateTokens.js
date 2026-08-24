import jwt from "jsonwebtoken";

// ==========================================
// Generate Access Token
// ==========================================

const generateAccessToken = ({
  userId,
  role,
  sessionId,
}) => {
  return jwt.sign(
    {
      userId,
      role,
      sessionId,
      tokenType: "access",
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES || "1d",
    },
  );
};

// ==========================================
// Generate Refresh Token
// ==========================================

const generateRefreshToken = ({
  userId,
  role,
  sessionId,
}) => {
  return jwt.sign(
    {
      userId,
      role,
      sessionId,
      tokenType: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRES || "7d",
    },
  );
};

// ==========================================
// Generate Both Tokens
// ==========================================

const generateTokens = ({
  userId,
  role,
  sessionId,
}) => {
  const accessToken =
    generateAccessToken({
      userId,
      role,
      sessionId,
    });

  const refreshToken =
    generateRefreshToken({
      userId,
      role,
      sessionId,
    });

  return {
    accessToken,
    refreshToken,
  };
};

export {
  generateAccessToken,
  generateRefreshToken,
};

export default generateTokens;