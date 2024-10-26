# Contributing to Lynai

Thank you for your interest in contributing to Lynai! We're excited to have you join our project. This guide will help you get started with contributing to both the frontend and backend of our application.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Setting Up the Development Environment](#setting-up-the-development-environment)
3. [Contributing to the Frontend](#contributing-to-the-frontend)
4. [Contributing to the Backend](#contributing-to-the-backend)
5. [Code Style and Guidelines](#code-style-and-guidelines)
6. [Submitting Pull Requests](#submitting-pull-requests)

## Project Structure

Lynai is divided into two main parts:

- Frontend: A Next.js application
- Backend: A FastAPI application

## Setting Up the Development Environment

### Frontend Setup

1. Navigate to the `FrontEnd` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the `Backend` directory
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

## Contributing to the Frontend

The frontend is built with Next.js and uses various UI components from the `shadcn/ui` library. Here are some key points to keep in mind:

1. The main application logic is in `FrontEnd/app/page.tsx` and `FrontEnd/app/chat-room/[roomId]/page.tsx`.
2. UI components are located in the `FrontEnd/components/ui` directory.
3. API calls are centralized in `FrontEnd/lib/api.ts`.
4. Styles are managed using Tailwind CSS.

When contributing to the frontend:

- Follow the existing component structure and naming conventions.
- Use the provided UI components from `shadcn/ui` when possible.
- Ensure your changes are responsive and accessible.

## Contributing to the Backend

The backend is a FastAPI application with SQLite database integration. Key points:

1. Currently, all backend code is located in `Backend/main.py`. This will be refactored in the future for better organization and maintainability.
2. In upcoming updates, the code will be properly routed and distributed across multiple files for improved structure.
3. Database models and schemas will be moved to separate files (e.g., `Backend/models.py`, `Backend/schemas.py`).
4. Utility functions will be relocated to `Backend/utils.py`.
5. API routes will be organized into different files based on functionality.

When contributing to the backend:

- Be aware that the current structure is temporary and will be reorganized.
- Follow RESTful API design principles.
- Implement proper error handling and input validation.
- Write unit tests for new endpoints or functionality.
- When adding new features, consider how they might fit into the planned restructured architecture.


The backend is a FastAPI application with SQLite database integration. Key points:

1. The main application logic is in `Backend/main.py`.
2. Database models and schemas are defined in separate files (`Backend/models.py`).
3. Utility functions are located in `Backend/utils.py`.

When contributing to the backend:

- Follow RESTful API design principles.
- Implement proper error handling and input validation.
- Write unit tests for new endpoints or functionality.

## Code Style and Guidelines

### Frontend

- Use TypeScript for type safety.
- Follow the [JavaScript Standard Style](https://standardjs.com/).
- Use functional components and hooks for React development.

### Backend

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide for Python code.
- Use type hints in Python functions.
- Write docstrings for functions and classes.

## Submitting Pull Requests

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Make sure your code lints.
5. Issue that pull request!

Please provide a clear description of the changes and the reasoning behind them in your pull request.

Thank you for contributing to Lynai!
