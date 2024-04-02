import mongoose, { mongo } from 'mongoose';

const fileSchema = new mongoose.Schema({
    User_ID: Number,
    data: Buffer,
});

const File = mongoose.model('Resume', fileSchema);
export default File;