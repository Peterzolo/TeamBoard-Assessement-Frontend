import CryptoJS from "crypto-js";

// Todo Move this to env
const secret =
  "a98d7f9a7ro3wur98dsfap9d87aoeu#Q@#$@#GARE%#$^%#QRTSR^$%ahoufdsou8";

// Move the secret key to environment variables for security
// const secret = process.env.NEXT_PUBLIC_SECRET_KEY || "fallback-secret-key";

// Encrypt data
export const encodeData = (payload: any): string => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(payload), secret).toString();
  } catch (error) {
    console.error("Error encoding data:", error);
    return "";
  }
};

// Decrypt data
export const decodeData = (token: string): any | null => {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(token, secret);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error("Decryption failed: Empty result");
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Error decoding data:", error);
    return null; // Handle decryption failure gracefully
  }
};
