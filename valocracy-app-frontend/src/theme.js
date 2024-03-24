// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/bitter";

// 2. Add your color mode config
// const config = {
//   initialColorMode: "dark",
//   useSystemColorMode: false,
// };

// 3. extend the theme
const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "Bitter",
  },
});

export default theme;
