# Mesh Circular Shift Visualizer

An interactive web application that simulates and visualizes the **circular q-shift** operation on a **2D mesh topology**. Built for Parallel & Distributed Computing coursework.

## 🚀 Live Demo

🔗 **[Live Deployment URL]** — *(to be added after deployment)*

## 📖 Overview

In parallel computing, a **circular q-shift** is a permutation where node `i` transfers its data to node `(i + q) mod p`. On a 2D mesh, this decomposes into two efficient stages:

1. **Stage 1 (Row Shift):** Each node shifts within its row by `q mod √p` positions
2. **Stage 2 (Column Shift):** Each node shifts within its column by `⌊q / √p⌋` positions

This application lets you configure, animate, and compare the mesh approach against a naive ring topology.

## ✨ Features

- **Input Controls** — Select nodes `p` (4–64, perfect squares) and shift `q` (1 to p−1) with validation
- **Animated Grid** — Watch row and column shifts with smooth CSS animations and directional arrows
- **Before/After States** — See the data at each stage: initial → after row shift → final
- **Complexity Panel** — Real-time formula display, bar chart comparison of Mesh vs Ring steps
- **Speed Control** — Adjust animation speed from 0.5× to 3×
- **Responsive Design** — Works on desktop and mobile

## 🛠️ Tech Stack

- **React** (Vite)
- **Vanilla CSS** with custom animations
- **Pure JavaScript** shift algorithms

## 📁 Project Structure

```
mesh-shift-visualizer/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── MeshGrid.jsx       ← grid rendering + animation
│   │   ├── MeshGrid.css
│   │   ├── ControlPanel.jsx   ← user inputs
│   │   ├── ControlPanel.css
│   │   ├── ComplexityPanel.jsx ← analysis panel
│   │   └── ComplexityPanel.css
│   ├── utils/
│   │   └── shiftLogic.js      ← pure shift algorithm (testable)
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── index.html
├── README.md
├── package.json
└── vite.config.js
```

## 🏃 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdurRafayBaig/Mesh-Circular-Shift-Visualizer.git
cd Mesh-Circular-Shift-Visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## 📊 Algorithm

### Formulas

| Metric | Formula |
|--------|---------|
| Row Shift | `q mod √p` |
| Column Shift | `⌊q / √p⌋` |
| **Mesh Steps** | `(q mod √p) + ⌊q / √p⌋` |
| **Ring Steps** | `min(q, p − q)` |

### Example: p = 16, q = 5

- √p = 4
- Row shift = 5 mod 4 = **1**
- Column shift = ⌊5/4⌋ = **1**
- Mesh steps = 1 + 1 = **2**
- Ring steps = min(5, 11) = **5**
- **Mesh is 60% more efficient!**

## 🚀 Deployment

This app can be deployed on **Vercel** or **Netlify**:

1. Push code to a public GitHub repository
2. Connect the repo to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

## 📄 License

MIT
