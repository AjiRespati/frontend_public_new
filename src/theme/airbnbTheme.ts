import { MD3LightTheme, MD3Theme } from "react-native-paper";

export const airbnbTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,

    // Airbnb palette
    primary: "#FF5A5F",
    secondary: "#00A699",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceVariant: "#F7F7F7",
    onSurfaceVariant: "#666666",
    outline: "#E5E7EB",
    onPrimary: "#FFFFFF",
    onSurface: "#333333",
  },

  // MD3 now uses "typescale" instead of fonts
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: { ...MD3LightTheme.fonts.displayLarge, fontFamily: "Poppins_700Bold" },
    displayMedium: { ...MD3LightTheme.fonts.displayMedium, fontFamily: "Poppins_700Bold" },
    headlineMedium: { ...MD3LightTheme.fonts.headlineMedium, fontFamily: "Poppins_500Medium" },
    titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontFamily: "Poppins_500Medium" },
    bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: "Poppins_400Regular" },
    bodyMedium: { ...MD3LightTheme.fonts.bodyMedium, fontFamily: "Poppins_400Regular" },
    labelLarge: { ...MD3LightTheme.fonts.labelLarge, fontFamily: "Poppins_500Medium" },
  },

  version: 3,
  isV3: true,
};
