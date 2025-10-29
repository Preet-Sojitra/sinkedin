# Sinkedin: Linkedin's Darker, Funnier and More Honest Cousin

## Technology Stack:

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel

## Contributing

We welcome contributions from the community! If you're interested in helping improve the project, please read our **[Contribution Guidelines](./CONTRIBUTING.md)** to get started with the development workflow, branching strategy, and commit conventions.

## Community

Join our Discord server to connect with other developers, ask questions, and stay up to date with the project.

[![Join our Discord](https://img.shields.io/badge/join-5865F2?logo=discord&logoColor=white&label=Join%20our%20Discord)](https://discord.gg/jaD2upCxhB)

# Local Development Setup

Welcome! We're excited that you're interested in contributing. This guide provides detailed instructions for setting up the project for local development.

## Table of Contents

- [Sinkedin: Linkedin's Darker, Funnier and More Honest Cousin](#sinkedin-linkedins-darker-funnier-and-more-honest-cousin)
  - [Technology Stack:](#technology-stack)
  - [Contributing](#contributing)
  - [Community](#community)
- [Local Development Setup](#local-development-setup)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Supabase Setup (Choose One)](#supabase-setup-choose-one)
    - [Option 1: Local Development with Supabase CLI (Recommended)](#option-1-local-development-with-supabase-cli-recommended)
    - [Option 2: Using a Hosted Supabase Project (Cloud)](#option-2-using-a-hosted-supabase-project-cloud)
  - [Environment Variables](#environment-variables)
  - [Optional: Setting up Google OAuth](#optional-setting-up-google-oauth)
  - [Running the Application](#running-the-application)
  - [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/installation) (or npm/yarn)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/) (required for Supabase CLI)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (required for Option 1)

## Getting Started

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    ```

2.  **Install Dependencies**

    We use `npm` or `pnpm` for package management.

    ```bash
    npm install
    ```

3.  **Create Environment File**

    Copy the sample environment file to create your local configuration. **Do not commit `.env.local` to version control.**

    ```bash
    cp .env.sample .env.local
    ```

    You will populate this file in the next steps.

## Supabase Setup (Choose One)

You need a Supabase instance for the backend. You can either run it locally using Docker or use a free project on the Supabase cloud.

---

### Option 1: Local Development with Supabase CLI (Recommended)

This is the recommended approach for most contributors as it's completely free and isolated on your machine.

1.  **Initialize Supabase**

    If this is your first time setting up the project, link your local repository to a new local Supabase project.

    ```bash
    # Run this from the root of the project directory
    npx supabase init
    ```

2.  **Start Supabase Services**

    This command uses Docker to start the local Supabase stack (Postgres database, GoTrue for auth, Storage, etc.).

    ```bash
    npx supabase start
    ```

    Once it's running, the CLI will output your local Supabase credentials. **Keep this terminal window open.**

    It will look something like this:

    ```plaintext
    Started Supabase local development setup.

            API URL: http://127.0.0.1:54321
         DB_URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
     Studio URL: http://127.0.0.1:54323
          JWT secret: your-super-secret-jwt-secret
          anon key: eyJhbGciOiJIUzI1Ni...
    service_role key: eyJhbGciOiJIUzI1Ni...
    ```

3.  **Apply Database Migrations**

    Our project's database schema is defined in the `supabase/migrations` folder. To apply these migrations to your local database, run:

    ```bash
    npx supabase db reset
    ```

    > **Note:** This command will completely wipe your local database and re-apply all migrations from the beginning. This is useful for starting fresh.

4.  **Set Up Storage Bucket (Manual Step)**

    You must manually create the storage bucket for user avatars.

    a. Open the Supabase Studio URL from the `supabase start` output (e.g., `http://127.0.0.1:54323`).

    b. In the left sidebar, click the **Storage** icon.

    c. Click **New bucket**.

    d. Name the bucket `avatars`.

    e. Toggle the **Public bucket** switch to **ON**.

    f. Click **Create bucket**.

    Now, proceed to the [Environment Variables](#environment-variables) section to fill in your `.env.local` file with the keys from step 2.

---

### Option 2: Using a Hosted Supabase Project (Cloud)

This option is useful if you cannot run Docker or prefer a cloud instance.

1.  **Create a Supabase Project**

    a. Go to [supabase.com](https://supabase.com/) and sign in.

    b. On your dashboard, click **New project**.

    c. Choose your organization, give your project a name, generate a secure database password (and save it!), and select a region.

    d. Click **Create new project**.

2.  **Apply Database Migrations**

    Since you are not using the CLI, you must apply the database schema manually.

    a. In your Supabase project dashboard, navigate to the **SQL Editor** (icon looks like `<>`).

    b. In your code editor, open the `supabase/migrations` directory.

    c. For **each** SQL file in that directory, in chronological order (the filenames start with a timestamp), copy the entire content of the file.

    d. Paste the SQL content into the Supabase SQL Editor and click **RUN**.

    e. Repeat for all migration files.

3.  **Set Up Storage Bucket (Manual Step)**

    a. In your Supabase project dashboard, click the **Storage** icon in the left sidebar.

    b. Click **New bucket**.

    c. Name the bucket `avatars`.

    d. Toggle the **Public bucket** switch to **ON**.

    e. Click **Create bucket**.

4.  **Get API Credentials**

    a. In your Supabase project dashboard, go to **Project Settings** (the gear icon).

    b. In the sidebar, click **API**.

    c. You will find your **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`), **anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), and **service_role secret key** (`SUPABASE_SECRET_KEY`).

    Now, proceed to the [Environment Variables](#environment-variables) section.

---

## Environment Variables

Open your `.env.local` file and populate it with the credentials you obtained from either the CLI or the cloud dashboard.

```env
# Get this from your Supabase project's API settings (or `supabase start` output)
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"

# Get this from your Supabase project's API settings (or `supabase start` output)
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# Get this from your Supabase project's API settings (or `supabase start` output)
# Use the `service_role` key here
SUPABASE_SECRET_KEY="YOUR_SUPABASE_SECRET_KEY"

# These are for Google OAuth. Leave blank if not working on this feature.
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=""
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=""

# Keep this as "false" as it is for logging vercel analytics only.
# This is not used in local development.
# If you want to enable analytics, set it to "true" in production.
NEXT_PUBLIC_ENABLE_ANALYTICS="false"

# The base URL of your local Next.js app
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# This URL points to your public 'avatars' bucket.
# It is constructed as: {YOUR_SUPABASE_URL}/storage/v1/object/public/avatars/**
# Example for local CLI: http://127.0.0.1:54321/storage/v1/object/public/avatars/**
# Example for cloud: https://xyz.supabase.co/storage/v1/object/public/avatars/**
SUPABASE_AVATARS_URL="YOUR_SUPABASE_URL/storage/v1/object/public/avatars/**"
```

## Optional: Setting up Google OAuth

You only need to complete this section if you are specifically developing or testing the Google Sign-In functionality.

1.  **Create Google Cloud Credentials**

    a. Go to the [Google Cloud Console](https://console.cloud.google.com/).

    b. Create a new project or select an existing one.

    c. Navigate to **APIs & Services -> Credentials**.

    d. Click **+ CREATE CREDENTIALS** and select **OAuth client ID**.

    e. If prompted, configure the **OAuth consent screen** first. Choose **External** and fill in the required app information. Add your email to the **Test users** section.

    f. For the **Application type**, select **Web application**.

    g. Under **Authorized redirect URIs**, click **+ ADD URI**. Add the following URL, replacing `YOUR_PROJECT_REF` with your Supabase project reference ID (e.g., `abcdefg` from `abcdefg.supabase.co`):
    - **Cloud:** `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
    - **Local CLI:** `http://127.0.0.1:54321/auth/v1/callback`

    h. Click **CREATE**. You will be given a **Client ID** and a **Client Secret**.

2.  **Update Environment File**

    Add the credentials to your `.env.local` file:

    ```env
    SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
    ```

3.  **Configure Supabase Provider**

    a. Go to your Supabase dashboard (local or cloud).

    b. Navigate to **Authentication -> Providers**.

    c. Find **Google** in the list and enable it.

    d. Copy the **Client ID** and **Client Secret** from your `.env.local` file into the corresponding fields.

    e. Click **Save**.

## Running the Application

Once your environment is configured, you can start the Next.js development server.

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Troubleshooting

- **Error `fetch failed`:** This usually means your Next.js app cannot connect to the Supabase API.
  - Double-check that the `NEXT_PUBLIC_SUPABASE_URL` in your `.env.local` is correct.
  - If using the CLI, ensure the Docker containers are running (`supabase status`).
  - Restart the Next.js dev server after any changes to `.env.local`.
- **Google Sign-In Error `redirect_uri_mismatch`:** The **Authorized redirect URI** in your Google Cloud Console does not exactly match the one required by Supabase. Verify the URL is correct for your local or cloud instance.
- **Database Issues:** If your local database gets into a bad state, the easiest fix is to run `supabase db reset`. Be aware this will delete all local data.
