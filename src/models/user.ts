import mongoose from 'mongoose';

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    passwordHashed: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    completedLessons: [String],
    completedCourses: [String],
});

export default mongoose.model("User", UserSchema);

