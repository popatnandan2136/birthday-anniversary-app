# Fixing Firebase Storage CORS Error

If you are seeing errors like `Access to XMLHttpRequest at ... has been blocked by CORS policy`, follow these steps to fix it.

## Step 1: Install Firebase CLI (if not already installed)

Open your terminal and run:
```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

Run:
```bash
firebase login
```

## Step 3: Apply CORS Configuration

Run the following command in the root of your project:

```bash
gsutil cors set cors.json gs://birthday-anniversary-app-2136.firebasestorage.app
```

> [!NOTE]
> If you don't have `gsutil` installed, you can install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
> Alternatively, you can use the Firebase CLI if you have it configured, but `gsutil` is the standard way to set CORS for Cloud Storage.

### Why is this needed?
By default, Firebase Storage buckets do not allow cross-origin requests from web domains (like your Vercel URL). The `cors.json` file in your project tells Firebase to allow requests from specific origins, including your Vercel production URL.
