# Zoho Sprints AI Chatbot

A conversational AI assistant for Zoho Sprints that helps you manage your sprints, tasks, and team with natural language.  
Built with Next.js, Vercel AI SDK, and Zoho Sprints REST APIs.

---

## ✨ Features

- 🔐 **Zoho OAuth login**
- 🚀 **Automatic detection of:**
  - Current active sprint
  - Logged-in sprint user ID
  - Tasks assigned to the user
- 💬 **Conversational chat** using OpenAI (gpt-4o-mini)
- 🧠 **Tool-calling** for smart actions based on user queries
- 👥 **Ask about other users** in your sprint
- 🗂️ **Contextual memory** for chat continuity
- ⚙️ **Powered by:**
  - Vercel AI SDK (React + Node)
  - Next.js App Router
  - Zoho Sprints REST APIs

---

## 🚀 Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/yourusername/zoho-sprints-bot.git
cd zoho-sprints-bot
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Configure environment variables**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

#### `.env` variables:

| Variable                   | Description                   |
| -------------------------- | ----------------------------- |
| NEXT_PUBLIC_REDIRECT_URL   | Your app's OAuth redirect URL |
| NEXT_PUBLIC_ZOHO_CLIENT_ID | Zoho OAuth client ID          |
| ZOHO_CLIENT_SECRET         | Zoho OAuth client secret      |
| ZOHO_SPRINT_TEAM_ID        | Your Zoho Sprints Team ID     |
| ZOHO_SPRINT_PROJECT_ID     | Your Zoho Sprints Project ID  |
| OPENAI_API_KEY             | OpenAI API key (for chat)     |

---

## 📝 How to get Zoho OAuth credentials

1. **Register your app in the [Zoho API Console](https://api-console.zoho.com/):**

   - Click **Add Client**.
   - Choose **Server-based Applications**.
   - Set the **Redirect URI** to match `NEXT_PUBLIC_REDIRECT_URL` in your `.env`.
   - After creation, copy the **Client ID** and **Client Secret** into your `.env`.

2. **Find your Team ID and Project ID:**
   - Go to [Zoho Sprints](https://sprints.zoho.com/) and open your project.
   - Click on your project, then go to **Settings**.
   - You will find the **Team ID** and **Project ID** in the URL or under project/team settings.

---

## 🧑‍💻 Development

Start the development server:

```bash
npm run dev
```
