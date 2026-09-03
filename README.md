# Product Catalog and Client Inquiry

Modern React, Vite, TypeScript, and Tailwind CSS catalog app with visitor inquiry flow and admin product/category management.

## Run

```bash
npm install
npm run dev
```

## Local Image Assets

Vite serves static files from `public/`. Product images placed in `public/images` are available in the browser as `/images/file-name.jpg`.

The prompt referenced:

```text
/Users/sihui/Documents/Daitong/Hats/gemini_web/图片 2048
```

On this machine, the matching folder is:

```text
/Users/sihui/Documents/Daitong/Hats/gemini_web/图片2048
```

To copy all JPG assets from the discovered folder:

```bash
mkdir -p public/images
cp "/Users/sihui/Documents/Daitong/Hats/gemini_web/图片2048/"*.jpg public/images/
```

If your folder really includes the space, use:

```bash
mkdir -p public/images
cp "/Users/sihui/Documents/Daitong/Hats/gemini_web/图片 2048/"*.jpg public/images/
```

The full 432-image source catalog has been copied into:

```text
public/images/catalog
```

For GitHub and browser performance, web-optimized copies are generated into:

```text
public/images/catalog-web
```

The app seeds one product per source image and references each optimized image as `/images/catalog-web/file-name.jpg`. Products are visually categorized into Bucket Hat, Outdoor Sun Hat, Baseball Cap, Visor, Kids Hat, Wide Brim Sun Hat, Fedora & Panama Hat, Cowboy Hat, and Mexican Sombrero.

When adding or editing a product, you can also type a filename like `Image_20260830205703_225_2_gemini_2048.jpg`; the app normalizes it to `/images/Image_20260830205703_225_2_gemini_2048.jpg`. For copied catalog files, use `/images/catalog-web/Image_20260830205703_225_2_gemini_2048.jpg`.

## Inquiry Submission

The inquiry form stays in the React app, but submissions should be delivered through a small Cloudflare backend so email keys are not exposed in browser code.

There are two supported Cloudflare setups:

- Cloudflare Pages: deploy this whole site to Cloudflare Pages and use the included `functions/api/inquiry.js` endpoint. The form can post to `/api/inquiry`.
- GitHub Pages plus Cloudflare Worker: keep GitHub Pages for the website and deploy the standalone Worker in `worker/`. The form should post to the Worker URL.

For GitHub Pages, set the public frontend endpoint before building:

```bash
VITE_INQUIRY_ENDPOINT=https://daitong-product-inquiry.daitongtrading.workers.dev
```

The Worker sends email through Resend. Add these Cloudflare variables/secrets:

```bash
RESEND_API_KEY=your-resend-api-key
INQUIRY_TO_EMAIL=daitongtrading@gmail.com
INQUIRY_FROM_EMAIL="Daitong Trading <onboarding@resend.dev>"
ALLOWED_ORIGINS=http://localhost:5173,https://fwh619070942.github.io
```

`RESEND_API_KEY` must be stored as a Cloudflare secret, not committed to the repo. The default `INQUIRY_FROM_EMAIL` uses Resend's onboarding sender for quick testing. For production, verify a sending domain in Resend and replace it with an address on that domain.

To deploy the standalone Worker after Cloudflare is connected:

```bash
npm run deploy:worker
```

For local testing, copy `worker/.dev.vars.example` to `worker/.dev.vars`, fill in `RESEND_API_KEY`, and run the Worker in a second terminal:

```bash
npm run dev:worker
```

Then set the local React app endpoint:

```bash
VITE_INQUIRY_ENDPOINT=http://localhost:8787
```

The payload includes the sender name, email, phone number, notes, and a SKU/title/category list of selected products. The email is sent to `daitongtrading@gmail.com`, and replies go to the customer's email address.
