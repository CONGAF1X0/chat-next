import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { enqueueSnackbar } from "notistack";
import { ModelType } from "./Config";

export enum Pattern {
  Prompt,
  API,
}

export type Bot = {
  id: string;
  avatar: string;
  name: string;
  description?: string;
  createdAt: number;
  pattern: Pattern;
  model: ModelType;
  prompt: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  presence_penalty: number;
  frequency_penalty: number;
  sendMemory: boolean;
  historyMessageCount: number;
  compressMessageLengthThreshold: number;
  enableInjectSystemPrompts: boolean;

  api: string;
};

const DEFAULT_AVATAR = "/mawen.png";
const DEFAULT_NAME = "MRVN";
export const DEFAULT_TEMPERATURE = 0.75;
export const createBot = (): Bot => ({
  id: nanoid(),
  avatar: DEFAULT_AVATAR,
  name: DEFAULT_NAME,
  createdAt: 0,
  description: "",

  pattern: Pattern.Prompt,
  model: "gpt-3.5-turbo",
  prompt: "",
  temperature: DEFAULT_TEMPERATURE,
  top_p: 1,
  max_tokens: 2000,
  presence_penalty: 0,
  frequency_penalty: 0,
  sendMemory: true,
  historyMessageCount: 4,
  compressMessageLengthThreshold: 1000,
  enableInjectSystemPrompts: true,

  api: "",
});

const DEFAULT_BOT = {
  bots: {} as Record<string, Bot>,
};
export type BotState = typeof DEFAULT_BOT;

export type BotStore = BotState & {
  query: string;
  setQuery: (q: string) => void;
  create: (bot?: Partial<Bot>) => Bot;
  update: (id: string, bot: Bot) => void;
  delete: (id: string) => void;
  clear: () => void;
  getOne: (id: string) => Bot;
  getAll: () => Bot[];
  search: () => Bot[];
  list: () => Partial<Bot>[];
};

const botsFilter = (bots: Bot[], query: string) => {
  return bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(query.toLowerCase()) ||
      (bot.model && bot.model.toLowerCase().includes(query.toLowerCase()))
  );
};

export const useBotStore = create<BotStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_BOT,
      query: "",
      setQuery(q) {
        set((state) => ({ ...state, query: q }));
      },
      create(bot) {
        const bots = get().bots;
        const id = nanoid();
        bots[id] = {
          ...createBot(),
          ...bot,
          id,
          createdAt: Date.now(),
        };
        set(() => ({ bots }));
        enqueueSnackbar("Create successful", { variant: "success" });
        return bots[id];
      },
      update(id, bot) {
        const bots = get().bots;
        const oldBot = bots[id];
        if (!oldBot) {
          enqueueSnackbar("This bot not exist", { variant: "error" });
          return;
        }
        bots[id] = { ...bot };
        set(() => ({ bots }));
        enqueueSnackbar("Modify successful", { variant: "success" });
        return;
      },
      clear() {
        set(() => ({ ...DEFAULT_BOT }));
      },
      getOne(id) {
        return get().bots[id];
      },
      getAll() {
        const userBots = Object.values(get().bots).sort(
          (a, b) => b.createdAt - a.createdAt
        );
        return userBots;
      },
      list() {
        const userBots = Object.values(get().bots).sort(
          (a, b) => b.createdAt - a.createdAt
        );
        return userBots.map(({ id, name, avatar, model }) => ({
          id,
          name,
          avatar,
          model,
        }));
      },
      delete(id) {
        const bots = get().bots;
        let name =
          bots[id].name.length >= 14
            ? bots[id].name.slice(0, 11) + "..."
            : bots[id].name;
        delete bots[id];
        set(() => ({ bots }));

        enqueueSnackbar(`${name} deleted successful`, {
          variant: "success",
        });
      },
      search() {
        return botsFilter(get().getAll(), get().query);
      },
    }),
    {
      name: "bots-storage",
      storage: createJSONStorage(() => {
        let value = JSON.parse(localStorage.getItem("bots-storage")!);
        if (value) {
          value.state.query = "";
          localStorage.setItem("bots-storage", JSON.stringify(value));
        }
        return localStorage;
      }),
    }
  )
);
