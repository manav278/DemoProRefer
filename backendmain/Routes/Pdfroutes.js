import express from "express";
import multer from "multer";
import File from "../Model/File.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { getUserId } from "./Loginroutes.js";

// Handle file uploads
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    let userID = getUserId();
    // console.log(userID);
    const filter = { User_ID: userID };

    // Update specificField if document exists, or create a new document with specificField if it doesn't exist
    const update = { data: buffer };

    // Options: return the updated document if new is true, and upsert is true to create the document if it doesn't exist
    const options = { new: true, upsert: true };

    // Perform the update operation
    const result = await File.findOneAndUpdate(filter, update, options);

    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getPdf", async (req, res) => {
  try {
    let userID = getUserId();
    const file = await File.findOne({ User_ID: userID });

    if (file) {
      // Save the file to the server temporarily (optional)
      //   fs.writeFileSync(userID, file.data);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": file.data.length,
      });

      // Send the file to the client
      res.send(file.data);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getApplicantPdf/:applicantId", async (req, res) => {
  try {
    let user = req.params.applicantId;
    const file = await File.findOne({ User_ID: Number(user) });

    if (file) {
      // Save the file to the server temporarily (optional)
      //   fs.writeFileSync(userID, file.data);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": file.data.length,
      });

      // Send the file to the client
      res.send(file.data);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
