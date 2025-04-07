export {}
// Mongoose user model
// backend/models/User.js
import mongoose, { Schema, model, connect, ObjectId } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  _id: ObjectId;
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber?: string,
  password: string,
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  password: { type: String, required: true },
});

// 3. Create a Model.
export const User = model<IUser>('User', userSchema);

connect(process.env.MONGO_URI as string)

// 4. define test
// async function test() {
//   // 5. Connect to MongoDB
//   await connect('mongodb://127.0.0.1:27017/test');

//   const user = new User({
//     firstName: 'Nathan',
//     lastName: 'Gui',
//     email: 'nathan@gui.com',
//     phoneNumber: '1234567890',
//     password: 'Password_1#',
//   });
//   await user.save();
//   console.log(user.email);
// }

// 3. calling test.
// test().catch(err => console.log(err));
