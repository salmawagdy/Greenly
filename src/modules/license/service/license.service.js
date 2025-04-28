import userModel, { roleTypes } from "../../../DB/model/userModel.js";
import LicenseModel from "../../../DB/model/license.model.js";


export const requestLicense = async (req, res) => {
    try {
    const {
        fullName,
        phoneNumber,
        email,
        address,
        experience,
        requiredArea,
        requiredLocation,
        plantsType,
        numberOfColonies,
        workPlan,
    } = req.body;

    const nationalId = req.files?.nationalId?.[0]?.path;
    const documents = req.files?.documents?.map(file => file.path) || [];

    if (!nationalId || documents.length === 0) {
        return res.status(400).json({ message: 'National ID and at least one document are required' });
    }

    const newRequest = new LicenseModel({
        fullName,
        phoneNumber,
        email,
        address,
        experience,
        requiredArea,
        requiredLocation,
        plantsType,
        numberOfColonies,
        workPlan,
        nationalId,
        documents,
        appliedBy: req.user._id,
    });

    await newRequest.save();

    return res.status(201).json({ message: 'License application submitted successfully', data: newRequest });

    } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const getAllRequests = async (req, res) => {
    try {
    const requests = await LicenseModel.find();
    if (requests.length === 0) {
        return res.status(404).json({ message: "No requests found" });
    }
    return res.status(200).json(requests);
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
    }
};

export const getUserRequests = async (req, res) => {
    try {
    const { userId } = req.params;
    const requests = await LicenseModel.find({ appliedBy: userId });
    if (!requests.length) {
        return res.status(404).json({ message: "No requests found for this user" });
    }
    return res.status(200).json(requests);
    } catch (error) {
    return res.status(500).json({ message: error.message });
    }
};


export const updateLicenseStatus = async (req, res) => {
    try {
        const { licenseId } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Status must be either approved or rejected.' });
        }

        const updatedLicense = await LicenseModel.findByIdAndUpdate(
            licenseId,
            { status },
            { new: true }
        );

        if (!updatedLicense) {
            return res.status(404).json({ message: 'License request not found' });
        }

        return res.status(200).json({ message: "License request status updated successfully", data: updatedLicense });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
