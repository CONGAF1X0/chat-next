import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "../src/Link";
import { Container } from "../src/Container";
import { ScrollBox, useDialog } from "../src/Common";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import { useChatStore, MessageRole, Chat, Message } from "../src/store/Chat";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
import { Bot, useBotStore } from "../src/store/Bot";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

type Data = {
  Chat?: Chat;
  Bot?: Bot;
};

const Message = (message: Message) => {
  return (
    <Stack
      alignItems={message.role === "user" ? "flex-end" : "flex-start"}
      spacing={1}
    >
      {message.role !== "user" && (
        <Stack direction="row" spacing={1} alignItems="center" height="40px">
          <Avatar src={message.bot?.avatar} sx={{ width: 30, height: 30 }} />
          <Box sx={{ fontSize: "16px" }}>{message.bot?.name}</Box>
          <Box sx={{ fontSize: "14px", color: "text.secondary" }}>
            {message.bot?.model}
          </Box>
        </Stack>
      )}
      <Stack
        sx={{ flexGrow: 1, px: "5px", width: "100%", maxWidth: "600px" }}
        direction={message.role === "user" ? "row-reverse" : "row"}
      >
        <Paper
          elevation={3}
          sx={{
            backgroundColor: message.role === "user" ? "secondary.main" : "",
            borderRadius: "10px",
            color: message.role === "user" ? "background.paper" : "",
          }}
        >
          <Typography
            variant="body1"
            p={1}
            px={2}
            sx={{
              wordBreak: "break-word",
              wordWrap: "break-word",
            }}
          >
            {message.content}
          </Typography>
        </Paper>
      </Stack>
    </Stack>
  );
};

const FooterInput = ({
  onClickClean,
  sendProp,
  inputProps,
}: {
  sendProp?: IconButtonProps & { onClick: (input: string) => void };
  inputProps?: TextFieldProps;
  onClickClean?: () => void;
}) => {
  const [input, setInput] = useState("");
  const { index } = useChatStore();
  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    setInput("");
    inputRef.current && inputRef.current.focus();
  }, [index]);
  return (
    <Stack
      component="footer"
      direction="row"
      alignItems="flex-end"
      spacing={1}
      sx={{
        backgroundColor: "background.paper",
        py: "18px",
        position: "sticky",
        bottom: 0,
        alignSelf: "stretch",
      }}
    >
      <IconButton onClick={onClickClean}>
        <CleaningServicesIcon fontSize="large" sx={{ color: "divider" }} />
      </IconButton>
      <TextField
        inputRef={inputRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        color="secondary"
        multiline
        maxRows={4}
        fullWidth
        sx={{
          ".MuiOutlinedInput-root": {
            borderRadius: "25px",
            py: "14px",
          },
        }}
        {...inputProps}
      />
      <IconButton
        {...sendProp}
        onClick={() => {
          sendProp?.onClick?.(input);
          setInput("");
        }}
        disabled={input === ""}
        color="secondary"
      >
        <SendIcon fontSize="large" />
      </IconButton>
    </Stack>
  );
};

const Main = () => {
  const [chatIndex, chatSize] = useChatStore((state) => [
    state.index,
    state.size,
  ]);
  const chatStore = useChatStore();
  const [getABot, botList] = useBotStore((state) => [state.getOne, state.list]);
  const [data, setData] = useState<Data>({});
  const [isClient, setIsClient] = useState(false);
  const scrollBoxRef = useRef<HTMLElement>(null);
  const scrollToBottom = () => {
    scrollBoxRef.current && (scrollBoxRef.current.scrollTop = 0);
  };
  const getChatData = () => {
    setData((data) => {
      data.Chat = chatStore.chat();
      if (data.Chat) {
        data.Bot = getABot(data.Chat.botID);
      }
      return data;
    });
  };
  const [Dialog, openDialog] = useDialog<{
    list: Partial<Bot>[];
    selected: string;
  }>({
    title: "Select",
    content: (data, setData) => (
      <Stack spacing={2}>
        <Box>The previous bot seem to not exist, please select a new one</Box>
        {data?.list.length !== 0 && (
          <FormControl fullWidth color="secondary">
            <InputLabel>Bot</InputLabel>
            <Select
              label="Bot"
              value={data?.selected}
              onChange={(event) => {
                data &&
                  setData &&
                  setData({ ...data, selected: event.target.value as string });
              }}
            >
              {(data?.list ?? []).map((item) => (
                <MenuItem value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Box>
          <Box
            sx={{ fontSize: "14px", color: "secondary.dark", width: "auto" }}
            component={Link}
            href={"/bot/new"}
          >
            CREATE
          </Box>
        </Box>
      </Stack>
    ),
    onConfirm: (data) => {
      data &&
        data.selected &&
        chatStore.updateCurrentChat((chat) => {
          chat.botID = data.selected;
        });
      getChatData();
    },
    confirmDisabled: (data) => data?.list.length === 0,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
    getChatData();
    console.log(data);
  }, [chatIndex, chatSize()]);

  return (
    <ScrollBox
      ref={scrollBoxRef}
      sx={{
        display: "flex",
        pt: "25px",
        flexDirection: "column-reverse",
        flex: "1 1",
      }}
    >
      <Stack
        spacing={3}
        sx={{
          width: "600px",
          m: "auto",
          position: "relative",
          flex: "1 1",
        }}
      >
        {isClient &&
          data.Chat?.history.slice(-10).map((message) => {
            return <Message {...message} />;
          })}
        <Box sx={{ flexGrow: 1 }}></Box>

        <FooterInput
          onClickClean={() => {
            console.log("clean");
          }}
          sendProp={{
            onClick: (input) => {
              if (data.Bot) {
                input && chatStore.userInput(input as string, data.Bot);
                scrollToBottom();
              } else {
                openDialog({ list: botList(), selected: "" });
              }
            },
          }}
        />
      </Stack>
      <Dialog />
    </ScrollBox>
  );
};

export default function Chat() {
  const [chat, size] = useChatStore((state) => [state.chat, state.size]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    size() === 0 && router.replace("/bot");
  }, [size()]);

  return (
    <Container
      headerCenter={
        <Box sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
          {size() !== 0 && isClient && chat().topic}
        </Box>
      }
    >
      <Main />
    </Container>
  );
}
