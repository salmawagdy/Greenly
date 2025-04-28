import Product from "../../../DB/model/product.model.js";
import Category from "../../../DB/model/category.model.js"
import SubCategory from "../../../DB/model/subCategories.model.js"


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      longdescription,
      shortdescription,
      price,
      categoryid,
      subcategoryid,
      stock,
    } = req.body

    const imageCover = req.files?.imageCover?.[0]?.path || null
    const images = req.files?.images?.map(file => file.path) || []

    if (!name || !price || !categoryid || !subcategoryid) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const categoryExists = await Category.findById(categoryid)
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const subCategoryExists = await SubCategory.findById(subcategoryid)
    if (!subCategoryExists) {
      return res.status(400).json({ message: 'Invalid Subcategory ID' })
    }

    const productExists = await Product.findOne({ name })
    if (productExists) {
      return res.status(400).json({ message: 'Product already exists' })
    }

    const product = new Product({
      name,
      longdescription,
      shortdescription,
      price,
      category: categoryid,
      subCategory: subcategoryid,
      stock,
      imageCover,
      images,
    })

    await product.save()

    return res.status(201).json({ message: 'Product created successfully', product })

  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}


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

    const subCategoryWithProducts = await Promise.all(subCategories.map(async (subCategory) => {
      const products = await Product.find({ subCategory: subCategory._id })
        .populate('category', 'name')
        .populate('subCategory', 'name');

      return {
        subCategoryId: subCategory._id,
        subCategoryName: subCategory.name,
        products
      };
    }));

    const result = {
      categoryId: category._id,
      categoryName: category.name,
      subCategories: subCategoryWithProducts
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
