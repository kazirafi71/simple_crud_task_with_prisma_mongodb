if (process.env.NODE_ENV === "production") {
} else if (process.env.NODE_ENV === "development") {
  module.exports = {
    verificationUrl: "http://localhost:5000/api/verify-email",
    loginUrl: "http://localhost:3000/login",
  };
}
