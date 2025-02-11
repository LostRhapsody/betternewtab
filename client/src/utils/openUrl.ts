import { useUserSettingsStore } from '../stores/settings';

export const openUrl = (url: string) => {
  const settingsStore = useUserSettingsStore();
  if (settingsStore.settings.new_tabs) {
    console.log("Opening in new tab:", url);
    window.open(url, "_blank");
  } else {
    console.log("Opening in same tab:", url);
    window.location.href = url;
  }
};
