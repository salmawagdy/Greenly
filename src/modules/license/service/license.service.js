import userModel, { roleTypes } from "../../../DB/model/userModel.js";

import LicenseModel from "../../../DB/model/license.model.js";
import mongoose from 'mongoose';
import { emailEvent } from "../../../utilis/events/email.event.js";

import moment from 'moment'; 
import { getDownloadUrl } from "../../../utilis/multer/downloadUrl.js";

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

    const rawNationalId = req.files?.nationalId?.[0];
    const rawDocuments = req.files?.documents || [];

    if (!rawNationalId || rawDocuments.length === 0) {
      return res.status(400).json({ message: 'National ID and at least one document are required' });
    }

    // Keep nationalId image path directly
    const nationalId = rawNationalId.path;

    // Convert PDF files to download URLs, others use path directly
    const documents = rawDocuments.map(file => {
      if (file.mimetype === 'application/pdf') {
        // Extract Cloudinary public ID (remove file extension from path)
        const publicId = file.filename; // Assumes Cloudinary uploaded with `public_id` = filename
        const downloadUrl = getDownloadUrl(publicId, file.originalname);
        return downloadUrl;
      } else {
        return file.path;
      }
    });

    const userId = req.user._id;
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const existingRequest = await LicenseModel.findOne({
      appliedBy: userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You can only apply once per month' });
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
      appliedBy: userId,
    });

    await newRequest.save();

    return res.status(201).json({
      message: 'License application submitted successfully',
      data: newRequest
    });

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

    if (!mongoose.Types.ObjectId.isValid(licenseId)) {
      return res.status(400).json({ message: 'Invalid license ID format' });
    }

    const updatedLicense = await LicenseModel.findByIdAndUpdate(
      licenseId,
      { status },
      { new: true }
    ).populate('appliedBy', 'email userName');

    if (!updatedLicense) {
      return res.status(404).json({ message: 'License request not found' });
    }

    emailEvent.emit('updateStatus', {
      email: updatedLicense.appliedBy.email,
      userName: updatedLicense.appliedBy.userName,
      status: updatedLicense.status,
    });

    return res.status(200).json({
      message: 'License status updated and email sent',
      data: updatedLicense,
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }};



export const getLicenseById = async (req, res) => {
  try {
    const { licenseId } = req.params;

    const license = await LicenseModel.findById(licenseId);

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    return res.status(200).json(license);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getLicensesByStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status field' });
    }

    const licenses = await LicenseModel.find({ status }).populate('appliedBy', 'email userName');

    return res.status(200).json(
    licenses
    );
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
