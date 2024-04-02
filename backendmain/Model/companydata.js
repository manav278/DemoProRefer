import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    Company_ID:{
        type:Number,
        require:true,
        unique:true
    },
    Company_Name:{
        type:String,
        require:true,
        unique:true
    }
});

const companyModel = mongoose.model('company-data', companySchema);
export default companyModel;