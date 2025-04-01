export {}

// backend/routes/user.js
import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken'
import { User } from './../data_models/mongodb';
import { ObjectId } from "mongoose";

interface UserProp {
  _id: ObjectId, 
  firstName: string, 
  lastName: string, 
  email: string,
}

// ✅ Utility function to generate JWT token
const generateToken = (user: UserProp) => {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,  // ✅ Added firstName
      lastName: user.lastName,    // ✅ Added lastName
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
};


interface SignUpReqProp{ 
  body: { 
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
  },
}


interface SignInReqProp{ 
  body: { 
    email: string,
    password: string, 
  },
}


interface SignUpInResProp { 
  status: (arg0: number) => {
    json: { (arg0: { msg?: string, token?: string, firstName?: string, lastName?: string, }): any, },
  },
}

interface SignOutResProp { 
  status: (arg0: number) => { 
    json: { (arg0: { msg: string, }): any, },
  },
}



// ✅ POST /api/users/signup - Register a new user
router.post('/signup', async (req: SignUpReqProp, res: SignUpInResProp) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });

    console.log('--> tsx-backend.signup.info: '+ firstName + ' / ' + lastName + ' / ' + email + ' / ' + phoneNumber + ' / ' + password)

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Generate and send token with user info
    const token = generateToken(user);
    
    console.log('--> tsx-backend.signup.token: ' + token.substring(0, 10) + '...')

    return res.status(201).json({ token, firstName: user.firstName, lastName: user.lastName });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ POST /api/users/signin - Authenticate and log in a user
router.post('/signin', async (req: SignInReqProp, res: SignUpInResProp) => {
  const { email, password } = req.body;
  try {
    console.log('--> tsx-backend.signin.info: ' + email + ' / ' + password)

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate and send token with user info
    const token = generateToken(user);
    console.log('--> tsx-backend.signin.token: ' + token.substring(0, 10) + '...')
    return res.status(201).json({ token, firstName: user.firstName, lastName: user.lastName });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ GET /api/users/logout - Log out a user (optional, for frontend)
router.get('/logout', (req: any, res:SignOutResProp) => {
  return res.status(200).json({ msg: 'User logged out' });
});

module.exports = router;
