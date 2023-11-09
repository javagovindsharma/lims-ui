const { createHash, randomBytes } = require("crypto");

/** Base64 url encode a string
 * @param {string} base64 The base64 string to url encode
 * @returns {string} The base64 url encoded string
 */
export function base64UrlEncode(base64: any) {
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function generateChallenge(code_verifier: any) {
  const hash = createHash("sha256").update(code_verifier).digest("base64");
  return base64UrlEncode(hash);
}
