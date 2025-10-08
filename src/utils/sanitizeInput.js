import validator from "validator";

// Helper to detect if input has unsafe characters (like < > & " etc.)
const hasUnsafeChars = (str) => str !== validator.escape(str);

// Helper to detect spaces anywhere in the string
const hasSpaces = (str) => /\s/.test(str);

export default { hasUnsafeChars, hasSpaces };