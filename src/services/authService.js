import User from '../models/userModel.js';

const getUserByEmailAsync = async (email) => {
    const user = await User.findOne({ email }).select('+password');
    return user;
}

export default { getUserByEmailAsync };