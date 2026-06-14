# Deploying the SPA to S3 (routing and refresh fix)

If you host the built site on an S3 bucket (static website hosting) you may see 404 / "file not found" errors when refreshing or navigating directly to a client-side route. S3 serves objects by key and doesn't know to serve `index.html` for client routes unless configured.

Recommended configuration:

- In the S3 bucket **Properties** → **Static website hosting**:
  - Set **Index document** to `index.html`
  - Set **Error document** to `index.html`

  Setting the error document to `index.html` makes S3 return your SPA shell (index.html) for unknown paths so the client router can handle them.

- If you are using CloudFront in front of the bucket:
  - Configure a custom error response for HTTP 403/404 that returns `/index.html` with HTTP 200.

- If you deploy via an automated pipeline, ensure the `dist/` folder contents (including `index.html` and assets) are uploaded preserving their filenames.

Notes about `.htaccess`:

- `.htaccess` works for Apache-based web servers (I added a basic `.htaccess` file to the repo root). S3 static hosting ignores `.htaccess`, so configuring the bucket as above is still required.

Troubleshooting:

- After configuring S3, open the console network tab and verify that refresh requests return `index.html` (200) and then the JS assets load.
- If you're using CloudFront, invalidate the cache or update behavior to forward all paths.
