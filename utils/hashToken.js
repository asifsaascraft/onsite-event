import crypto from "crypto";

const hashToken = (token) => {
  if (!token) {
    throw new Error("Token is required.");
  }

  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

export default hashToken;