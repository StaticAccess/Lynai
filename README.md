# Lynai
![Lynai Logo](/img/temp.png)
Lynai is a secure, open-source chat application built with Python and Next.js. It allows users to join password-protected chat rooms via sharable links without account creation. The app prioritizes privacy and security, featuring end-to-end encryption, anonymous access, and automatic chat clearing.



**Note: This project is currently in the initial development phase with basic functionality. A full working version will be deployed after completion.**

## Features

- Sharable Link for Chat Sessions: Join chat sessions using a unique sharable link, similar to Google Meet.
- Password-Protected Rooms: Set a password for secure access to chat rooms.
- No Account Creation Needed: Join a chat with just the link and password.
- Anonymous Access: Participate in chat sessions without revealing your identity.
- End-to-End Encryption: All chats are encrypted to ensure privacy and secure communication.
- Automatic Chat Clearing: Conversations are automatically removed from the server after the chat session ends.
- Downloadable Chat History: Download the chat log before it's cleared from the server.



## How to Use

1. Generate a Unique Link
   - Open Lynai and click on "Create Chat"
   - Set a password for your chat room
   - Click "Generate Chat Link"
   
   ![Generate Link](/img/1.png)

2. Share with Friends
   - Copy the generated link
   - Share it with the people you want to chat with
   
   ![Share Link](/img/2.png)

3. Join Room
   - Paste the link in your browser or click on it
   - Enter the password provided by the room creator
   - Click "Join Chat"
   
   ![Join Room](/img/3.png)

4. Chat and Close Room
   - Start chatting with your friends
   - When finished, the room creator can close the room
   - All messages will be automatically deleted
   
   ![Chat Interface](/img/4.png)

## Tech Stack

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="Tailwind CSS" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" alt="FastAPI" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" alt="SQLite" width="50" height="50"/>
</div>

- Frontend: React, Next.js, Tailwind CSS
- Backend: FastAPI, SQLAlchemy
- Database: SQLite3

## How to Run Locally

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd FrontEnd
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd Backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

The backend API will be available at `http://localhost:8000`.

## Usage

After starting both the frontend and backend servers, you can access the application by opening a web browser and navigating to `http://localhost:3000`.

## Contributing

We welcome contributions to Lynai! Please feel free to submit issues, fork the repository and send pull requests. For more information on how to contribute, please see our [Contributing Guide](CONTRIBUTING.md).

## License

This project is licensed under the MIT License.
