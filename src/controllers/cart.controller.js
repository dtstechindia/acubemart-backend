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
    const cart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      populate: {
        path: "image",
        model: "Image",
      },
    });
    if (!cart) return next(apiErrorHandler(404, "No Cart Found"));

    // Transform the products array
    const transformedProducts = cart.products
      .map((product) => {
        if (!product.productId) return null;
        return {
          _id: product._id,
          quantity: product.quantity,
          ...product.productId._doc,
          image: product.productId.image.map((img) => img.url),
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

export { addToCart, getCartProducts, removeCartProduct };
