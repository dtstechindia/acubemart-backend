import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Cart from "../models/cart.model.js";

/* Add New Product */
const addToCart = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;
  if (!userId) return next(apiErrorHandler(400, "User not found"));

  if (!productId || !quantity || quantity < 1)
    return next(apiErrorHandler(400, "Please Add Products"));

  try {
    /* Check if Cart Already Exists */
    const iscart = await Cart.findOne({ userId });
    if (iscart) {
      if (iscart.products.find((p) => p.productId.toString() === productId)) {
        return res.status(201).json({
          success: true,
          message: "Product Already Exists in Cart",
        });
      }
      iscart.products = [...iscart.products, { productId, quantity }];
      await iscart.save();
      return res.status(201).json({
        success: true,
        data: iscart,
        message: "Product Added to Cart Successfully",
      });
    }

    /* Create New Cart */
    const cart = await Cart.create({
      userId,
      products: [{ productId, quantity }],
    });

    return res.status(201).json({
      success: true,
      message: "Product Added to Cart Successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

/* Get Cart Products */
const getCartProducts = async (req, res, next) => {
  const { userId } = req.query;
  if (!userId) return next(apiErrorHandler(400, "UserId is required"));

  try {
    // Populate both image and brand fields
    const cart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      populate: [
        {
          path: "image",
          model: "Image",
        },
        {
          path: "brand",
          model: "Brand", // Ensure Brand model is correctly referenced
        },
        {
          path: "featuredImage"
        }
      ],
    });

    if (!cart) return res.status(404).json({ success: false, message: "Cart Not Found" });

    // Transform the products array
    const transformedProducts = cart.products
      .map((product) => {
        if (!product.productId) return null;

        // Ensure brand is an array; map over it if so
        const brands = Array.isArray(product.productId.brand)
          ? product.productId.brand.map((brand) => ({
              _id: brand._id,
              name: brand.name,
              // Include any other brand fields you need
            }))
          : [];

        return {
          _id: product._id,
          quantity: product.quantity,
          ...product.productId._doc,
          image: product.productId.image.map((img) => img.url),
          brand: brands,
        };
      })
      .filter((product) => product !== null); // Filter out any null products

    return res.status(200).json({
      success: true,
      message: "Cart Products Fetched Successfully",
      data: {
        ...cart._doc, // Spread other cart properties
        products: transformedProducts, // Replace products with transformedProducts
      },
    });
  } catch (error) {
    next(error);
  }
};

/* Update Cart Product Quantity by Product Id */
const updateCartProductQuantity = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || !quantity)
    return next(apiErrorHandler(400, "Please provide all fields"));

  try {
    const cart = await Cart.findOneAndUpdate(
      {
        userId,
        "products.productId": productId,
      },
      {
        $set: {
          "products.$.quantity": quantity,
        },
      }
    );

    if (!cart) return next(apiErrorHandler(404, "No Cart Found"));

    return res.status(200).json({
      success: true,
      message: "Product Quantity Updated Successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

/* Remove Cart Products */
const removeCartProduct = async (req, res, next) => {
  const { userId, productId } = req.body;
  if (!userId || !productId)
    return next(apiErrorHandler(400, "Please provide all fields"));

  try {
    const cart = await Cart.findOneAndUpdate(
      {
        userId,
      },
      {
        $pull: {
          products: {
            productId,
          },
        },
      }
    );

    if (!cart) return next(apiErrorHandler(404, "No Cart Found"));

    return res.status(200).json({
      success: true,
      message: "Product Removed Successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// clear cart
const clearCart = async (req, res, next) => {
  const { userId } = req.body;
  console.log("clearing cart", userId);
  if (!userId) return next(apiErrorHandler(400, "UserId is required"));
  try {
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) return next(apiErrorHandler(404, "No Cart Found"));
    return res.status(200).json({
      success: true,
      message: "Cart Cleared Successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export { addToCart, getCartProducts, removeCartProduct, clearCart, updateCartProductQuantity };
