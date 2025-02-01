module.exports = {
  expo: {
    name: "mistral-ai-chat",
    slug: "mistral-ai-chat",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      mistralApiKey: process.env.MISTRAL_API_KEY,
      mistralApiUrl: process.env.MISTRAL_API_URL,
      eas: {
        projectId: "your-project-id",
      },
    },
    plugins: ["expo-router"],
  },
};
