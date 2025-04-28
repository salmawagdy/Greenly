import mongoose, { Schema, model } from "mongoose";
const { Types } = mongoose;

const LicenseSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    address: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    requiredArea: {
        type: String,
        required: true,
    },
    requiredLocation: {
        type: String,
        required: true,
    },
    plantsType: {
        type: String,
        required: true,
    },
    numberOfColonies: {
        type: String,
        required: true,
    },
    workPlan: {
        type: String,
        required: true,
    },
    nationalId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    documents: {
        type: [String],
        required: true,
        validate: {
        validator: function (arr) {
            return Array.isArray(arr) && arr.length > 0;
        },
        message: "At least one document is required",
        },
    },
    appliedBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    
},
{ timestamps: true }
);

const LicenseModel = mongoose.models.License || model("License", LicenseSchema);
export default LicenseModel;
