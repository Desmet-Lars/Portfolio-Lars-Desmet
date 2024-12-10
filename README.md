# Fluid

A modern Next.js web application built with React and Tailwind CSS.

## 🚀 Features

- Built with Next.js 15.0
- Modern UI with Framer Motion animations
- Responsive design using Tailwind CSS
- Drag and drop functionality with @neodrag/react
- Email functionality with Nodemailer
- Rate limiting for API protection
- Icon support with react-icons

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 15.0.4
- **UI Library:** React 19.0.0
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Font:** Geist
- **Additional Libraries:**
  - @neodrag/react for drag operations
  - axios for HTTP requests
  - nodemailer for email functionality
  - uuid for unique identifiers

## 🏃‍♂️ Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/Desmet-Lars/Portfolio-Lars-Desmet.git
cd fluid
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory and add your environment variables:

```env
# Add your environment variables here
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Available Scripts

- `npm run dev` - Runs the development server
- `npm run build` - Builds the application for production
- `npm start` - Runs the production server
- `npm run lint` - Runs the linter

## 📁 Project Structure

```
fluid/
├── app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   ├── fonts/        # Custom fonts
│   └── globals.css   # Global styles
├── public/           # Static files
└── ...config files
```

## 🔧 Configuration

The project uses several configuration files:
- `next.config.mjs` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `jsconfig.json` - JavaScript configuration

