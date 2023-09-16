import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: false ? "dark" : "light",

    primary: {
      main: "rgba(38, 70, 83, 0.5)",
      dark: "rgba(38, 70, 83, 0.3)",
      light: "rgba(38, 70, 83, 0.7)",
    },
    secondary: {
      main: "rgba(42, 157, 143, 1)",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
