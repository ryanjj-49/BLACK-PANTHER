<div align="center">

# 🐾 BLACK PANTHER MD 🐾

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&pause=1000&color=9B59B6&center=true&vCenter=true&width=600&lines=BLACK+PANTHER+MD;Ultimate+WhatsApp+Bot;Fast+%7C+Powerful+%7C+Reliable" alt="Typing SVG" />

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/koyoteh/BLACK-PANTHER?style=for-the-badge&logo=github&color=9B59B6&labelColor=0D0D0D)](https://github.com/koyoteh/BLACK-PANTHER/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/koyoteh/BLACK-PANTHER?style=for-the-badge&logo=github&color=8E44AD&labelColor=0D0D0D)](https://github.com/koyoteh/BLACK-PANTHER/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/koyoteh/BLACK-PANTHER?style=for-the-badge&logo=github&color=6C3483&labelColor=0D0D0D)](https://github.com/koyoteh/BLACK-PANTHER/issues)
[![License](https://img.shields.io/badge/LICENSE-MIT-9B59B6?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=0D0D0D)](LICENSE)
[![Author](https://img.shields.io/badge/AUTHOR-KOYOTEH-8E44AD?style=for-the-badge&logo=github&logoColor=white&labelColor=0D0D0D)](https://github.com/koyoteh)

<br/>

> **⚡ A sleek, powerful multi-device WhatsApp bot — built to dominate.**

</div>

---

## ✨ Features

<div align="center">

| 🤖 AI Integration | 🎮 Games | 🛡️ Group Tools | 📥 Downloaders |
|:---:|:---:|:---:|:---:|
| Smart chat bot | TicTacToe, Dice | Anti-link, Anti-spam | YouTube, TikTok |

| 🎵 Media | 🔒 Security | ⏰ Scheduler | 🌐 Multi-lang |
|:---:|:---:|:---:|:---:|
| Stickers, Audio | View-once guard | Daily greetings | Translate support |

</div>

---

## 🚀 Quick Setup

### 1️⃣ Fork the Repository

[![Fork Repo](https://img.shields.io/badge/FORK%20REPO-9B59B6?style=for-the-badge&logo=github&logoColor=white)](https://github.com/koyoteh/BLACK-PANTHER/fork)
[![Download ZIP](https://img.shields.io/badge/DOWNLOAD%20ZIP-8E44AD?style=for-the-badge&logo=github&logoColor=white)](https://github.com/koyoteh/BLACK-PANTHER/archive/refs/heads/main.zip)

### 2️⃣ Get Your SESSION ID

Choose one method to link your WhatsApp:

[![Pair Code](https://img.shields.io/badge/PAIR%20CODE-9B59B6?style=for-the-badge&logo=whatsapp&logoColor=white)](https://pantherr-session.onrender.com/pair)
[![QR Code](https://img.shields.io/badge/SCAN%20QR%20CODE-6C3483?style=for-the-badge&logo=qrcode&logoColor=white)](https://pantherr-session.onrender.com/qr)

> 💡 *Tip: You can host your own pairing page — see `/guru/pair.html` and `/guru/pairing.js`.*

### 3️⃣ Set Environment Variables

```env
SESSION_ID=your_session_id_here
MODE=public
OWNER_NAME=YourName
TIME_ZONE=Africa/Nairobi
```

---

## ☁️ Deployment

<div align="center">

### Heroku

[![Deploy to Heroku](https://img.shields.io/badge/DEPLOY%20TO%20HEROKU-430098?style=for-the-badge&logo=heroku&logoColor=white)](https://heroku.com/deploy?template=https://github.com/koyoteh/BLACK-PANTHER)

### KataBump

[![Deploy on KataBump](https://img.shields.io/badge/DEPLOY%20ON%20KATABUMP-9B59B6?style=for-the-badge&logo=rocket&logoColor=white)](https://dashboard.katabump.com/auth/login)

### VPS / Termux / Local

```bash
git clone https://github.com/koyoteh/BLACK-PANTHER.git
cd BLACK-PANTHER
npm install
npm start
```

### Replit

[![Run on Replit](https://img.shields.io/badge/RUN%20ON%20REPLIT-8E44AD?style=for-the-badge&logo=replit&logoColor=white)](https://replit.com)

</div>

---

## 🛠️ Tech Stack

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Baileys](https://img.shields.io/badge/Baileys-7.0.0-9B59B6?style=flat-square&logo=whatsapp&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=flat-square&logo=ffmpeg&logoColor=white)

</div>

---

## 📁 Project Structure

```
BLACK-PANTHER/
├── guru/               # Core bot engine
│   ├── connection/     # WebSocket & group event handlers
│   ├── database/       # SQLite database modules
│   ├── config.js       # Environment config loader
│   └── index.js        # Main export hub
├── guruh/              # Feature plugins
│   ├── ai.js           # AI / chatbot
│   ├── downloader.js   # Media downloaders
│   ├── games.js        # Mini-games
│   └── ...             # 30+ plugin modules
├── index.js            # Bot entry point
└── package.json
```

---

## ⚙️ Configuration

| Variable | Description | Default |
|---|---|---|
| `SESSION_ID` | WhatsApp session token | **Required** |
| `MODE` | `public` or `private` | `public` |
| `OWNER_NAME` | Your display name | `Koyoteh` |
| `TIME_ZONE` | Your timezone | `Africa/Nairobi` |
| `DATABASE_URL` | PostgreSQL URL (optional) | SQLite fallback |
| `EXPIRY_DATE` | Bot expiry date `YYYY-MM-DD` | None |

---

## 🌐 Connect

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-koyoteh-9B59B6?style=for-the-badge&logo=github&logoColor=white)](https://github.com/koyoteh)
[![Issues](https://img.shields.io/badge/Report%20Bug-Issues-8E44AD?style=for-the-badge&logo=github&logoColor=white)](https://github.com/koyoteh/BLACK-PANTHER/issues)
[![Stars](https://img.shields.io/badge/⭐%20Star%20This%20Repo-9B59B6?style=for-the-badge)](https://github.com/koyoteh/BLACK-PANTHER/stargazers)

</div>

---

<div align="center">

**Built with 🐾 by [KOYOTEH](https://github.com/koyoteh)**

*BLACK PANTHER MD — silent, swift, unstoppable.*

</div>
