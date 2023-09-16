import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum Theme {
  Dark = "dark",
  Light = "light",
}

export const DEFAULT_MODELS = [
  {
    name: "gpt-4",
    available: true,
  },
  {
    name: "gpt-4-0314",
    available: true,
  },
  {
    name: "gpt-4-0613",
    available: true,
  },
  {
    name: "gpt-4-32k",
    available: true,
  },
  {
    name: "gpt-4-32k-0314",
    available: true,
  },
  {
    name: "gpt-4-32k-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k-0613",
    available: true,
  },
] as const;
export type ModelType = (typeof DEFAULT_MODELS)[number]["name"];

export const DEFAULT_MODEL = {
  model: "gpt-3.5-turbo" as ModelType,
  temperature: 0.5,
  top_p: 1,
  max_tokens: 2000,
  presence_penalty: 0,
  frequency_penalty: 0,
  sendMemory: true,
  historyMessageCount: 4,
  compressMessageLengthThreshold: 1000,
  enableInjectSystemPrompts: true,
};

export const DEFAULT_CONFIG = {
  avatar: "1f603",
  fontSize: 14,
  theme: Theme.Dark as Theme,
  enableAutoGenerateTitle: true,
  sidebarWidth: 300,

  models: DEFAULT_MODELS,
};
type Config = typeof DEFAULT_CONFIG;

type ConfigStore = Config & {
  reset: () => void;
  update: (updater: (config: Config) => void) => void;
};

export const useConfig = create<ConfigStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_CONFIG,
      reset() {
        set(() => ({ ...DEFAULT_CONFIG }));
      },
      update(updater) {
        const config = { ...get() };
        updater(config);
        set(() => config);
      },
    }),
    {
      name: "app-config",
    }
  )
);
