const signup = (req, res) => {
  res.send("Signup route");
};

const signin = (req, res) => {
  res.send("Signin route");
};

module.exports = {
  signup,
  signin,
};
