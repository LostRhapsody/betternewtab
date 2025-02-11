export type UserSettings = {
  search_history: boolean;
  autosuggest: boolean;
  jira_api: boolean;
  confluence_api: boolean;
  linear_api: boolean;
  new_tabs: boolean;
};

export const UserSettingsLabels = [
  { label: "Enable Search History", key: "search_history", active: false },
  {
    label: "Enable Autosuggest (Powered By Brave)",
    key: "autosuggest",
    active: false,
  },
  { label: "Enable Jira API", key: "jira_api", active: false },
  { label: "Enable Confluence API", key: "confluence_api", active: false },
  { label: "Enable Linear API", key: "linear_api", active: false },
  { label: "Open Links In New Tabs", key: "new_tabs", active: true },
];
