import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Cart from "../models/cart.model.js";

/* Add New Product */
const addToCart = async (req, res, next) => {
  const { userId, productId, variantId, quantity } = req.body;
  if (!userId) return next(apiErrorHandler(400, "User not found"));

  if (!productId || !quantity || quantity < 1)
    return next(apiErrorHandler(400, "Please Add Products"));

  try {
    /* Check if Cart Already Exists */
    const iscart = await Cart.findOne({ userId });
    if (iscart) {
      const existingProduct = iscart.products.find(
        (product) =>
          product.productId.toString() === productId &&
          (product.variantId?.toString() || "") === (variantId || "")
      );
      if (existingProduct) {
        existingProduct.quantity += Number(quantity);
        await iscart.save();
        return res.status(201).json({
          success: true,
          data: iscart,
          message: "Product quantity updated",
        });
      }
      iscart.products = [...iscart.products, { productId, variantId, quantity }];
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
      products: [{ productId, variantId, quantity }],
    });
    //console.log(cart);
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
        },
        {
          path: "variants",
          model: "Variant",
          populate: {
            path: "image",
            model: "Image",
          },
        }
      ],
    });
    //console.log(cart);
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
        const selectedVariant = product.variantId
          ? product.productId.variants?.find(
              (variant) => variant._id.toString() === product.variantId.toString()
            )
          : null;

        return {
          ...product.productId._doc,
          ...(selectedVariant
            ? {
                name: selectedVariant.name,
                price: selectedVariant.mrp,
                sp: selectedVariant.sp,
                stock: selectedVariant.stock,
                image:
                  selectedVariant.image?.length > 0
                    ? selectedVariant.image
                    : product.productId.image,
              }
            : {}),
          quantity: product.quantity,
          variantId: product.variantId?.toString(),
          image:
            selectedVariant?.image?.length > 0
              ? selectedVariant.image
              : product.productId.image,
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
  const { userId, productId, variantId, quantity } = req.body;
  if (!userId || !productId || !quantity)
    return next(apiErrorHandler(400, "Please provide all fields"));

  try {
    const cart = await Cart.findOneAndUpdate(
      {
        userId,
        products: {
          $elemMatch: {
            productId,
            variantId: variantId || { $exists: false },
          },
        },
      },
      {
        $set: {
          "products.$[item].quantity": quantity,
        },
      },
      {
        arrayFilters: [
          {
            "item.productId": productId,
            "item.variantId": variantId || { $exists: false },
          },
        ],
        new: true,
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
  const { userId, productId, variantId } = req.body;
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
            variantId: variantId || { $exists: false },
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
  const userId = req.body.userId || req.query.userId;
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
