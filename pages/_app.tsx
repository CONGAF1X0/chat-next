import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import createEmotionCache from "../src/createEmotionCache";
import { Roboto } from "next/font/google";
import { SnackbarProvider } from "notistack";
import { createContext, useEffect, useMemo, useState } from "react";
import { useConfig, Theme } from "../src/store/Config";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [themeMode, update] = useConfig((state) => [state.theme, state.update]);
  const [mode, setMode] = useState<Theme>(Theme.Light);
  useEffect(() => {
    setMode(themeMode);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode: Theme =
            prevMode === "light" ? Theme.Dark : Theme.Light;
          update((config) => {
            config.theme = newMode;
          });
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mode,
        ...(mode === "light"
          ? {
              // palette values for light mode
              primary: {
                main: "rgba(132, 169, 140, 0.5)",
                dark: "rgba(132, 169, 140, 0.2)",
                light: "rgba(132, 169, 140, 0.8)",
              },
              secondary: {
                main: "rgba(47, 62, 70, 1)",
              },
              text: {},
            }
          : {
              // palette values for dark mode
              primary: {
                main: "rgba(38, 70, 83, 0.5)",
                dark: "rgba(38, 70, 83, 0.7)",
                light: "rgba(38, 70, 83, 0.3)",
              },
              secondary: {
                main: "rgba(42, 157, 143, 1)",
              },
            }),
      },
      typography: {
        fontFamily: roboto.style.fontFamily,
      },
    });
  }, [mode]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={5000}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}
