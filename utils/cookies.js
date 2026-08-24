// ==========================================
// Set Refresh Token Cookie
// ==========================================

export const setRefreshTokenCookie = (
  res,
  refreshToken,
) => {
  const maxAge =
    7 * 24 * 60 * 60 * 1000;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,

    secure:
      process.env.NODE_ENV === "production",

    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",

    maxAge,

    path: "/",
  });
};

// ==========================================
// Clear Refresh Token Cookie
// ==========================================

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,

    secure:
      process.env.NODE_ENV === "production",

    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",

    path: "/",
  });
};