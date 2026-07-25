const express = require("express");

const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobsController");

const {
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument,
} = require("../controllers/documentsController");

const auth = require("../middleware/auth");
const uploadDocumentMiddleware = require("../middleware/uploadDocument");

const router = express.Router();

router.use(auth);

router.get("/", getJobs);
router.post("/", createJob);

router.get("/:id/documents", getDocuments);

router.post(
  "/:id/documents",
  uploadDocumentMiddleware.single("document"),
  uploadDocument,
);

router.get("/:id/documents/:documentId/download", downloadDocument);

router.delete("/:id/documents/:documentId", deleteDocument);

router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
