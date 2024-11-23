# Solana Transaction Portal

## Overview

The Solana Transaction Portal is a web application built using Next.js, React, and Tailwind CSS. It allows users to send SOL securely on the Solana blockchain, supporting both Devnet and Mainnet environments. The application is designed to be fully featured and production-ready, utilizing modern UI components and hooks.

## Features

- Send SOL transactions on Solana
- Support for both Devnet and Mainnet
- Beautiful UI built with Tailwind CSS
- Responsive design
- Client-side hooks for interactivity

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 14 or higher)
- npm (Node package manager)

## Setup Instructions

Follow these steps to set up the project on your local machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/solana-transaction-app.git
   cd solana-transaction-app
   ```

2. **Install dependencies:**

   Run the following command to install the required packages:

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env.local` file in the root of the project and add your environment variables. You may need to set up your Solana wallet and network configurations.

4. **Run the development server:**

   Start the development server with the following command:

   ```bash
   npm run dev
   ```

   Your application should now be running at `http://localhost:3000`.

5. **Build for production:**

   To create an optimized production build, run:

   ```bash
   npm run build
   ```

6. **Start the production server:**

   After building, you can start the production server with:

   ```bash
   npm run start
   ```

## Removing the `ui` Folder

The `ui` folder contains essential UI components that are used throughout the application. If you remove the `ui` folder, it will significantly affect your project, as many components (like buttons, menus, cards, etc.) rely on the definitions and styles provided in that folder. The application will likely break or not render correctly without these components.

### Conclusion

This project is a great starting point for anyone looking to work with the Solana blockchain and build a user-friendly interface. Feel free to contribute and enhance the application further!