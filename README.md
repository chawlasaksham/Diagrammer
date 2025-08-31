# React Workflow Builder

A modern **React-based workflow builder** application that provides an interactive canvas where users can design, visualize, and manage workflows with a drag-and-drop interface.

## 🚀 Features

- **React 18** – Modern React version with concurrent rendering  
- **Vite** – Lightning-fast build tool and dev server  
- **Redux Toolkit** – Simplified global state management  
- **Tailwind CSS** – Utility-first styling with custom configurations  
- **React Router v6** – Declarative routing  
- **Canvas Workflow Builder** – Interactive drag-and-drop canvas to create workflows  
- **Node/Edge Management** – Add, remove, and connect workflow nodes visually  
- **Framer Motion** – Smooth animations for better UX  
- **Data Visualization** – Optional integration with D3.js/Recharts for insights  
- **Form Handling** – React Hook Form for node property editing  
- **Testing** – Jest + React Testing Library setup  

## 📋 Prerequisites

- Node.js (v14.x or higher)  
- npm or yarn  

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/username/workflow-builder.git
   cd workflow-builder

   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new
