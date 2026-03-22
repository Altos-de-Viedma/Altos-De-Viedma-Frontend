# Altos De Viedma - Frontend

This is the frontend application for the Altos de Viedma neighborhood management system. It provides a user-friendly interface for residents and administrators to manage various aspects of the community.

## ✨ Features

- **Authentication**: Secure login for residents and administrators.
- **Dashboard**: A central hub for users to access different features based on their roles.
- **Emergency Management**: Allows residents to report emergencies, which administrators can then manage.
- **Package Management**: System for tracking packages for residents.
- **Visitor Management**: Residents can authorize and manage their visitors.
- **Property Management**: Administrators can manage property details within the neighborhood.
- **User Management**: Administrators have the ability to manage user accounts.
- **Theming**: Supports both Light and Dark modes.

## 🚀 Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [NextUI](https://nextui.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (v18.x or higher is recommended)
- [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/altos-de-viedma-frontend.git
    cd altos-de-viedma-frontend
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the `.env.template` file.
    ```bash
    cp .env.template .env
    ```
    Update the `.env` file with the necessary environment variables (e.g., API base URL).

### Running the Application

To start the development server, run the following command:

```bash
yarn dev
```

The application will be available at `http://localhost:5173` by default.

## 📜 Available Scripts

- `yarn dev`: Starts the development server with hot-reloading.
- `yarn build`: Compiles and bundles the application for production.
- `yarn lint`: Lints the TypeScript and TSX files in the project.
- `yarn preview`: Serves the production build locally to preview the final app.
- `yarn start`: An alias for `yarn preview`.