import { apiErrorHandler } from '../middlewares/errorhandler.middleware.js';
import { google } from "googleapis";
import Product from '../models/product.model.js';


const sheets = google.sheets({ version: "v4", auth: process.env.GOOGLE_SHEETS_API_KEY });
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
    //keyFile: "./service-account.json",
    credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
        private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.GOOGLE_SHEETS_CLIENT_X509_CERT_URL,    
        universe_domain: "googleapis.com"
    },
    scopes: "https://www.googleapis.com/auth/spreadsheets",
})



const addAllPublishedProductsToGoogleSheet = async (req, res, next) => {
    try {
        const allProducts = await Product.find({ status: "published" })
        .sort({ createdAt: -1 })
        .populate({ path: "type", select: "name _id" })
        .populate({ path: "category", select: "name description isActive _id" })
        .populate({ path: "element", select: "name description _id" })
        .populate({ path: "brand", select: "name logo description _id" })
        .populate({ path: "model", select: "name description _id" })
        .populate({
            path: "image",
            select: "url isFeatured _id",
            strictPopulate: false,
        })
        .populate({
            path: "attributes",
            select: "name value _id",
            strictPopulate: false,
        })
        .populate({
            path: "variants",
            select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
            strictPopulate: false,
            populate: {
            path: "image",
            select: "url _id",
            strictPopulate: false,
            },
        })
        .populate({
            path: "featuredImage",
            select: "url _id",
            strictPopulate: false,
        });
        if (!allProducts) return next(apiErrorHandler(404, "No Products Found"));
    
       const productValues = allProducts.map((product) => {
           return [
               product._id,
               product.name,
               product.description,
               'in_stock',
               '',
               '',
               `https://www.acubemart.in/product/${product?.slug}` || '',
               '',
               product.featuredImage?.url || '',
               `${product?.price || ''} INR`,
               `${product?.sp || ''} INR`,
               '',
               'no',
               '',
               '',
               product.brand?.name || 'acube mart',
           ]
       })
        const response = await sheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "sheet1!A3:P",
            valueInputOption: 'RAW',
            resource: {
                values: productValues
            },
        });
        
        return res.status(200).json({
            success: true,
            message: "Products added to Google Sheet Successfully",
            data: {response, productValues, allProducts},
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

/* const updateAllPublishedProductsInGoogleSheet = async (req, res, next) => {
    try {
        // Logic to update products in Google Sheet
    } catch (error) {
        console.log(error);
        return next(error);
    }
} */

export {
    addAllPublishedProductsToGoogleSheet,
   // updateAllPublishedProductsInGoogleSheet,
    
}