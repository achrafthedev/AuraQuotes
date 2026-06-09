# ✨ AuraQuotes: Premium Random Quote Generator

[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

AuraQuotes is a modern, high-fidelity random quote generator web application. Crafted with vanilla web technologies, it boasts premium glassmorphic visual aesthetics, multi-theme capability, text-to-speech reading, local/online dual modes, canvas image downloading, and an off-canvas drawer to save liked quotes.

Fully containerized and optimized with Nginx for sub-second delivery.

---

## 📸 Key Features

- **🎨 Multi-Theme Color Engine**: Switch between 6 handcrafted design themes (Aurora, Sunset, Cosmic, Emerald, Sleek Dark, Clean Light) with animated fluid gradient backdrops.
- **⚡ Dual Source Modes**:
  - **Local Database**: Instantly access over 100 hand-picked quotes offline across categories.
  - **Online API**: Connect directly to the QuoteSlate API with zero rate-limit blocks and automatic local backup fallbacks.
- **🏷️ Category Filtering**: Categorize quotes dynamically by *Inspirational*, *Wisdom*, *Life*, *Success*, *Technology*, and *Humor*.
- **🎙️ Text-to-Speech (TTS)**: Let the browser read quotes aloud with realistic voice modulation.
- **💾 Image Card Generator (Canvas)**: Render your current quote, author, and watermark onto a beautiful 1080x1080 social media image and download it instantly.
- **❤️ Favorites Drawer**: Keep track of liked quotes. Search, copy, and delete saved quotes directly from a sleek slide-in sidebar drawer backed by `localStorage` persistence.
- **🐳 Dockerized**: Packaged inside an Nginx-powered Alpine container for production-ready speeds, utilizing Gzip and security headers.

---

## 🛠️ Project Structure

```text
AuraQuotes/
├── index.html          # Main HTML structure & layouts
├── style.css           # Glassmorphism & custom variables theme system
├── script.js           # Core state management & canvas layout drawing
├── quotes.js           # Offline fallback quote dataset (~120 quotes)
├── Dockerfile          # Alpine Nginx container builder
├── docker-compose.yml  # Docker Compose configuration (mapping port 8085)
├── nginx.conf          # Optimized Nginx config with compression & security headers
└── README.md           # Developer documentation
```

---

## 🚀 How to Run the Project

You can run AuraQuotes in two simple ways: directly in the browser or via Docker.

### Option A: Local Running (No Setup Required)

Since the project uses vanilla web technologies and includes a local database script loading mechanism, you can simply clone the repo and open it:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/achrafthedev/AuraQuotes.git
   cd AuraQuotes
   ```
2. **Open the App**:
   - Double-click the `index.html` file to run it in your default web browser instantly.

---

### Option B: Docker Containerized (Recommended)

Run the containerized application on a production-like local web server:

1. **Build and Run with Docker Compose**:
   ```bash
   docker compose up -d --build
   ```
2. **Access the Application**:
   - Open your browser and navigate to: **[http://localhost:8085](http://localhost:8085)**
3. **Stop the container**:
   ```bash
   docker compose down
   ```

---

## ⚙️ Nginx Configuration Optimizations

Inside the Docker image, Nginx has been customized via `nginx.conf` to deliver top performance:
- **Gzip Compression**: Compresses HTML, CSS, JS, and XML assets dynamically.
- **Security Headers**: Custom-tailored headers (`X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy` restriction rules, `Referrer-Policy`) to block unauthorized cross-site tracking or framing.
- **Caching Policies**: Implements aggressive 1-year cache expires for static assets (`.css`, `.js`, `.png`, etc.) to minimize payload loading overheads.

---

## 🖊️ License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute this project as you wish.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## 📧 Contact

- **GitHub**: [@achrafthedev](https://github.com/achrafthedev)

*Give a 🌟 on GitHub if you found this project helpful!*
