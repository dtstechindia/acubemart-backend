import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";
import { google } from "googleapis";
import { createPrivateKey } from "node:crypto";
import Product from "../models/product.model.js";

const DEFAULT_SHEET_GID = "79216810";

const normalizePrivateKey = () => {
    const configuredKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64
        ? Buffer.from(process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64.trim(), "base64").toString("utf8")
        : process.env.GOOGLE_SHEETS_PRIVATE_KEY;

    if (!configuredKey) {
        throw apiErrorHandler(500, "Missing Google Sheets configuration: GOOGLE_SHEETS_PRIVATE_KEY");
    }

    let privateKey = configuredKey.trim();

    if (
        (privateKey.startsWith('"') && privateKey.endsWith('"'))
        || (privateKey.startsWith("'") && privateKey.endsWith("'"))
    ) {
        privateKey = privateKey.slice(1, -1);
    }

    privateKey = privateKey
        .replace(/\\+r\\+n/g, "\n")
        .replace(/\\+n/g, "\n")
        .replace(/\r\n/g, "\n");

    if (!privateKey.includes("-----BEGIN") && /^[A-Za-z0-9+/=\s]+$/.test(privateKey)) {
        const decodedKey = Buffer.from(privateKey.replace(/\s/g, ""), "base64").toString("utf8");
        if (decodedKey.includes("-----BEGIN")) privateKey = decodedKey;
    }

    const pemMatch = privateKey.match(
        /-----BEGIN ([A-Z ]*PRIVATE KEY)-----([\s\S]*?)-----END \1-----/
    );

    if (!pemMatch) {
        throw apiErrorHandler(
            500,
            "Google Sheets private key is not a valid PEM key. Configure it with escaped newlines or as GOOGLE_SHEETS_PRIVATE_KEY_BASE64."
        );
    }

    const pemBody = pemMatch[2].replace(/\s/g, "");
    privateKey = [
        `-----BEGIN ${pemMatch[1]}-----`,
        ...(pemBody.match(/.{1,64}/g) || []),
        `-----END ${pemMatch[1]}-----`,
        "",
    ].join("\n");

    try {
        createPrivateKey(privateKey);
    } catch {
        throw apiErrorHandler(
            500,
            "Google Sheets private key could not be decoded. Update the deployed service-account key and try again."
        );
    }

    return privateKey;
};

const createSheetsClient = () => {
    const requiredEnvironmentVariables = [
        "GOOGLE_SHEETS_SPREADSHEET_ID",
        "GOOGLE_SHEETS_PROJECT_ID",
        "GOOGLE_SHEETS_CLIENT_EMAIL",
    ];
    const missingVariables = requiredEnvironmentVariables.filter((name) => !process.env[name]);

    if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY && !process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64) {
        missingVariables.push("GOOGLE_SHEETS_PRIVATE_KEY");
    }

    if (missingVariables.length > 0) {
        throw apiErrorHandler(500, `Missing Google Sheets configuration: ${missingVariables.join(", ")}`);
    }

    const privateKey = normalizePrivateKey();
    const auth = new google.auth.GoogleAuth({
        credentials: {
            type: "service_account",
            project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
            private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
            private_key: privateKey,
            client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: process.env.GOOGLE_SHEETS_CLIENT_X509_CERT_URL,
            universe_domain: "googleapis.com",
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return {
        auth,
        sheets: google.sheets({ version: "v4", auth }),
        spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    };
};

const getSheetTitle = async (sheets, spreadsheetId) => {
    const metadata = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: "sheets.properties(sheetId,title)",
    });
    const sheetGid = Number(process.env.GOOGLE_SHEETS_SHEET_GID || DEFAULT_SHEET_GID);
    const sheet = metadata.data.sheets?.find(({ properties }) => properties?.sheetId === sheetGid);

    if (!sheet?.properties?.title) {
        throw apiErrorHandler(404, `Google Sheet tab with gid ${sheetGid} was not found`);
    }

    return `'${sheet.properties.title.replace(/'/g, "''")}'`;
};

const getPublishedProducts = () => Product.find({ status: "published" })
    .sort({ createdAt: -1 })
    .populate({ path: "brand", select: "name _id" })
    .populate({ path: "featuredImage", select: "url _id" })
    .lean();

const stripHtml = (value = "") => value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toMerchantRows = (products) => products.map((product) => {
    const regularPrice = Number(product.price) || 0;
    const sellingPrice = Number(product.sp) || regularPrice;

    return [
        product._id.toString(),
        product.name,
        stripHtml(product.description),
        Number(product.stock) > 0 ? "in_stock" : "out_of_stock",
        "",
        "",
        `https://acubemart.in/product/${product.slug}`,
        "",
        product.featuredImage?.url || "",
        regularPrice ? `${regularPrice.toFixed(2)} INR` : "",
        sellingPrice && sellingPrice < regularPrice ? `${sellingPrice.toFixed(2)} INR` : "",
        "",
        "no",
        "",
        "",
        product.brand?.[0]?.name || "Acube Mart",
    ];
});

const replacePublishedProductsInGoogleSheet = async () => {
    const products = await getPublishedProducts();
    if (products.length === 0) throw apiErrorHandler(404, "No published products found");

    const { auth, sheets, spreadsheetId } = createSheetsClient();
    const sheetTitle = await getSheetTitle(sheets, spreadsheetId);
    const productValues = toMerchantRows(products);

    const response = await sheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `${sheetTitle}!A3:P${productValues.length + 2}`,
        valueInputOption: "RAW",
        resource: { values: productValues },
    });

    await sheets.spreadsheets.values.clear({
        auth,
        spreadsheetId,
        range: `${sheetTitle}!A${productValues.length + 3}:P`,
    });

    return {
        updatedRows: response.data.updatedRows || productValues.length,
        sheetGid: Number(process.env.GOOGLE_SHEETS_SHEET_GID || DEFAULT_SHEET_GID),
    };
};

const addAllPublishedProductsToGoogleSheet = async (req, res, next) => {
    try {
        const data = await replacePublishedProductsInGoogleSheet();
        return res.status(200).json({
            success: true,
            message: `${data.updatedRows} published products synced to the Google Sheet`,
            data,
        });
    } catch (error) {
        next(error);
    }
};

const updateAllPublishedProductsInGoogleSheet = async (req, res, next) => {
    try {
        const data = await replacePublishedProductsInGoogleSheet();
        return res.status(200).json({
            success: true,
            message: `${data.updatedRows} published products synced to the Google Sheet`,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export {
    addAllPublishedProductsToGoogleSheet,
    updateAllPublishedProductsInGoogleSheet,
};
