import crypto from "crypto";

const generateRandomToken = (bytes = 32) => {
  const rawToken = crypto
    .randomBytes(bytes)
    .toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return {
    rawToken,
    hashedToken,
  };
};

export default generateRandomToken;