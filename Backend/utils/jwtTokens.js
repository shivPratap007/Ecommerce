const sentToken = (user, statusCode, res) => {
  const token = user.generateJwtTokens();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success:true,
    user,
    token,
  });
};

module.exports=sentToken;