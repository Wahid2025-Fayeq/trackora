import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input/Input";
import useAuth from "../../hooks/useAuth";

import "./Profile.css";

function Profile() {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(currentUser?.name || "");
  }, [currentUser]);

  const initial = currentUser?.name?.charAt(0).toUpperCase() || "U";

  const trimmedName = name.trim();
  const isNameValid = trimmedName.length >= 2 && trimmedName.length <= 30;
  const hasChanges = trimmedName !== currentUser?.name;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isNameValid || !hasChanges || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile({
        name: trimmedName,
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
            <div className="profile__avatar" aria-hidden="true">
              {initial}
            </div>

            <p className="profile__photo-label">Profile Photo</p>

            <span className="profile__photo-status">
              Upload support coming soon
            </span>
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

              <div className="profile__detail">
                <span className="profile__label">Email</span>
                <strong>{currentUser?.email || "Not available"}</strong>
                <span className="profile__hint">
                  Email changes are not available yet.
                </span>
              </div>

              <div className="profile__actions">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Saving..."
                  disabled={!isNameValid || !hasChanges || isSubmitting}
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
