import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Link from "../../src/Link";
import { Container } from "../../src/Container";
import { IconBack, ScrollBox } from "../../src/Common";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useEffect, useMemo, ReactNode, memo } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import {
  useBotStore,
  Bot,
  createBot,
  Pattern,
  DEFAULT_TEMPERATURE,
} from "../../src/store/Bot";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { isEmpty } from "../../src/utils";
import { DEFAULT_MODELS, ModelType } from "../../src/store/Config";

const PROMPT_HELPTEXT =
  "All conversations with this bot will start with your prompt but it will not be visible to the user in the chat.";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Stack spacing={3} sx={{ py: 3 }}>
          {children}
        </Stack>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type operationType = "new" | "edit";
type content = {
  [key in operationType]: {
    title: string;
    btn: {
      text: string;
      snackbar: [string, any];
    };
  };
};

const content = {
  new: {
    title: "Create a bot",
    btn: {
      text: "Create",
      snackbar: ["Created successful", { variant: "success" }],
    },
  },
  edit: {
    title: "Edit",
    btn: {
      text: "Save",
      snackbar: ["Modify successful", { variant: "success" }],
    },
  },
} as content;

const Main = ({ operation }: { operation: operationType }) => {
  const bots = useBotStore();
  const [bot, setBot] = useState<Bot>(createBot());
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const tabHandleChange = (event: React.SyntheticEvent, newValue: number) => {
    setBot((prevState) => ({ ...prevState, pattern: newValue }));
  };

  const [isCustomTemperature, setIsCustomTemperature] = useState(
    bot.temperature != DEFAULT_TEMPERATURE
  );

  useEffect(() => {
    if (operation === "edit") {
      const newBot = bots.getOne(router.query.id as string);
      if (newBot) {
        setBot(newBot);
        setIsCustomTemperature(newBot.temperature != DEFAULT_TEMPERATURE);
      } else {
        router.replace("/bot/new");
      }
    }
  }, [operation]);

  const [valid, setValid] = useState({
    name: false,
    prompt: false,
    api: false,
  });

  useEffect(() => {
    setValid({
      name: isEmpty(bot.name),
      prompt: bot.pattern == Pattern.Prompt && isEmpty(bot.prompt),
      api: bot.pattern == Pattern.API && isEmpty(bot.api),
    });
    console.log("effect");
  }, [bot.name, bot.prompt, bot.api, bot.pattern]);

  return (
    <ScrollBox>
      <Stack
        direction="column"
        alignItems="center"
        spacing={3}
        useFlexGap
        sx={{ maxWidth: "600px", m: "auto" }}
      >
        <Avatar src={bot.avatar} sx={{ width: 80, height: 80, mt: 2 }} />

        <TextField
          color="secondary"
          helperText="Please enter a new bot name"
          label="Name"
          required
          value={bot.name}
          onChange={(e) => {
            setBot((prevState) => ({ ...prevState, name: e.target.value }));
          }}
          error={valid.name}
        />
        <TextField
          color="secondary"
          id="outlined-multiline-static"
          label="Bot description"
          multiline
          rows={2}
          fullWidth
          value={bot.description ?? ""}
          onChange={(e) => {
            setBot((prevState) => ({
              ...prevState,
              description: e.target.value,
            }));
          }}
        />

        <Box width="100%">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              variant="fullWidth"
              textColor="secondary"
              indicatorColor="secondary"
              value={bot.pattern}
              onChange={tabHandleChange}
              aria-label="basic tabs example"
              centered
            >
              <Tab label="Prompt" {...a11yProps(Pattern.Prompt)} />
              <Tab label="API" {...a11yProps(Pattern.API)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={bot.pattern} index={Pattern.Prompt}>
            <FormControl required>
              <InputLabel color="secondary">Model</InputLabel>
              <Select
                value={bot.model}
                onChange={(e) =>
                  setBot((prevState) => ({
                    ...prevState,
                    model: e.target.value as ModelType,
                  }))
                }
                label="Model"
                color="secondary"
              >
                {DEFAULT_MODELS.map((model) => (
                  <MenuItem value={model.name} key={model.name}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              required
              color="secondary"
              label="prompt"
              multiline
              rows={4}
              helperText={PROMPT_HELPTEXT}
              value={bot.prompt}
              onChange={(e) => {
                setBot((prevState) => ({
                  ...prevState,
                  prompt: e.target.value,
                }));
              }}
              error={valid.prompt}
            />

            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Stack
                  sx={{
                    fontSize: "18px",
                  }}
                >
                  Custom temperature
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ fontSize: "14px", color: "text.disabled" }}
                  >
                    default: 0.75
                  </Stack>
                </Stack>
                <Switch
                  color="secondary"
                  checked={isCustomTemperature}
                  onChange={(e) => setIsCustomTemperature(e.target.checked)}
                />
              </Stack>
              <Box>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.01}
                  value={bot.temperature}
                  onChange={(e, newValue) => {
                    setBot((prevState) => ({
                      ...prevState,
                      temperature: newValue as number,
                    }));
                  }}
                  valueLabelDisplay="auto"
                  color="secondary"
                  disabled={!isCustomTemperature}
                />
              </Box>
            </Stack>
          </CustomTabPanel>

          <CustomTabPanel value={bot.pattern} index={Pattern.API}>
            <TextField
              color="secondary"
              helperText="Provide a link to your API bot server"
              label="API URL"
              required
              value={bot.api}
              onChange={(e) => {
                setBot((prevState) => ({ ...prevState, api: e.target.value }));
              }}
              error={valid.api}
            />
          </CustomTabPanel>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mb: 3 }}
          color="secondary"
          size="large"
          onClick={() => {
            bot.temperature = isCustomTemperature
              ? bot.temperature
              : DEFAULT_TEMPERATURE;

            if (operation === "new") {
              bots.create(bot);
              router.push("/bot");
            } else if (operation === "edit") {
              bots.update(router.query.id as string, bot);
            }
            // enqueueSnackbar(...content[operation].btn.snackbar);
          }}
          disabled={
            valid.name || (bot.pattern === 0 ? valid.prompt : valid.api)
          }
        >
          {content[operation]?.btn.text}
        </Button>
      </Stack>
    </ScrollBox>
  );
};

export default function () {
  const router = useRouter();
  const { operation } = router.query;
  useEffect(() => {
    if (operation) {
      if (operation !== "new" && operation !== "edit") {
        router.replace("/bot/new");
      }
    }
  }, [operation]);

  return (
    <Container
      headerStart={<IconBack href="/bot" />}
      headerCenter={
        <Box sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
          {content[(operation as "new" | "edit") || "new"]?.title}
        </Box>
      }
    >
      <Main operation={(operation as "new" | "edit") || "new"} />
    </Container>
  );
}
