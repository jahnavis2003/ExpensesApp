const passwordValidator = (password) => {
  if (typeof password !== 'string') return false;

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return regex.test(password);
};
export default passwordValidator;