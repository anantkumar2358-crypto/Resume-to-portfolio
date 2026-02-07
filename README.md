# Resume-to-Portfolio Generator

An AI-powered tool that turns your GitHub profile and Resume into a professional portfolio website.

## Features
- **GitHub Integration**: Fetches repositories and profile data.
- **Resume Parsing**: Upload a PDF to extract experience.
- **AI Enhancement**: Uses Google Gemini to write professional project descriptions and bios.
- **Responsive UI**: Built with Next.js and Tailwind-like styling (Vanilla CSS).

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    - Rename `.env.local.example` to `.env.local`.
    - Add your `NEXT_PUBLIC_GEMINI_API_KEY`.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Usage
- Enter your GitHub username.
- (Optional) Upload a PDF resume.
- Click "Generate Portfolio".
