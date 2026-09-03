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

By default, quote requests are sent through FormSubmit's AJAX endpoint to:

```text
daitongtrading@gmail.com
```

The first live submission may trigger a confirmation email from FormSubmit. Open that email and confirm the address to activate delivery.

To override the endpoint, set a Formspree or compatible endpoint in `.env.local`:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

EmailJS placeholder values are included in the inquiry payload:

```bash
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key
```

The payload includes the sender name, email, phone number, notes, and a SKU/title/category list of selected products.
