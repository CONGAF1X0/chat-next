import { create } from "zustand";
import { Bot, useBotStore } from "./Bot";
import { nanoid } from "nanoid";
import { persist } from "zustand/middleware";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import { Btn } from "../Common";
import { ModelType } from "./Config";

export type MessageRole = "user" | "system" | "assistant";

export type Message = {
  role: MessageRole;
  content: string;
  id: string;
  date: string;
  streaming?: boolean;
  isError?: boolean;

  bot?: Partial<Bot>;
};

export const createMessage = (override: Partial<Message>): Message => {
  return {
    id: nanoid(),
    date: new Date().toLocaleString(),
    role: "user",
    content: "",
    ...override,
  };
};
export type Chat = {
  id: string;
  topic: string;

  memory: string;
  history: Message[];
  tokenCount: number;
  wordCount: number;
  charCount: number;

  lastUpdate: number;
  lastSummarizeIndex: number;

  botID: string;
};

const createChat = (id: string): Chat => {
  return {
    id: nanoid(),
    topic: "New Chat",
    memory: "",
    history: [],
    tokenCount: 0,
    wordCount: 0,
    charCount: 0,
    lastUpdate: Date.now(),
    lastSummarizeIndex: 0,
    botID: id,
  };
};

type ChatStore = {
  chats: Chat[];
  index: number;
  menu: () => Partial<Chat>[];
  chat: () => Chat;
  select: (index: number) => void;
  create: (id: string) => void;
  updateCurrentChat: (updater: (chat: Chat) => void) => void;
  delete: (index: number) => void;
  size: () => number;
  userInput: (content: string, bot: Partial<Bot>) => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      index: 0,
      menu() {
        return get().chats.map(({ id, topic, lastUpdate }) => ({
          id,
          topic,
          lastUpdate,
        }));
      },
      chat() {
        let index = get().index;
        const chats = get().chats;
        if (index < 0 || index >= chats.length) {
          index = Math.min(chats.length - 1, Math.max(0, index));
          set(() => ({ index: index }));
        }
        const chat = chats[index];
        return chat;
      },
      select(index) {
        set({
          index: index,
        });
      },
      create(id) {
        const newChat = createChat(id);
        set((state) => ({
          index: 0,
          chats: [newChat].concat(state.chats),
        }));
      },
      delete(index) {
        if (!get().chats.at(index)) return;

        const restore = {
          index: get().index,
          chats: get().chats.slice(),
        };

        const newChats = get().chats.slice();
        newChats.splice(index, 1);

        const lastIdx = get().chats.length - 1;
        let curIdx = get().index;
        set(() => ({
          index: lastIdx === curIdx && curIdx !== 0 ? curIdx-- : curIdx,
          chats: newChats,
        }));

        const SBKey = enqueueSnackbar("Deleted successful", {
          variant: "success",
          action: Btn({
            label: "undo",
            onClick: () => {
              set(() => restore);
              closeSnackbar(SBKey);
              enqueueSnackbar("Restore", { variant: "success" });
            },
          }),
        });
      },
      size() {
        return get().chats.length;
      },
      updateCurrentChat(updater) {
        const chats = get().chats;
        const index = get().index;
        updater(chats[index]);
        set(() => ({ chats }));
      },
      userInput(content, bot) {
        const chat = get().chat();

        const userMessage: Message = createMessage({
          role: "user",
          content: content,
        });

        const botMessage: Message = createMessage({
          role: "assistant",
          content: content,
          streaming: true,
          bot: bot,
        });

        get().updateCurrentChat((chat) => {
          chat.history = chat.history.concat([userMessage, botMessage]);
        });
      },
    }),
    { name: "chats-storage" }
  )
);
