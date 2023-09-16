import { ReactNode, memo, useMemo } from "react";
import { HeaderContainer } from "./Header";
import Box from "@mui/material/Box";
import { Sidebar } from "./Sidebar";
import { Stack } from "@mui/material";
import { DarkThemeToggle } from "./Common";

type Props = {
  children: ReactNode;
  headerStart?: ReactNode;
  headerCenter?: ReactNode;
  headerEnd?: ReactNode;
};

export const Container = (props: Props) => {
  console.log("c");
  return (
    <Stack direction="row" sx={{ height: "100vh" }}>
      <Sidebar />
      <Right {...props} />
    </Stack>
  );
};
const Right = ({ children, headerStart, headerCenter, headerEnd }: Props) => {
  console.log("c2");
  return (
    <Stack
      sx={{
        alignItems: "center",
        flexGrow: 1,
        minWidth: 700,
      }}
    >
      <HeaderContainer
        sx={{
          minHeight: "65px",
          Height: "65px",
          borderBottom: "1px solid ",
          borderColor: "divider",
          backgroundColor: "background.paper",
          justifyContent: "space-between",
        }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "start", px: 2, flexGrow: 1, maxWidth: "33%" }}
        >
          {headerStart ?? ""}
        </Stack>
        <Stack
          direction="row"
          sx={{ justifyContent: "center", flexGrow: 1, maxWidth: "33%" }}
        >
          {headerCenter ?? ""}
        </Stack>
        <Stack
          sx={{ px: 2, justifyContent: "end", flexGrow: 1, maxWidth: "33%" }}
          direction="row"
        >
          {headerEnd ?? <DarkThemeToggle />}
        </Stack>
      </HeaderContainer>
      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          alignSelf: "stretch",
          minHeight: 0,
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};
