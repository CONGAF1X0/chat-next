import { ReactNode } from "react";
import { SxProps } from "@mui/material/styles";
import { Stack } from "@mui/material";

type Props = {
  children: ReactNode;
  sx?: SxProps;
};

export const HeaderContainer = ({ children, sx }: Props) => {
  return (
    <Stack
      component="header"
      direction={"row"}
      sx={{
        alignItems: "center",
        alignSelf: "stretch",
        color: "secondary.main",
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
};
