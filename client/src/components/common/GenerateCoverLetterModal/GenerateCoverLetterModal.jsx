import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Sparkles } from "lucide-react";

import { generateCoverLetter } from "../../../services/aiApi";
import { updateJob } from "../../../services/jobsApi";
import Button from "../../ui/Button/Button";
import CloseButton from "../../ui/CloseButton/CloseButton";
import Textarea from "../../ui/Textarea/Textarea";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";
import "./GenerateCoverLetterModal.css";

const normalizeTextForPdf = (text) => {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014\u2011]/g, "-")
    .replace(/\u00a0/g, " ");
};

const createPdfFileName = (company, jobTitle) => {
  const safeName = `${company}-${jobTitle}-cover-letter`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName || "cover-letter"}.pdf`;
};

function GenerateCoverLetterModal({ isOpen, onClose, job, onJobUpdated }) {
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyTimeoutRef = useRef(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setJobDescription(job?.jobDescription || "");
    setExperience("");
    setCoverLetter(job?.coverLetter?.content || "");
    setError("");
    setIsGenerating(false);
    setIsCopied(false);
  }, [isOpen, job?._id, job?.jobDescription, job?.coverLetter?.content]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (event) => {
      if (event.key === "Escape" && !isGenerating) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, isGenerating, onClose]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isGenerating) {
      onClose();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedJobDescription = jobDescription.trim();
    const trimmedExperience = experience.trim();

    if (!trimmedJobDescription || !trimmedExperience) {
      setError(
        "Please enter the job description and your relevant experience.",
      );
      return;
    }

    setError("");
    setIsCopied(false);
    setIsGenerating(true);

    try {
      const data = await generateCoverLetter({
        jobTitle: job.title,
        company: job.company,
        jobDescription: trimmedJobDescription,
        experience: trimmedExperience,
      });

      setCoverLetter(data.coverLetter);

      try {
        const updatedJob = await updateJob(job._id, {
          jobDescription: trimmedJobDescription,
          coverLetter: {
            content: data.coverLetter,
          },
        });

        onJobUpdated?.(updatedJob);
      } catch (saveError) {
        console.error("Failed to save generated cover letter:", saveError);

        setError(
          "Your cover letter was generated, but it could not be saved. You can still copy or download it.",
        );
      }
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to generate the cover letter. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) {
      return;
    }

    setError("");

    try {
      await navigator.clipboard.writeText(coverLetter);
      setIsCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the cover letter. Please select and copy it manually.",
      );
    }
  };

  const handleDownloadPdf = async () => {
    if (!coverLetter) {
      return;
    }

    setError("");

    try {
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter",
      });

      const margin = 54;
      const lineHeight = 16;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const textWidth = pageWidth - margin * 2;
      const normalizedLetter = normalizeTextForPdf(coverLetter);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      const lines = pdf.splitTextToSize(normalizedLetter, textWidth);

      let yPosition = margin;

      lines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      const fileName = createPdfFileName(job.company, job.title);

      pdf.save(fileName);
    } catch {
      setError("Unable to download the PDF. Please try again.");
    }
  };

  const handleEditDetails = () => {
    setCoverLetter("");
    setError("");
    setIsCopied(false);
  };

  if (!isOpen || !job) {
    return null;
  }

  return (
    <div
      className="generate-cover-letter-modal"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="generate-cover-letter-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="generate-cover-letter-title"
        aria-describedby="generate-cover-letter-description"
      >
        <CloseButton onClick={onClose} disabled={isGenerating} />

        <header className="generate-cover-letter-modal__header">
          <div className="generate-cover-letter-modal__heading">
            <Sparkles size={24} aria-hidden="true" />

            <h2
              id="generate-cover-letter-title"
              className="generate-cover-letter-modal__title"
            >
              Generate Cover Letter
            </h2>
          </div>

          <p
            id="generate-cover-letter-description"
            className="generate-cover-letter-modal__description"
          >
            Create a personalized cover letter for <strong>{job.title}</strong>{" "}
            at <strong>{job.company}</strong>.
          </p>
        </header>

        {!coverLetter ? (
          <form
            className="generate-cover-letter-modal__form"
            onSubmit={handleSubmit}
          >
            <Textarea
              label="Job Description"
              name="cover-letter-job-description"
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setError("");
              }}
              placeholder="Paste the complete job description here..."
              disabled={isGenerating}
              rows={8}
            />

            <Textarea
              label="Your Relevant Experience"
              name="cover-letter-experience"
              value={experience}
              onChange={(event) => {
                setExperience(event.target.value);
                setError("");
              }}
              placeholder="Describe your relevant skills, experience, certifications, and accomplishments..."
              disabled={isGenerating}
              rows={7}
            />

            {error && (
              <p className="generate-cover-letter-modal__error" role="alert">
                {error}
              </p>
            )}

            <div className="generate-cover-letter-modal__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isGenerating}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                isLoading={isGenerating}
                loadingText="Generating..."
              >
                <Sparkles size={17} aria-hidden="true" />
                Generate Cover Letter
              </Button>
            </div>
          </form>
        ) : (
          <section className="generate-cover-letter-modal__result">
            <h3 className="generate-cover-letter-modal__result-title">
              Your Cover Letter
            </h3>

            <div className="generate-cover-letter-modal__letter">
              {coverLetter}
            </div>

            {error && (
              <p className="generate-cover-letter-modal__error" role="alert">
                {error}
              </p>
            )}

            <div className="generate-cover-letter-modal__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleEditDetails}
              >
                Edit Details
              </Button>

              <Button type="button" variant="secondary" onClick={handleCopy}>
                {isCopied ? (
                  <>
                    <Check size={17} aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={17} aria-hidden="true" />
                    Copy
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleDownloadPdf}
              >
                <Download size={17} aria-hidden="true" />
                Download PDF
              </Button>

              <Button type="button" onClick={onClose}>
                Done
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default GenerateCoverLetterModal;
