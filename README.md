# Rate My Bite

https://project-9-server.vercel.app/

## 🍔 Overview

Rate My Bite API is the backend service for a platform where users can discover, post, and review street food spots. The API handles user authentication, food post management, premium subscriptions, voting, commenting, and admin operations.

## ✨ Features

- **Authentication System**
  - User registration and login
  - JWT-based authentication
  - Password hashing and security

- **Food Post Management**
  - Create, read, update, and delete food posts
  - Post approval workflow
  - Premium content management

- **User Roles & Permissions**
  - Normal users
  - Premium subscribers
  - Admin users with moderation capabilities

- **Subscription System**
  - Payment gateway integration (ShurjoPay)
  - Premium content access management
  - Subscription status tracking

- **Interaction Features**
  - Voting system (upvote/downvote)
  - Commenting and rating system
  - Content moderation

- **Search & Filtering**
  - Search by title, category
  - Filter by price range, popularity, rating

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Payment**: ShurjoPay
- **Validation**: Zod

## 📋 Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

## Getting Started

Follow these steps to set up and run the project locally.

## 1. Clone the Repository

```bash
git clone https://github.com/Al-amin07/project-9-server
```

## 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

   ```bash
   cd project-9-server
   npm install
   ```

## 3. Set Up Environment Variables
Create a .env file in the root of the project to store environment variables, such as MongoDB URI or any secret keys. Here’s an example:
```bash
DATABASE_URL="postgresql://assignment9_user:SD20uZIrGCasfsdfsdfsdCfTtZHnjlpr0qhOsyJRVBh@dpg-d0d4v1a4d50c73efcid0-a.oregon-postgres.render.com/assignment9"
NODE_ENV=development
PORT=5000

JWT_ACCESS_SECRET=sdgsdgsdgjsdd
JWT_ACCESS_EXPIRES_IN=10d
JWT_REFRESH_SECRET=sdgsdgsdgjsddzlsdvsdl
JWT_REFRESH_EXPIRES_IN=30d

#Reset Credentials
RESET_SECRET_KEY=dvddvbdbbd
RESET_EXPIRES_IN=10m

WEBSITE_URL=http://localhost:3000

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME="dlfhckrea"
CLOUDINARY_API_KEY="644791sgsdfg924825471"
CLOUDINARY_API_SECRET="YMX0_dfbdbhdOXpkSSzhaoNmwceNx7wiIU"

# Email Configuration
SENDER_EMAIL="alsujon2001@gmail.com"
SENDER_APP_PASS="jshu txhb ckth heio"

SP_ENDPOINT=https://sandbox.shurjopayment.com/
SP_USERNAME=sp_sandbox
SP_PASSWORD=pyyk97hu&6fvdsddu6
SP_PREFIX=SP
SP_RETURN_URL=http://localhost:3000/payment/verify

# SSLCommerz Payment Info
# STORE_NAME="teststore"
# PAYMENT_API="https://sandbox.sslcommerz.com/gwprocess/v3/api.php"
# VALIDATION_API="https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
# STORE_ID="<your_store_id>"
# STORE_PASSWORD="<your_store_password>"
# VALIDATION_URL="<your_validation_url>"
# SUCCESS_URL="<your_success_url>"
# FAILED_URL="<your_failed_url>"
# CANCEL_URL="<your_cancel_url>"

```

## 4. Run the Project
- **Development Mode**
To start the project in development mode with hot reloading:
```bash
npm run dev
```
- **Production Mode**
If you prefer to run the project in production mode:
```bash
npm run build
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

If you have any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).
