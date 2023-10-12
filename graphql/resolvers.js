const User = require("../models/user");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

// Function to generate a JWT
function generateToken(user) {
  const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h', algorithm: 'HS256' });
  return token;
}

// Function to verify token
function verifyToken(token) {
  if (!token) {
    throw new Error('Token not provided');
  }

  try {
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

// GraphQL Resolvers
const resolvers = {
    Mutation: {
    register: async (_, { userInput: { name, password, role } }) => {
      if (!name || !password || !role) {
        throw new Error('Name password, and role required');
      }

      const newUser = new User({
        name: name,
        password: password,
        role: role,
      });

      try {
        const response = await newUser.save();
        return {
          id: response._id,
          ...response._doc,
        };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create user');
      }
    },

    login: async (_, { name, password }) => {
      try {     
        const user = await User.findOne({ name: name });
        if (!user) {
          throw new Error('User not found');
        }
        if (password !== user.password) {
          throw new Error('Incorrect password');
        }      
        const token = generateToken(user);      
        if (!token) {
          throw new Error('Failed to generate token');
        }
        return {
          message: 'Login successful',
          token: token,
        };
      } catch (error) {
        console.error(error);
        throw new Error('Login failed');
      }
    }
  },
  Query: {
    users: async (parent, args, context) => {
      try {
        // Extract the token from the request headers
        const token = context.req.headers.authorization || '';


        const decodedToken = verifyToken(token);
        if (decodedToken.role !== 'Admin') {
          throw new ('Unauthorized. Only Admins can access this data.');
        }
        const users = await User.find({}, { name: 1, _id: 1, role: 1 });
        return users;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch users');
      }
    },
  },
};

module.exports = resolvers;
