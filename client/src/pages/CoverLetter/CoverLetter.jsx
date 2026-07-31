import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Textarea from "../../components/ui/Textarea/Textarea";
import Container from "../../components/ui/Container";
import { generateCoverLetter } from "../../services/aiApi";

import "./CoverLetter.css";

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

function CoverLetter() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    jobDescription: "",
    experience: "",
  });

  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditingLetter, setIsEditingLetter] = useState(false);

  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedData = {
      jobTitle: formData.jobTitle.trim(),
      company: formData.company.trim(),
      jobDescription: formData.jobDescription.trim(),
      experience: formData.experience.trim(),
    };

    if (Object.values(trimmedData).some((value) => !value)) {
      setError(
        "Please complete all fields before generating your cover letter.",
      );
      return;
    }

    setError("");
    setIsCopied(false);
    setIsGenerating(true);

    try {
      const data = await generateCoverLetter(trimmedData);
      setCoverLetter(data.coverLetter);
      setIsEditingLetter(false);
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

      pdf.save(createPdfFileName(formData.company, formData.jobTitle));
    } catch {
      setError("Unable to download the PDF. Please try again.");
    }
  };

  const handleEditDetails = () => {
    setCoverLetter("");
    setError("");
    setIsCopied(false);
    setIsEditingLetter(false);
  };

  const handleToggleLetterEditing = () => {
    setIsEditingLetter((currentValue) => !currentValue);
    setError("");
    setIsCopied(false);
  };

  return (
    <main className="cover-letter-page">
      <Container>
        <section className="cover-letter-page__header">
          <div className="cover-letter-page__heading">
            <Sparkles size={28} aria-hidden="true" />

            <div>
              <h1 className="cover-letter-page__title">
                AI Cover Letter Generator
              </h1>

              <p className="cover-letter-page__subtitle">
                Create a personalized cover letter before adding or applying for
                a job.
              </p>
            </div>
          </div>
        </section>

        <section className="cover-letter-page__card">
          {!coverLetter ? (
            <form className="cover-letter-page__form" onSubmit={handleSubmit}>
              <div className="cover-letter-page__field-row">
                <Input
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="For example: Software Engineer"
                  disabled={isGenerating}
                  required
                />

                <Input
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="For example: Microsoft"
                  disabled={isGenerating}
                  required
                />
              </div>

              <Textarea
                label="Job Description"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Paste the complete job description here..."
                disabled={isGenerating}
                rows={9}
                required
              />

              <Textarea
                label="Your Relevant Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Describe your relevant skills, certifications, experience, and accomplishments..."
                disabled={isGenerating}
                rows={7}
                required
              />

              {error && (
                <p className="cover-letter-page__error" role="alert">
                  {error}
                </p>
              )}

              <div className="cover-letter-page__actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/dashboard")}
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
            <section className="cover-letter-page__result">
              <div className="cover-letter-page__result-header">
                <div>
                  <h2 className="cover-letter-page__result-title">
                    Your Cover Letter
                  </h2>

                  <p className="cover-letter-page__result-description">
                    {formData.jobTitle} at {formData.company}
                  </p>
                </div>
              </div>

              {isEditingLetter ? (
                <Textarea
                  label="Edit Cover Letter"
                  name="coverLetter"
                  value={coverLetter}
                  onChange={(event) => {
                    setCoverLetter(event.target.value);
                    setError("");
                    setIsCopied(false);
                  }}
                  rows={20}
                />
              ) : (
                <div className="cover-letter-page__letter">{coverLetter}</div>
              )}

              {error && (
                <p className="cover-letter-page__error" role="alert">
                  {error}
                </p>
              )}

              <div className="cover-letter-page__actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleEditDetails}
                >
                  Edit Information
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleToggleLetterEditing}
                >
                  {isEditingLetter ? "Finish Editing" : "Edit Cover Letter"}
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

                <Button type="button" onClick={() => navigate("/dashboard")}>
                  Done
                </Button>
              </div>
            </section>
          )}
        </section>
      </Container>
    </main>
  );
}

export default CoverLetter;
