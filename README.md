# 🔍 CodeCritic - AI Code Review Assistant

CodeCritic is a modern, responsive React frontend that provides instant AI-powered feedback on your code. It features a sleek dark-mode interface, animated UI components, and connects to a dual-backend architecture (Java + Python LLM) to analyze code quality and suggest fixes.

## 🔗 Related Repositories
This frontend is part of a larger full-stack application. You can find the source code for the backends here:
* **[Java Routing Backend](https://github.com/BikiBaishya03/codeCriticBackend)** - Handles API routing and business logic.
* **[Python AI Backend](https://github.com/BikiBaishya03/CodeCriticPython)** - Handles the LLM inference and code analysis.

## ✨ Features
* **Sleek Dark UI:** A premium, modern dark mode interface with soft elevation shadows and gradients.
* **Animated Feedback:** Features a custom SVG Score Ring that dynamically animates based on the AI's rating.
* **Skeleton Loaders:** Smooth loading states prevent layout shifts while waiting for the AI response.
* **Responsive Design:** Fully responsive grid layout that adapts flawlessly to desktop, tablet, and mobile screens.
* **Quick Actions:** Keyboard shortcuts (`Ctrl + Enter`) for rapid submissions and one-click "Copy" for suggested fixes.

## 🛠️ Tech Stack
* **Frontend:** React (JSX), pure standard CSS (No external CSS frameworks required)
* **Primary Backend:** Java (Spring Boot)
* **AI Backend:** Python (FastAPI/Flask)

---

## 🚀 Getting Started

Follow these steps to get the frontend running on your local machine.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Clone the repository and install the dependencies:

```bash
git clone [https://github.com/yourusername/codecritic-frontend.git](https://github.com/BikiBaishya03/CodeCriticFrontend)
cd CodeCriticFrontend
npm install