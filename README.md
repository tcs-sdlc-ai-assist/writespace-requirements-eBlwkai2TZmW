# writespace

A collaborative writing platform built with React 18+, TypeScript, and Vite. Write, edit, and share posts with role-based access control.

## Tech Stack

- **React 18+**
- **TypeScript**
- **Vite**
- **Tailwind CSS**

## Features

- User authentication and session management
- Role-based access: admin, editor, viewer
- Create, edit, and publish posts
- Responsive UI with Tailwind CSS
- Dark mode support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/yourusername/writespace.git
   cd writespace
   ```

2. **Install dependencies:**

   ```
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add any required variables (see `.env.example` if available).

4. **Start the development server:**

   ```
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser:**

   Visit [http://localhost:5173](http://localhost:5173)

## Folder Structure

```
src/
  components/      # Reusable React components
  pages/           # Page-level components
  utils/           # TypeScript types and utility functions
  App.tsx          # Main app component
  main.tsx         # Entry point
  index.css        # Tailwind CSS imports
public/
  ...              # Static assets
```

## Usage

- **Sign up or log in** to access the platform.
- **Create and edit posts** (editors and admins).
- **Publish or unpublish posts** (admins).
- **View posts** (all users).

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## License

MIT License

---

&copy; 2024 writespace. All rights reserved.