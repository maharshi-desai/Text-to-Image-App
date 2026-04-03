# AI Text-to-Image Generator 🎨✨

A modern, responsive, and minimalist web application that generates high-quality images from text descriptions using the power of Generative AI. 

> **Note:** This project was developed as a college assignment focusing on Frontend Development, API Integration, and modern Web UI/UX design principles.

---

## 🚀 Features

- **Text-to-Image Generation:** Transform any descriptive text prompt into a stunning visual image in seconds.
- **Powered by FLUX.1 (Hugging Face):** Utilizes the `black-forest-labs/FLUX.1-schnell` model via the Hugging Face Inference API for fast and highly accurate image generation.
- **Modern UI/UX:** Built with a premium "glassmorphism" aesthetic, animated background gradients, and smooth loading states.
- **Real-Time Status Indicators:** Visual feedback and progress tracking while the AI model loads and generates the image.
- **Responsive Design:** Fully fluid layout that works seamlessly across desktop, tablet, and mobile devices.
- **One-Click Download:** Save the generated creations directly to your local device.

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Vanilla CSS (CSS3 with Flexbox, CSS Variables, and Animations)
- **API Integration:** Hugging Face Inference API (Fetch API)

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v16.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A **Hugging Face API Token** (You can generate one for free by creating an account at [Hugging Face](https://huggingface.co/))

## ⚙️ Local Setup and Installation

Follow these steps to run the application on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maharshi-desai/Text-to-Image-App.git
   cd Text-to-Image-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a file named `.env` in the root directory.
   - Add your Hugging Face API token in the following format:
     ```env
     VITE_HF_TOKEN=your_hugging_face_token_here
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to see the app in action!

## 💡 How it Works

1. **Proxy Server:** The Vite development server is configured with a proxy (`/hf-api`) to securely route requests to the Hugging Face router, bypassing complex Cross-Origin Resource Sharing (CORS) restrictions.
2. **Retry Logic:** If the AI model is "asleep" or warming up, the application intercepts the HTTP 503 error, waits the estimated time provided by the API, and smartly retries the request without failing abruptly.
3. **Blob Conversion:** Once the AI responds with an image blob, the React frontend converts it into a structured `Object URL` and dynamically renders the image frame.

## 🎓 College Project Context

This application was developed to demonstrate practical understanding of key web development concepts:
- Handling asynchronous JavaScript operations (`Promises`, `async/await`).
- Managing complex React component states (`useState`).
- Implementing graceful error handling and retry mechanisms.
- Securing API tokens using environment variables (`.env`).
- Writing clean, modular, and maintainable styles without relying on heavy external UI frameworks.

---

*Designed and developed by Maharshi Desai.*
