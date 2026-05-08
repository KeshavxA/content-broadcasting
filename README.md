# Content Broadcasting System

A premium, production-ready content broadcasting platform built with Next.js 16 (App Router), featuring robust authentication, role-based access control, and a scalable service architecture.

## 🚀 Key Features

- **Role-Based Dashboards**: Tailored experiences for Teachers (Content Management) and Principals (Moderation).
- **Secure Authentication**: Cookie-based session management with JWT simulation.
- **Broadcast Moderation**: Full approval workflow with mandatory rejection feedback.
- **Public Live Pages**: Unauthenticated access to active broadcasts with real-time polling.
- **Performance Optimized**: Handles large datasets (500+ items) with smart pagination and filtering.
- **Premium UI/UX**: Built with Tailwind CSS, Lucide icons, and Sonner notifications.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **API**: Axios with Request/Response Interceptors
- **State**: React Context API
- **Persistence**: js-cookie
- **Notifications**: Sonner

## 🏁 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/KeshavxA/content-broadcasting.git

# Install dependencies
npm install
```

### Development
```bash
# Run the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Teacher** | `teacher@test.com` | `password` |
| **Principal** | `principal@test.com` | `password` |

## 📁 Project Structure

Refer to `Frontend-notes.txt` for a detailed explanation of the folder structure and technical architecture.

## 🚢 Deployment (Vercel)

The easiest way to deploy this project is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Vercel will automatically detect Next.js and deploy your application.

---
Built by Keshav Sharmafor Educational Excellence.
