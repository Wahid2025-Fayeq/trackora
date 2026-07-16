import { useEffect, useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input/Input";
import useAuth from "../../hooks/useAuth";

import "./Profile.css";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function Profile() {
  const { currentUser, updateProfile, uploadProfileAvatar } = useAuth();

  const fileInputRef = useRef(null);

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");

    if (!selectedFile) {
      setAvatarPreview(currentUser?.avatar || "");
    }
  }, [currentUser, selectedFile]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const initial = currentUser?.name?.charAt(0).toUpperCase() || "U";

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  const isNameValid = trimmedName.length >= 2 && trimmedName.length <= 30;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

  const hasChanges =
    trimmedName !== currentUser?.name || trimmedEmail !== currentUser?.email;

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, or WebP image");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be 5 MB or smaller");
      event.target.value = "";
      return;
    }

    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile || isUploadingAvatar) {
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const updatedUser = await uploadProfileAvatar(selectedFile);

      setSelectedFile(null);
      setAvatarPreview(updatedUser.avatar || "");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error(error.message || "Unable to upload profile photo");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarCancel = () => {
    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setSelectedFile(null);
    setAvatarPreview(currentUser?.avatar || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isNameValid || !isEmailValid || !hasChanges || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile({
        name: trimmedName,
        email: trimmedEmail,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Unable to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="profile">
      <Container>
        <section className="profile__card">
          <div className="profile__avatar-section">
            <div className="profile__avatar">
              {avatarPreview ? (
                <img
                  className="profile__avatar-image"
                  src={avatarPreview}
                  alt={`${currentUser?.name || "User"} profile`}
                />
              ) : (
                <span aria-hidden="true">{initial}</span>
              )}
            </div>

            <p className="profile__photo-label">Profile Photo</p>

            <input
              ref={fileInputRef}
              className="profile__file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
            />

            <Button
              type="button"
              variant="secondary"
              onClick={handleAvatarButtonClick}
              disabled={isUploadingAvatar}
            >
              <Camera size={16} aria-hidden="true" />
              {currentUser?.avatar ? "Change Photo" : "Choose Photo"}
            </Button>

            {selectedFile && (
              <div className="profile__photo-actions">
                <Button
                  type="button"
                  onClick={handleAvatarUpload}
                  isLoading={isUploadingAvatar}
                  loadingText="Uploading..."
                  disabled={isUploadingAvatar}
                >
                  <Upload size={16} aria-hidden="true" />
                  Upload Photo
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAvatarCancel}
                  disabled={isUploadingAvatar}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="profile__content">
            <p className="profile__eyebrow">Account Profile</p>

            <h1 className="profile__title">Manage your account</h1>

            <p className="profile__subtitle">
              Update your personal information and account preferences.
            </p>

            <form className="profile__form" onSubmit={handleSubmit}>
              <Input
                label="Name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSubmitting}
                autoComplete="name"
              />

              {!isNameValid && name.length > 0 && (
                <p className="profile__error">
                  Name must be between 2 and 30 characters.
                </p>
              )}

              <Input
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
              />

              {!isEmailValid && email.length > 0 && (
                <p className="profile__error">
                  Please enter a valid email address.
                </p>
              )}

              <div className="profile__actions">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Saving..."
                  disabled={
                    !isNameValid || !isEmailValid || !hasChanges || isSubmitting
                  }
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </section>
      </Container>
    </main>
  );
}

export default Profile;
