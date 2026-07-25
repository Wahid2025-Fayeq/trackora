const Job = require("../models/job");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");

const https = require("https");
const path = require("path");

const uploadDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a document to upload.",
      });
    }

    const allowedDocumentTypes = [
      "Resume",
      "Cover Letter",
      "Job Description",
      "Other",
    ];

    if (!allowedDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        message: "Please select a valid document type.",
      });
    }

    const job = await Job.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job application not found.",
      });
    }

    const resourceType =
      req.file.mimetype === "application/pdf" ? "image" : "raw";

    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: `trackora/documents/${req.user.id}`,
      resourceType,
    });

    const newDocument = {
      documentType,
      originalName: req.file.originalname,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
    };

    job.documents.push(newDocument);
    await job.save();

    const uploadedDocument = job.documents[job.documents.length - 1];

    return res.status(201).json({
      message: "Document uploaded successfully.",
      document: uploadedDocument,
    });
  } catch (error) {
    next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job application not found.",
      });
    }

    return res.status(200).json({
      documents: job.documents,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { id, documentId } = req.params;

    const job = await Job.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job application not found.",
      });
    }

    const document = job.documents.id(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    await cloudinary.uploader.destroy(document.publicId, {
      resource_type: document.resourceType,
    });

    document.deleteOne();
    await job.save();

    return res.status(200).json({
      message: "Document deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const downloadDocument = async (req, res, next) => {
  try {
    const { id, documentId } = req.params;

    const job = await Job.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job application not found.",
      });
    }

    const document = job.documents.id(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    const safeFilename = path
      .basename(document.originalName)
      .replace(/["\r\n]/g, "");

    https
      .get(document.url, (cloudinaryResponse) => {
        if (
          cloudinaryResponse.statusCode < 200 ||
          cloudinaryResponse.statusCode >= 300
        ) {
          res.status(502).json({
            message: "Unable to download the document.",
          });

          cloudinaryResponse.resume();
          return;
        }

        const contentType = cloudinaryResponse.headers["content-type"];

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(
            safeFilename,
          )}`,
        );

        if (contentType) {
          res.setHeader("Content-Type", contentType);
        } else {
          res.setHeader("Content-Type", "application/octet-stream");
        }

        cloudinaryResponse.pipe(res);
      })
      .on("error", (error) => {
        if (!res.headersSent) {
          next(error);
          return;
        }

        res.destroy(error);
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
  downloadDocument,
};
