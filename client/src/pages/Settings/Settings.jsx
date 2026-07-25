import { useEffect, useState } from "react";
import { Bell, KeyRound, Moon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import ChangePasswordModal from "../../components/common/ChangePasswordModal/ChangePasswordModal";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal/DeleteConfirmationModal";
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
  notifications: {
    interviewReminders: true,
    followUpReminders: true,
    applicationUpdates: true,
    emailNotifications: false,
  },
};

const settingsItems = [
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
    action: "deleteAccount",
    danger: true,
  },
];

const notificationOptions = [
  {
    name: "interviewReminders",
    label: "Interview reminders",
    description: "Receive reminders about upcoming scheduled interviews.",
  },
  {
    name: "followUpReminders",
    label: "Follow-up reminders",
    description: "Receive reminders when it is time to follow up on a job.",
  },
  {
    name: "applicationUpdates",
    label: "Application updates",
    description: "Receive notifications about changes to your applications.",
  },
  {
    name: "emailNotifications",
    label: "Email notifications",
    description: "Receive Trackora reminders through email.",
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

const mergePreferences = (userPreferences = {}) => ({
  ...defaultPreferences,
  ...userPreferences,
  notifications: {
    ...defaultPreferences.notifications,
    ...userPreferences.notifications,
  },
});

function Settings() {
  const navigate = useNavigate();

  const { currentUser, savePreferences, deleteAccount } = useAuth();

  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    setPreferences(mergePreferences(currentUser?.preferences));
  }, [currentUser]);

  const savedPreferences = mergePreferences(currentUser?.preferences);

  const hasChanges =
    JSON.stringify(preferences) !== JSON.stringify(savedPreferences);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPreferences((previousPreferences) => ({
      ...previousPreferences,
      [name]: value,
    }));
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;

    setPreferences((previousPreferences) => ({
      ...previousPreferences,
      notifications: {
        ...previousPreferences.notifications,
        [name]: checked,
      },
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

  const handleDeleteAccount = async (confirmation) => {
    if (confirmation !== "DELETE") {
      return;
    }

    setIsDeletingAccount(true);

    try {
      await deleteAccount(confirmation);

      toast.success("Account deleted successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to delete account");
      setIsDeletingAccount(false);
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
          <section className="settings__section">
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
          </section>

          <section className="settings__section">
            <div className="settings__section-heading">
              <div className="settings__icon">
                <Bell size={20} aria-hidden="true" />
              </div>

              <div>
                <h2 className="settings__item-title">Notifications</h2>

                <p className="settings__description">
                  Control application, follow-up, and interview reminders.
                </p>
              </div>
            </div>

            <div className="settings__notification-list">
              {notificationOptions.map((notification) => (
                <label
                  className="settings__notification"
                  key={notification.name}
                >
                  <span className="settings__notification-content">
                    <span className="settings__notification-title">
                      {notification.label}
                    </span>

                    <span className="settings__notification-description">
                      {notification.description}
                    </span>
                  </span>

                  <span className="settings__switch">
                    <input
                      className="settings__switch-input"
                      type="checkbox"
                      name={notification.name}
                      checked={
                        preferences.notifications?.[notification.name] ?? false
                      }
                      onChange={handleNotificationChange}
                      disabled={isSubmitting}
                    />

                    <span
                      className="settings__switch-slider"
                      aria-hidden="true"
                    />
                  </span>
                </label>
              ))}
            </div>
          </section>

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
            const isDeleteAccount = item.action === "deleteAccount";

            const content = (
              <>
                <div
                  className={
                    "settings__icon" +
                    (item.danger ? " settings__icon_danger" : "")
                  }
                >
                  <Icon size={20} aria-hidden="true" />
                </div>

                <div className="settings__content">
                  <h2
                    className={
                      "settings__item-title" +
                      (item.danger ? " settings__item-title_danger" : "")
                    }
                  >
                    {item.title}
                  </h2>

                  <p className="settings__description">{item.description}</p>
                </div>
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

            if (isDeleteAccount) {
              return (
                <button
                  className="settings__item settings__item_button"
                  type="button"
                  key={item.title}
                  onClick={() => setIsDeleteAccountOpen(true)}
                >
                  {content}
                </button>
              );
            }

            return null;
          })}
        </section>

        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteAccountOpen}
          onClose={() => setIsDeleteAccountOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Delete account?"
          message="This will permanently delete your account, job applications, interview information, notes, and preferences. This action cannot be undone."
          confirmText="Delete account"
          loadingText="Deleting account..."
          confirmationText="DELETE"
          isDeleting={isDeletingAccount}
        />
      </Container>
    </main>
  );
}

export default Settings;
