import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "../src/Link";
import { Container } from "../src/Container";
import { ScrollBox } from "../src/Common";
import TextField from "@mui/material/TextField";
import { useState } from "react";

export default function About() {
  const [val, setVal] = useState("");

  return (
    <Container>
      <ScrollBox
        sx={{
          display: "flex",
          pt: "25px",
          flexDirection: "column-reverse",
          mb: "5px",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />

        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Box
            sx={{
              my: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Material UI - Next.js example in TypeScript {i}
            </Typography>
            <Box maxWidth="sm">
              <Button variant="contained" component={Link} noLinkStyle href="/">
                Go to the home page
              </Button>
            </Box>
            <Box
              sx={{
                width: 300,
                height: 300,
                backgroundColor: "primary.dark",
                "&:hover": {
                  backgroundColor: "primary.main",
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            ></Box>
          </Box>
        ))}
      </ScrollBox>
    </Container>
  );
}
