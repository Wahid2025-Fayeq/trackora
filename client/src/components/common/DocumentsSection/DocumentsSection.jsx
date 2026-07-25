import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ExternalLink, FileText, Trash2 } from "lucide-react";

import Button from "../../ui/Button/Button";
import Select from "../../ui/Select/Select";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";

import {
  deleteJobDocument,
  getJobDocuments,
  uploadJobDocument,
  downloadJobDocument,
} from "../../../services/jobsApi";

import "./DocumentsSection.css";

function DocumentsSection({ jobId }) {
  const [documentType, setDocumentType] = useState("Resume");
  const [selectedFile, setSelectedFile] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const loadDocuments = useCallback(async () => {
    if (!jobId) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const data = await getJobDocuments(jobId);
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message || "Unable to load documents.");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files?.[0] || null;

    setSelectedFile(file);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) {
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      await uploadJobDocument({
        jobId,
        document: selectedFile,
        documentType,
      });

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadDocuments();
    } catch (err) {
      setError(err.message || "Unable to upload the document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setDocumentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      await deleteJobDocument({
        jobId,
        documentId: documentToDelete._id,
      });

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (document) => document._id !== documentToDelete._id,
        ),
      );

      setDocumentToDelete(null);
    } catch (err) {
      setError(err.message || "Unable to delete the document.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (document) => {
    try {
      setError("");

      await downloadJobDocument({
        jobId,
        documentId: document._id,
        originalName: document.originalName,
      });
    } catch (err) {
      setError(err.message || "Unable to download the document.");
    }
  };

  return (
    <>
      <section className="documents-section">
        <div className="documents-section__header">
          <h3 className="documents-section__title">Application Documents</h3>

          <p className="documents-section__description">
            Upload your resume, cover letter, job description, or other
            documents related to this application.
          </p>
        </div>

        <div className="documents-section__upload">
          <div className="documents-section__field">
            <Select
              label="Document Type"
              name="documentType"
              value={documentType}
              onChange={handleDocumentTypeChange}
              disabled={isUploading}
              options={[
                { value: "Resume", label: "Resume" },
                {
                  value: "Cover Letter",
                  label: "Cover Letter",
                },
                {
                  value: "Job Description",
                  label: "Job Description",
                },
                { value: "Other", label: "Other" },
              ]}
            />
          </div>

          <div className="documents-section__field">
            <label className="documents-section__file-label" htmlFor="document">
              Select Document
            </label>

            <input
              ref={fileInputRef}
              className="documents-section__file-input"
              id="document"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleDocumentChange}
              disabled={isUploading}
            />

            <p className="documents-section__file-help">
              PDF, DOC, or DOCX. Maximum size: 10 MB.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            isLoading={isUploading}
          >
            Upload Document
          </Button>
        </div>

        {error && (
          <p className="documents-section__error" role="alert">
            {error}
          </p>
        )}

        <div className="documents-section__list">
          {isLoading && (
            <p className="documents-section__status">Loading documents...</p>
          )}

          {!isLoading && documents.length === 0 && !error && (
            <div className="documents-section__empty">
              <FileText size={28} aria-hidden="true" />

              <p>No documents uploaded yet.</p>
            </div>
          )}

          {!isLoading &&
            documents.map((document) => {
              const formattedUploadDate = document.uploadedAt
                ? new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(document.uploadedAt))
                : "";

              const extension = document.originalName
                .split(".")
                .pop()
                ?.toLowerCase();

              const canPreview = extension === "pdf";

              return (
                <article key={document._id} className="documents-section__item">
                  <div className="documents-section__document-icon">
                    <FileText size={21} aria-hidden="true" />
                  </div>

                  <div className="documents-section__document-details">
                    <p className="documents-section__document-name">
                      {document.originalName}
                    </p>

                    <div className="documents-section__document-meta">
                      <span className="documents-section__document-type">
                        {document.documentType}
                      </span>

                      {formattedUploadDate && (
                        <span className="documents-section__document-date">
                          Uploaded {formattedUploadDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="documents-section__actions">
                    {canPreview ? (
                      <a
                        className="documents-section__open-link"
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${document.originalName}`}
                      >
                        <ExternalLink size={16} aria-hidden="true" />
                        Open
                      </a>
                    ) : (
                      <button
                        className="documents-section__open-link"
                        type="button"
                        onClick={() => handleDownload(document)}
                        aria-label={`Download ${document.originalName}`}
                      >
                        <Download size={16} aria-hidden="true" />
                        Download
                      </button>
                    )}

                    <button
                      className="documents-section__delete-button"
                      type="button"
                      onClick={() => handleDeleteClick(document)}
                      disabled={isDeleting}
                      aria-label={`Delete ${document.originalName}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
        </div>
      </section>

      <DeleteConfirmationModal
        isOpen={Boolean(documentToDelete)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete document?"
        message={
          documentToDelete
            ? `Are you sure you want to delete "${documentToDelete.originalName}"? This action cannot be undone.`
            : ""
        }
        isDeleting={isDeleting}
      />
    </>
  );
}

export default DocumentsSection;
