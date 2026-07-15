import { Bell, KeyRound, Moon, Trash2 } from "lucide-react";

import Container from "../../components/ui/Container";

import "./Settings.css";

const settingsItems = [
  {
    icon: Moon,
    title: "Appearance",
    description: "Dark mode and theme preferences.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control application and interview reminders.",
  },
  {
    icon: KeyRound,
    title: "Change Password",
    description: "Update your account password securely.",
  },
  {
    icon: Trash2,
    title: "Delete Account",
    description: "Permanently remove your account and job data.",
    danger: true,
  },
];

function Settings() {
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

        <section className="settings__card">
          {settingsItems.map((item) => {
            const Icon = item.icon;

            return (
              <div className="settings__item" key={item.title}>
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

                <span className="settings__badge">Coming Soon</span>
              </div>
            );
          })}
        </section>
      </Container>
    </main>
  );
}

export default Settings;
