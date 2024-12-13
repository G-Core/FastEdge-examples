export type ThemeType = {
  body: string;
  text: string;
  sideBar: {
    background: string;
  };
  mainContent: {
    background: string;
  };
  card: {
    background: string;
  };
  input: {
    background: string;
    crossHairsColor: string;
    crossHairsBgColor: string;
    placeholderColor: string;
  };
  shimmer: {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
  };
  divider: {
    background: string;
  };
};

export const lightTheme: ThemeType = {
  body: "#FFF",
  text: "#000",
  sideBar: {
    background: "#fff",
  },
  mainContent: {
    background: "#f6f6f8",
  },
  card: {
    background: "#fff",
  },
  input: {
    background: "#f8f8f8",
    crossHairsColor: "#323232",
    crossHairsBgColor: "#e7e7e7",
    placeholderColor: "#323232",
  },
  shimmer: {
    col1: "#f0f0f0",
    col2: "#e0e0e0",
    col3: "#f0f0f0",
    col4: "#f0f0f0",
  },
  divider: {
    background: "#e0e0e0",
  },
};

export const darkTheme: ThemeType = {
  body: "#363537",
  text: "#FAFAFA",
  sideBar: {
    background: "#19202d",
  },
  mainContent: {
    background: "#232b39",
  },
  card: {
    background: "#19202D",
  },
  input: {
    background: "#232b39",
    crossHairsColor: "#8f94af",
    crossHairsBgColor: "#3C3C4D",
    placeholderColor: "#8f94af",
  },
  shimmer: {
    col1: "#2E2D3D",
    col2: "#2C2C36",
    col3: "#2E2D3D",
    col4: "#2E2D3D",
  },
  divider: {
    background: "#3B435E",
  },
};
