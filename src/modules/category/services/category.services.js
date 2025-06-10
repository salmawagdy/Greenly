import Category from "../../../DB/model/category.model.js";
import subcategory from "../../../DB/model/subCategories.model.js";
import Product from "../../../DB/model/product.model.js";
import mongoose from "mongoose"

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description});
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id); 

    const deletedCategory = await Category.findByIdAndDelete(objectId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const relatedSubCategories = await subcategory.find({ categoryid: objectId });
    const subCategoryIds = relatedSubCategories.map(sub => sub._id);
    await subcategory.deleteMany({ categoryid: objectId });

    await Product.deleteMany({
      $or: [
        { "category._id": objectId },
        { "subCategory._id": { $in: subCategoryIds } }
      ]
    });

    const categories = await Category.find();
    res.status(200).json(categories);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};