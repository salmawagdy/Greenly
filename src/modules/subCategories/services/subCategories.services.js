import SubCategory from "../../../DB/model/subCategories.model.js";
import Category from "../../../DB/model/category.model.js";
import Product from "../../../DB/model/product.model.js";
import mongoose from 'mongoose'

export const createSubCategory = async (req, res) => {
  try {
    const { name, description, categoryid } = req.body;
    const category = await Category.findById(categoryid);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const newSubCategory = new SubCategory({
      name,
      description,
      categoryid: categoryid,
    });

    await newSubCategory.save();
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(400).json({
      message: "server error",
      error,
      msg: error.message,
      stack: error.stack,
    });
  }
};



export const getSubCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate(
      "categoryid",
      "name"
    );
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      "categoryid",
      "name"
    );

    if (!subCategory)
      return res.status(404).json({ message: "SubCategory not found" });

    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);

    const deletedSubCategory = await SubCategory.findByIdAndDelete(objectId);
    if (!deletedSubCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    await Product.deleteMany({ subCategory: objectId });

    const subCategories = await SubCategory.find();
    res.status(200).json(subCategories);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};