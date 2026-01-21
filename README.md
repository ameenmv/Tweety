# Tweety – Social Media Platform

Tweety is a modern **social media platform** built with **Vue.js** on the frontend and a separate **Backend API** (developed collaboratively). The project focuses on clean architecture, scalability, and real-world social media features.

---

## Overview  

Tweety aims to provide a complete social media experience where users can:

* Create accounts and authenticate securely 
* Share posts and interact with others 
* Communicate in real time
* Receive notifications for important activities 
 
The project is designed to simulate a production-level application and follows best practices in frontend structure and API integration.

---

## Tech Stack

### Frontend

* **Vue.js 3**
* **Vite**
* **JavaScript (ES6+)**
* **CSS**
* **Vue Router** (Routing)
* **State Management** (planned / in progress)

### Backend

* Developed separately by a backend teammate
* RESTful API
* Authentication & Authorization
* Real-time services (planned)

---

## Features

### Authentication

* User registration (Sign Up)
* User login (Sign In)
* Secure authentication flow

### Posts

* Create posts
* Display posts in a feed
* Like posts
* Comment on posts

### Real-Time Features

* Real-time messaging (Chat system)
* Instant notifications for:

  * Likes
  * Comments
  * Messages

### Notifications

* In-app notifications
* Real-time updates

### Future Enhancements

* User profiles
* Follow / Unfollow system
* Media uploads (images & videos)
* Stories / reels-like features
* Privacy settings

---

## Project Structure

The project follows a modular and scalable structure:

* `src/`

  * `components/` – Reusable UI components
  * `views/` – Application pages
  * `router/` – Application routes
  * `api/` – API service handlers
  * `store/` – State management
  * `assets/` – Static assets

---

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/ameenmv/Tweety.git
```

2. Navigate to the project folder:

```bash
cd Tweety
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root directory and configure the required variables:

```env
VITE_API_BASE_URL=your_backend_api_url
```

---

## Contribution

This project is under active development. Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Open a pull request

---

## Status

The project is currently **in progress**. Core features like authentication and frontend structure are implemented, while backend integration and real-time features are under development.

---

## Author

**Ameen Mohammed**
Frontend Developer

---

## License

This project is for educational and portfolio purposes.
