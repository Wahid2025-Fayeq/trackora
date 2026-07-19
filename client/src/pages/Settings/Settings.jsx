import { useEffect, useState } from "react";
import { Bell, KeyRound, Moon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import ChangePasswordModal from "../../components/common/ChangePasswordModal/ChangePasswordModal";
import Button from "../../components/ui/Button/Button";
import Container from "../../components/ui/Container";
import Select from "../../components/ui/Select/Select";
import useAuth from "../../hooks/useAuth";

import "./Settings.css";

const defaultPreferences = {
  theme: "system",
  defaultStatus: "Applied",
  defaultSort: "newest",
  dateFormat: "MM/DD/YYYY",
};

const settingsItems = [
  {
    icon: Bell,
    title: "Notifications",
    description: "Control application and interview reminders.",
  },
  {
    icon: KeyRound,
    title: "Change Password",
    description: "Update your account password securely.",
    action: "changePassword",
  },
  {
    icon: Trash2,
    title: "Delete Account",
    description: "Permanently remove your account and job data.",
    danger: true,
  },
];

const themeOptions = [
  { value: "system", label: "System default" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const statusOptions = [
  { value: "Saved", label: "Saved" },
  { value: "Applied", label: "Applied" },
  { value: "Interview", label: "Interview" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "company", label: "Company name" },
  { value: "title", label: "Job title" },
];

const dateFormatOptions = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

function Settings() {
  const { currentUser, savePreferences } = useAuth();

  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    setPreferences({
      ...defaultPreferences,
      ...currentUser?.preferences,
    });
  }, [currentUser]);

  const savedPreferences = {
    ...defaultPreferences,
    ...currentUser?.preferences,
  };

  const hasChanges =
    JSON.stringify(preferences) !== JSON.stringify(savedPreferences);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPreferences((previousPreferences) => ({
      ...previousPreferences,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasChanges) {
      return;
    }

    setIsSubmitting(true);

    try {
      await savePreferences(preferences);
      toast.success("Preferences saved successfully");
    } catch (error) {
      toast.error(error.message || "Unable to save preferences");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="settings">
      <Container>
        <section className="settings__header">
          <p className="settings__eyebrow">Account</p>

          <h1 className="settings__title">Settings</h1>

          <p className="settings__subtitle">
            Manage your account preferences and security.
          </p>
        </section>

        <form className="settings__preferences" onSubmit={handleSubmit}>
          <div className="settings__section-heading">
            <div className="settings__icon">
              <Moon size={20} aria-hidden="true" />
            </div>

            <div>
              <h2 className="settings__item-title">Preferences</h2>

              <p className="settings__description">
                Customize Trackora’s appearance and application defaults.
              </p>
            </div>
          </div>

          <div className="settings__fields">
            <Select
              label="Theme"
              name="theme"
              value={preferences.theme}
              onChange={handleChange}
              options={themeOptions}
              disabled={isSubmitting}
            />

            <Select
              label="Default application status"
              name="defaultStatus"
              value={preferences.defaultStatus}
              onChange={handleChange}
              options={statusOptions}
              disabled={isSubmitting}
            />

            <Select
              label="Default job sorting"
              name="defaultSort"
              value={preferences.defaultSort}
              onChange={handleChange}
              options={sortOptions}
              disabled={isSubmitting}
            />

            <Select
              label="Date format"
              name="dateFormat"
              value={preferences.dateFormat}
              onChange={handleChange}
              options={dateFormatOptions}
              disabled={isSubmitting}
            />
          </div>

          <div className="settings__actions">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting || !hasChanges}
            >
              Save preferences
            </Button>
          </div>
        </form>

        <section className="settings__card">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isChangePassword = item.action === "changePassword";

            const content = (
              <>
                <div
                  className={`settings__icon ${
                    item.danger ? "settings__icon_danger" : ""
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                </div>

                <div className="settings__content">
                  <h2
                    className={`settings__item-title ${
                      item.danger ? "settings__item-title_danger" : ""
                    }`}
                  >
                    {item.title}
                  </h2>

                  <p className="settings__description">{item.description}</p>
                </div>

                {!isChangePassword && (
                  <span className="settings__badge">Coming Soon</span>
                )}
              </>
            );

            if (isChangePassword) {
              return (
                <button
                  className="settings__item settings__item_button"
                  type="button"
                  key={item.title}
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  {content}
                </button>
              );
            }

            return (
              <div className="settings__item" key={item.title}>
                {content}
              </div>
            );
          })}
        </section>

        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      </Container>
    </main>
  );
}

export default Settings;
