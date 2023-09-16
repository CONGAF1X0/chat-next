import { ColorModeContext } from "../pages/_app";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import { ReactNode, useContext, MouseEvent, useState, Dispatch } from "react";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { styled } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/router";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { LinkProps } from "next/link";
import Link from "./Link";
import ChatIcon from "@mui/icons-material/Chat";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export const IconBack = ({ href }: { href?: string }) => {
  const router = useRouter();
  return (
    <IconButton
      onClick={() => (href ? router.push(href) : router.back())}
      sx={{
        color: "secondary.main",
      }}
    >
      <ArrowBackIosNewIcon />
    </IconButton>
  );
};

export const Btn = ({
  label,
  onClick,
  sx,
}: {
  label: string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}) => (
  <Button color="inherit" onClick={onClick} sx={sx}>
    {label}
  </Button>
);

export const DarkThemeToggle = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "secondary.main",
      }}
    >
      <IconButton onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  );
};

export const ScrollBox = styled(Box)`
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(153, 153, 153, 0.7);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const IconBtnWithTip = ({
  Icon,
  tip,
  href,
  size,
  iconButtonProps,
}: {
  Icon: typeof ChatIcon;
  href?: LinkProps["href"];
  tip?: string;
  size?: "small" | "inherit" | "medium" | "large";
  iconButtonProps?: IconButtonProps;
}) => (
  <Tooltip title={tip}>
    {href ? (
      <Link href={href}>
        <IconButton color="secondary" {...iconButtonProps}>
          <Icon fontSize={size} />
        </IconButton>
      </Link>
    ) : (
      <IconButton color="secondary" {...iconButtonProps}>
        <Icon fontSize={size} />
      </IconButton>
    )}
  </Tooltip>
);

export const usePopover = <T extends object>({
  content,
}: {
  content: string | ((data?: T) => JSX.Element);
}): [
  () => JSX.Element,
  (event: MouseEvent<HTMLButtonElement>, data?: T) => void,
  () => void
] => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [data, setData] = useState<T>();

  const handleClick = (event: MouseEvent<HTMLButtonElement>, data?: T) => {
    setAnchorEl(event.currentTarget);
    data && setData(data);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return [
    () => (
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack sx={{ p: 2 }}>
          {typeof content === "function" ? content(data) : content}
        </Stack>
      </Popover>
    ),
    handleClick,
    handleClose,
  ];
};

export function useDialog<T>({
  title,
  content,
  onConfirm,
  confirmDisabled,
}: {
  title: string;
  content?: string | ((data?: T, setData?: Dispatch<T>) => ReactNode);
  onConfirm?: (data?: T) => void;
  confirmDisabled?: boolean | ((data?: T) => boolean);
}): [() => JSX.Element, (data?: T) => void] {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T>();

  const handleClickOpen = (data?: T) => {
    setOpen(true);
    data && setData(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return [
    () => (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {typeof content === "function" ? content(data, setData) : content}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            disabled={
              typeof confirmDisabled === "function"
                ? confirmDisabled(data)
                : confirmDisabled
            }
            color="secondary"
            onClick={() => {
              onConfirm && onConfirm(data);
              handleClose();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    ),
    handleClickOpen,
  ];
}
