# RelayPay Voice Customer Support Interface

This project is a React/Vite web application that hosts a VAPI.ai powered voice assistant tailored for RelayPay. It implements a strict design system (Inter font, brand colors, no emojis or heavy gradients) and fully responsive layout.

## Setup Instructions

### 1. Configure Brand Assets
- Place the exact RelayPay logo file named `relaypay-logo.png` inside the `/public` folder.
- The `Header.jsx` component includes a placeholder that you can remove once the logo is placed.

### 2. Environment Variables
Create a `.env` file in the root of the project (you can use the provided `.env` template or the one that already exists) and add your specific VAPI keys:

```env
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
VITE_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
```
*(Get these keys from your VAPI Dashboard under Settings and Assistants respectively).*

### 3. Install Dependencies
Run the following command to make sure all React and VAPI SDK dependencies are installed:
```bash
npm install
```

### 4. Run Development Server
Start the Vite local development server:
```bash
npm run dev
```

## Features Complete
- Global state and Toast Notification System (stacking, auto-dismiss, brand aligned colors).
- Reusable UI layout with semantic HTML (`Header`, `SupportCard`, `Footer`).
- Voice Status indicator with micro-animations.
- Transcript display with auto-scroll and formatted timestamps.
- Stub logic for VAPI connection status and errors.
