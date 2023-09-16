import Box from "@mui/material/Box";
import Link from "../../src/Link";
import { Container } from "../../src/Container";
import {
  ScrollBox,
  IconBtnWithTip,
  usePopover,
  useDialog,
} from "../../src/Common";
import TextField from "@mui/material/TextField";
import { useEffect, useMemo, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useFocus } from "../../src/utils";
import AddIcon from "@mui/icons-material/Add";
import { Bot, useBotStore } from "../../src/store/Bot";
import ClearIcon from "@mui/icons-material/Clear";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import { useSnackbar } from "notistack";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useChatStore } from "../../src/store/Chat";

const HeaderEnd = () => {
  const botStore = useBotStore();
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <SearchInput
        query={botStore.query}
        onBlurCallBack={(input) => {
          botStore.setQuery(input);
        }}
      />
      <IconBtnWithTip Icon={AddIcon} tip="New" href={"/bot/new"} />
    </Stack>
  );
};

export default function Bots() {
  return (
    <Container
      headerEnd={<HeaderEnd />}
      headerCenter={
        <Box sx={{ fontWeight: 700, fontSize: "1.125rem" }}>Bots</Box>
      }
    >
      <Main />
    </Container>
  );
}

const Main = () => {
  const botStore = useBotStore();
  const { create } = useChatStore();
  const query = useBotStore((state) => state.query);
  const [items, setItems] = useState<Bot[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  useEffect(() => {
    if (query === "") {
      setItems(botStore.getAll());
    } else {
      botStore.setQuery(query);
      setItems(botStore.search());
    }
  }, [query]);

  const [DelDialog, openDelDialog] = useDialog<Bot>({
    title: "Delete",
    content: (data) => {
      let name = "this bot";
      data && (name = data.name);
      return `Confirm to delete ${name}?`;
    },
    onConfirm: (data) => {
      if (data) {
        botStore.delete(data.id);
        setItems(botStore.search());
      }
    },
  });

  const [DelPopover, openDelpop, closeDelpop] = usePopover<Bot>({
    content: (data) => (
      <Stack spacing={1}>
        <Box>
          Confirm to delete{" "}
          {data ? (
            <Box component={"span"}>
              the{" "}
              <Box
                sx={{
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100px",
                  verticalAlign: "bottom",
                }}
                component="b"
              >
                {data.name}
              </Box>
            </Box>
          ) : (
            "this bot"
          )}{" "}
          ?
        </Box>
        <Stack direction="row-reverse">
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              if (data) {
                botStore.delete(data.id);
                setItems(botStore.search());
                closeDelpop();
              }
            }}
          >
            confirm
          </Button>
        </Stack>
      </Stack>
    ),
  });

  return (
    <ScrollBox
      sx={{
        display: "flex",
        py: "25px",
      }}
    >
      <Stack
        flexDirection="column"
        alignItems="center"
        spacing={3}
        sx={{ maxWidth: "600px", m: "auto" }}
      >
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: "10px" }}
        >
          <Table sx={{ width: 600 }} aria-label="table">
            <TableBody>
              {items.map((bot) => (
                <TableRow
                  key={bot.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    height: "100px",
                  }}
                >
                  <TableCell scope="row">
                    <Stack spacing={1} direction="row">
                      <Box>
                        <Avatar
                          src={bot.avatar}
                          sx={{ width: "50px", height: "50px" }}
                        />
                      </Box>
                      <Stack spacing={0.5} justifyContent="center">
                        <Box
                          sx={{
                            fontWeight: "bold",
                            fontSize: "15px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "200px",
                          }}
                        >
                          {bot.name}
                        </Box>
                        <Box sx={{ fontSize: "14px" }}>{bot.model}</Box>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row-reverse" spacing={1}>
                      <IconBtnWithTip
                        Icon={DeleteIcon}
                        tip="Delete"
                        size="small"
                        iconButtonProps={{
                          onClick: (event) => openDelpop(event!, bot),
                        }}
                      />
                      <IconBtnWithTip
                        Icon={EditIcon}
                        tip="Edit"
                        size="small"
                        iconButtonProps={{
                          onClick: () =>
                            router.push({
                              pathname: "/bot/edit",
                              query: {
                                id: bot.id,
                              },
                            }),
                        }}
                      />
                      <IconBtnWithTip
                        Icon={ChatIcon}
                        tip="Chat"
                        size="small"
                        iconButtonProps={{
                          onClick: () => {
                            create(bot.id);
                            router.push("/chat");
                          },
                        }}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <DelDialog />
        <DelPopover />
      </Stack>
    </ScrollBox>
  );
};

const SearchInput = ({
  query,
  onBlurCallBack,
}: {
  query?: string;
  onBlurCallBack?: (input: string) => void;
}) => {
  const [input, setInput] = useState(query ?? "");
  const [inputRef, isFocused, setIsFocused] = useFocus();
  useEffect(() => {
    if (inputRef.current && isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <Stack
      direction="row"
      sx={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        width: "100%",
        border: "2px solid",
        borderColor: isFocused ? "secondary.main" : "transparent",
        borderRadius: "10px",
        height: "48px",
        boxShadow: isFocused
          ? ""
          : "rgba(255, 255, 255, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px",
      }}
    >
      <InputBase
        inputRef={inputRef}
        sx={{
          transition: "all 0.2s",
          flex: 1,
          ml: isFocused || input !== "" ? "10px" : "0px",
          maxWidth: isFocused || input !== "" ? "200px" : "0px",
          pr: "44px",
        }}
        placeholder="Search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={() => {
          onBlurCallBack ? onBlurCallBack(input) : "";
        }}
        inputProps={{ "aria-label": "search" }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: "10px",
          color: "secondary.main",
          position: "absolute",
          right: 0,
          cursor: "pointer",
        }}
        onClick={() => {
          setIsFocused(true);
          input !== "" ? setInput("") : "";
        }}
      >
        {input !== "" ? <ClearIcon fontSize="small" /> : <SearchIcon />}
      </Box>
    </Stack>
  );
};
