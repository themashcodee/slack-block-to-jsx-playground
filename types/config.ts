export interface MessageConfig {
  logo: string;
  name: string;
  time: Date | null;
  showBlockKitDebug: boolean;
  theme?: "light" | "dark";
  unstyled?: boolean;
  withoutWrapper?: boolean;
  enableCustomUserHook?: boolean;
  data?: {
    users: Array<{ id: string; name: string }>;
    channels: Array<{ id: string; name: string }>;
    user_groups: Array<{ id: string; name: string }>;
  };
}

export interface SerializedMessageConfig {
  logo: string;
  name: string;
  time: string | null;
  showBlockKitDebug: boolean;
  theme?: "light" | "dark";
  unstyled?: boolean;
  withoutWrapper?: boolean;
  enableCustomUserHook?: boolean;
  data?: {
    users: Array<{ id: string; name: string }>;
    channels: Array<{ id: string; name: string }>;
    user_groups: Array<{ id: string; name: string }>;
  };
}
