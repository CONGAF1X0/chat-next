import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/router";
import { HeaderContainer } from "./Header";
import Image from "next/image";
import Link from "../src/Link";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useHoverDirty } from "react-use";
import IconButton from "@mui/material/IconButton";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import Stack from "@mui/material/Stack";
import { ScrollBox } from "./Common";
import Paper from "@mui/material/Paper";
import { Chat, useChatStore } from "./store/Chat";

// const IconButton = ({
//   icon,
//   children,
// }: {
//   icon: React.ReactNode;
//   children?: React.ReactNode;
// }) => (
//   <Box
//     sx={{
//       display: "flex",
//       height: "36px",
//       alignItems: "center",
//       width: "0",
//       alignSelf: "stretch",
//       justifyContent: "center",
//       backgroundColor: "secondary.main",
//       borderRadius: "10px",
//       m: "5px",
//       cursor: "pointer",
//       color: "white",
//     }}
//   >
//     {icon}
//     {children ? (
//       <Box component="span" sx={{ fontSize: "15px", ml: "4px" }}>
//         {children}
//       </Box>
//     ) : (
//       ""
//     )}
//   </Box>
// );

const Item = ({
  label,
  selected = false,
  onClick,
  onClickDel,
}: {
  label: string;
  selected: boolean;
  onClick?: () => void;
  onClickDel?: () => void;
}) => {
  const ContainerRef = React.createRef<Element>();
  const isContainerHovering = useHoverDirty(ContainerRef);

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: "10px",
      }}
    >
      <Box
        ref={ContainerRef}
        sx={{
          mt: 1.5,
          backgroundColor: isContainerHovering
            ? "action.hover"
            : "background.paper",
          border: "2px solid",
          borderColor: selected ? "secondary.main" : "transparent",
          borderRadius: "10px",
          display: "block",
          position: "relative",
        }}
      >
        <ListItemButton
          alignItems="center"
          sx={{
            py: 2.5,
            borderRadius: "inherit",
            ":hover": { backgroundColor: "transparent" },
          }}
          onClick={onClick}
        >
          <ListItemIcon>
            {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
            <Avatar sx={{ width: 36, height: 36 }} src="/mawen.png">
              {label.substring(0, 3)}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              fontSize: "16px",
              fontWeight: "medium",
              lineHeight: "22px",
            }}
            sx={{ my: 0 }}
          />
        </ListItemButton>
        <Box
          className="Cancel"
          sx={{
            color: "secondary.main",
            position: "absolute",
            height: "22px",
            top: "3px",
            right: "1px",
            transition: "all .3s ease",
            opacity: isContainerHovering ? 0.7 : 0,
            transform: isContainerHovering ? "translateX(-10%)" : "",
            ":hover": {
              cursor: "pointer",
              opacity: "1!important",
            },
          }}
          onClick={onClickDel}
        >
          <CancelOutlinedIcon />
        </Box>
      </Box>
    </Paper>
  );
};

export const Sidebar = () => {
  const [menu, index, select, deleteChat, size] = useChatStore((state) => [
    state.menu,
    state.index,
    state.select,
    state.delete,
    state.size,
  ]);

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Stack
      spacing={1.5}
      useFlexGap
      sx={{
        width: "300px",
        backgroundColor: "primary.dark",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <HeaderContainer sx={{ px: 2.5, mt: 2 }}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            height: "70px",
            ".img": {
              filter: "invert(1)",
            },
          }}
        >
          <Image
            className="img"
            src="/Pathfinder_Icon.png"
            width={40}
            height={40}
            alt=""
          />
          <Box
            component="span"
            sx={{ ml: 1, fontWeight: 700, fontSize: "1.25rem" }}
          >
            Chat
          </Box>
        </Stack>
      </HeaderContainer>

      <Stack px={2.5} flexWrap="wrap" direction="row" useFlexGap spacing={1}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<SmartToyIcon />}
          sx={{
            flexGrow: 1,
            borderRadius: "10px",
            fontWeight: "600",
            color: "background.paper",
          }}
          component={Link}
          href={"/bot"}
        >
          BOT
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<DeleteForeverIcon />}
          sx={{
            flexGrow: 1,
            borderRadius: "10px",
            fontWeight: "600",
            color: "background.paper",
          }}
        >
          clear
        </Button>
      </Stack>

      <Divider />

      <ScrollBox
        sx={{
          px: 2.5,
          flexGrow: 1,
          pb: 1,
        }}
      >
        <List component="nav" disablePadding>
          {isClient &&
            menu().map((item, i) => (
              <Item
                label={item.topic ?? "topic"}
                selected={index === i}
                key={i}
                onClick={() => {
                  select(i);
                  router.push("/chat");
                }}
                onClickDel={() => {
                  deleteChat(i);
                  console.log(router.asPath);
                  if (router.asPath === "/chat") {
                    router.push("/chat");
                  }
                }}
              />
            ))}
        </List>
      </ScrollBox>

      <Stack
        direction="row"
        px={2.5}
        my={2}
        sx={{ display: "flex", alignItems: "center", height: "55px" }}
      >
        <IconButton color="secondary" aria-label="setting">
          <SettingsSharpIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};
