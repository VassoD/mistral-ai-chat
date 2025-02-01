# Mistral AI Chat

A modern chat application built with React Native, Expo, and Mistral AI. This app provides a seamless chat experience with AI-powered responses.

> 🚧 **Development Status**: This project is actively under development. New features and improvements are being added regularly.

## Tech Stack

- [Expo](https://expo.dev) - React Native framework
- [Mistral AI](https://mistral.ai) - AI language model
- [Supabase](https://supabase.com) - Backend and real-time database
- [React Native](https://reactnative.dev) - Mobile app framework
- [TypeScript](https://www.typescriptlang.org) - Type safety

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI
- Supabase account
- Mistral AI API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/VassoD/mistral-ai-chat.git
   cd mistral-ai-chat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:

   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   MISTRAL_API_KEY=your_mistral_api_key
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

## Project Structure

```
mistral-ai-chat/
├── app/                 # Main application screens
├── components/          # Reusable UI components
├── services/           # API and backend services
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
