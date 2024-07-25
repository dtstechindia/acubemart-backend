import multer from "multer";
import path from "path";

// Configure multer to use the /tmp directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use /tmp directory for temporary storage
    cb(null, "/tmp");
  },
  filename: (req, file, cb) => {
    // Use original file name
    cb(null, file.originalname);
  },
});

// Initialize multer with the disk storage configuration
export const upload = multer({ storage: storage });
