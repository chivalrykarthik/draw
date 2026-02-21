# D2 Draw — Professional Diagramming Tool

A **100% client-side** diagramming application powered by [D2](https://d2lang.com/) and WebAssembly. Write D2 code and instantly see your diagrams render — no backend, no data leaves your browser.

**Live Demo:** [https://chivalrykarthik.github.io/draw/](https://chivalrykarthik.github.io/draw/)

---

## ✨ Features

- **Real-Time Preview** — Diagrams render as you type with debounced WASM compilation
- **Monaco Editor** — Full code editor with line numbers, bracket matching, and word wrap
- **15 Built-in Templates** — Flow diagrams, sequence diagrams, architecture diagrams, CI/CD pipelines, Kubernetes clusters, state machines, and more
- **Dark & Light Themes** — Toggle between themes; auto-detects system preference and persists choice
- **Export** — Download diagrams as SVG (scalable vector) or PNG (high-res 2x)
- **Pan & Zoom** — Drag to pan, scroll to zoom, or use toolbar controls
- **Layout Engines** — Switch between ELK and Dagre layout algorithms
- **Code Persistence** — Your code is saved to localStorage automatically and survives page refresh
- **Quick Help** — Built-in D2 syntax reference, shape gallery, styling guide, and cheat sheets
- **Resizable Panels** — Drag the divider to adjust editor vs preview proportions
- **Keyboard Shortcuts** — `Ctrl+S` (prevents browser save), `Esc` (close modals)
- **Zero Server Dependency** — Everything runs in WebAssembly; works offline after initial load

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm

### Install & Run

```bash
git clone https://github.com/chivalrykarthik/draw.git
cd draw
npm install
npm run dev
```

Open [http://localhost:3000/draw/](http://localhost:3000/draw/) in your browser.

### Build for Production

```bash
npm run build
```

Output is in `dist/`, ready to deploy as static files.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 + TypeScript |
| Bundler | Vite 7 |
| Styling | Tailwind CSS 4 + CSS Custom Properties |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Diagram Engine | D2 via `@terrastruct/d2` (WASM) |
| Deployment | GitHub Pages (via GitHub Actions) |

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Root component, state orchestration
├── main.tsx                   # Entry point, providers
├── index.css                  # Theme tokens, animations, utilities
├── components/
│   ├── Header.tsx             # Tabs, templates, export, theme toggle
│   ├── EditorPanel.tsx        # Monaco editor + error display
│   ├── PreviewPanel.tsx       # SVG preview + pan/zoom + WASM loading
│   ├── Footer.tsx             # Layout engine toggle, status bar
│   ├── HelpModal.tsx          # Reference docs & cheat sheets
│   └── ErrorBoundary.tsx      # Crash recovery UI
├── hooks/
│   ├── useD2.ts               # WASM init, debounced compile, dedup
│   ├── usePanZoom.ts          # Pan/zoom with drag threshold
│   ├── useResizer.ts          # Draggable panel divider
│   └── useDropdown.ts         # Toggle + outside click dismiss
├── context/
│   └── ThemeContext.tsx        # Dark/light with localStorage sync
├── data/
│   ├── templates.ts           # 15 D2 diagram templates
│   └── helpData.ts            # Reference docs content
├── icons/
│   └── Icons.tsx              # SVG icon components
├── types/
│   └── index.ts               # TypeScript type definitions
└── utils/
    └── exportUtils.ts         # SVG/PNG download pipeline
```

---

## 📋 Available Templates

| Template | Type | Description |
|----------|------|-------------|
| Shapes & Styles | Flow | All D2 shapes and styling options |
| API Architecture | Architecture | Client → API → DB with styling |
| Microservices | Architecture | API gateway, services, data stores |
| Auth Flow | Sequence | OAuth 2.0 authentication sequence |
| Logic Flowchart | Flow | Decision-tree with error handling |
| AWS Architecture | Architecture | VPC, subnets, Lambda, DynamoDB |
| Database ERD | Flow | Entity relationships with SQL tables |
| Git Branching | Flow | GitFlow branching strategy |
| CI/CD Pipeline | Flow | Build → test → deploy pipeline |
| Kubernetes | Architecture | K8s cluster with pods & services |
| Event-Driven (CQRS) | Architecture | Command/query separation pattern |
| Order State Machine | Flow | Order lifecycle with state transitions |
| Network Topology | Architecture | Enterprise network with DMZ & zones |
| REST API Lifecycle | Sequence | Request lifecycle through middleware |
| Incident Response | Flow | Production incident workflow |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` / `Cmd+S` | Prevent browser save (code auto-saves to localStorage) |
| `Escape` | Close help modal & dropdowns |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
