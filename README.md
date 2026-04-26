# NomadVisa 🌍

A modern web application built with React and Vite to help digital nomads track, compare, and manage their visa requirements worldwide.

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v16.x or higher)
- **npm** (comes with Node.js)

### Installation

1. Clone the repository (or download the source code).
2. Install all the necessary dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the local development server:

```bash
npm run dev
```

This will launch the Vite development server. Open your browser and navigate to the URL provided in your terminal (usually `http://localhost:5173`).

### Building for Production

To create an optimized production build:

```bash
npm run build
```
This command generates the built files in the `dist` directory, ready to be deployed.

---

## 📚 Libraries & Tech Stack

This project utilizes a modern technology stack for a fast, responsive, and interactive user experience.

### Core Architecture
- **[React](https://react.dev/)**: Core frontend library for building user interfaces.
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling and bundler for fast development.
  ```bash
  npm create vite@latest my-app -- --template react
  ```

### Routing
- **[React Router DOM](https://reactrouter.com/)**: Enables declarative routing and navigation within the application.
  ```bash
  npm install react-router-dom
  ```

### UI, Styling & Animations
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  ```
- **[Framer Motion](https://www.framer.com/motion/)**: A production-ready motion library for React to handle complex animations.
  ```bash
  npm install framer-motion
  ```
- **[Tailwind Merge](https://github.com/dcastil/tailwind-merge) & [CLSX](https://github.com/lukeed/clsx)**: Utilities for conditionally joining CSS classes and merging Tailwind styles effectively.
  ```bash
  npm install tailwind-merge clsx
  ```

### Icons
- **[FontAwesome](https://fontawesome.com/)**: Comprehensive icon library used throughout the application.
  ```bash
  npm install @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
  ```

### Forms & Validation
- **[Yup](https://github.com/jquense/yup)**: A JavaScript schema builder for value parsing and validation (used for Login and Signup forms).
  ```bash
  npm install yup
  ```

### Network & Data
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client for the browser and node.js.
  ```bash
  npm install axios
  ```
- **[RSS Parser](https://github.com/rbren/rss-parser)**: A lightweight library to parse RSS/Atom feeds (useful for pulling in the latest visa news).
  ```bash
  npm install rss-parser
  ```

### Utilities & Tools
- **[jsPDF](https://github.com/parallax/jsPDF)**: A library for generating PDF documents directly in the browser.
  ```bash
  npm install jspdf
  ```
- **[React Simple Maps](https://www.react-simple-maps.io/)**: An interactive SVG map component library for React.
  ```bash
  npm install react-simple-maps
  ```
- **[Prop-Types](https://github.com/facebook/prop-types)**: Runtime type checking for React props.
  ```bash
  npm install prop-types
  ```

### Development Tools (devDependencies)
- **ESLint** (with React plugins): For static code analysis and maintaining code quality.
- **PostCSS** & **Autoprefixer**: For processing CSS and adding vendor prefixes automatically.
