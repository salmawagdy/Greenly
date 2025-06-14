import addressesModel from "../../../DB/model/addresses.model.js";
import mongoose from "mongoose";

// ✅ Add Address
export const addAddress = async (req, res) => {
  const {
    city,
    state,
    street,
    building,
    floor,
    apartment,
    postalcode,
    phone,
    namee,
    isDefault,
  } = req.body;
  const userId = req.user._id;

  try {
    let userAddress = await addressesModel.findOne({ userId });

    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      city,
      state,
      street,
      building,
      floor,
      apartment,
      postalcode,
      phone,
      namee,
      isDefault,
    };

    if (!userAddress) {
      userAddress = await addressesModel.create({
        userId,
        addresses: [newAddress],
      });
    } else {
      if (isDefault) {
        userAddress.addresses.forEach((addr) => (addr.isDefault = false));
      }
      userAddress.addresses.push(newAddress);
      await userAddress.save();
    }

    res.status(200).json(userAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Address by ID
export const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const userAddress = await addressesModel.findOne({ userId });
    if (!userAddress) {
      return res.status(404).json({ message: "Address list not found" });
    }

    const initialLength = userAddress.addresses.length;
    userAddress.addresses = userAddress.addresses.filter(
      (address) => address._id.toString() !== id
    );

    if (userAddress.addresses.length === initialLength) {
      return res.status(404).json({ message: "Address not found" });
    }

    await userAddress.save();
    res.status(200).json(userAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Addresses
export const getAddresses = async (req, res) => {
  try {
    const userAddress = await addressesModel.findOne({ userId: req.user._id });
    if (!userAddress) return res.status(200).json({ addresses: [] });

    res.status(200).json(userAddress.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Default Address
export const getDefaultAddress = async (req, res) => {
  try {
    const userAddress = await addressesModel.findOne({ userId: req.user._id });
    if (!userAddress)
      return res.status(404).json({ message: "No addresses found" });

    const defaultAddr = userAddress.addresses.find((addr) => addr.isDefault);
    if (!defaultAddr) {
      return res.status(404).json({ message: "No default address found" });
    }

    res.status(200).json(defaultAddr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;

  try {
    const userAddress = await addressesModel.findOne({ userId });
    if (!userAddress)
      return res.status(404).json({ message: "User address not found" });
    console.log("UserID:", userId);
    console.log("AddressID from req:", addressId);
    console.log(
      "Available addresses:",
      userAddress.addresses.map((a) => a._id.toString())
    );
    let found = false;

    // Loop through addresses and update default
    userAddress.addresses = userAddress.addresses.map((addr) => {
      if (addr._id.toString() === addressId) {
        found = true;
        return { ...addr.toObject(), isDefault: true };
      } else {
        return { ...addr.toObject(), isDefault: false };
      }
    });

    if (!found) return res.status(404).json({ message: "Address not found" });

    await userAddress.save();

    res.status(200).json({
      message: "Default address updated successfully",
      addresses: userAddress.addresses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
