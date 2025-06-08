import Product from "../../../DB/model/product.model.js";
import Category from "../../../DB/model/category.model.js";
import SubCategory from "../../../DB/model/subCategories.model.js";
import { cloud } from "../../../utilis/multer/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      longdescription,
      shortdescription,
      price,
      categoryName,
      subcategoryName,
      stock,
      ratingAvg,
      vendor
    } = req.body;

    // Validate required fields
    if (!name || !price || !categoryName || !subcategoryName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find category and subcategory by name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = await SubCategory.findOne({ name: subcategoryName });
    if (!subCategory) {
      return res.status(400).json({ message: "Invalid Subcategory name" });
    }

    // Check if product already exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // Upload imageCover to Cloudinary
    let imageCover = null;
    if (req.files?.imageCover?.length) {
      const uploaded = await cloud.uploader.upload(req.files.imageCover[0].path);
      imageCover = uploaded.secure_url;
    }

    // Upload multiple images to Cloudinary
    const images = [];
    if (req.files?.images?.length) {
      for (const file of req.files.images) {
        const uploaded = await cloud.uploader.upload(file.path);
        images.push(uploaded.secure_url);
      }
    }

    // Create product with category/subcategory IDs and names
    const product = new Product({
      name,
      longdescription,
      shortdescription,
      price,
      category: {
        _id: category._id,
        name: category.name
      },
      subCategory: {
        _id: subCategory._id,
        name: subCategory.name
      },
      stock,
      ratingAvg,
      imageCover,
      images,
      vendor
    });

    await product.save();

    return res.status(201).json({ product });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};



export const getProduct = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");

    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runvalidators:true
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductByCategoryId = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const subCategories = await SubCategory.find({ categoryid: id });

    const subCategoryWithProducts = await Promise.all(
      subCategories.map(async (subCategory) => {
        const products = await Product.find({ subCategory: subCategory._id })
          .populate("category", "name")
          .populate("subCategory", "name");

        return {
          subCategoryId: subCategory._id,
          subCategoryName: subCategory.name,
          products,
        };
      })
    );

    const result = {
      categoryId: category._id,
      categoryName: category.name,
      subCategories: subCategoryWithProducts,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allProducts = await Product.find();

    res.status(200).json( allProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};