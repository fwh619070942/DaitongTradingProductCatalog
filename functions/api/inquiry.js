const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://fwh619070942.github.io",
  "https://daitongtrading.com",
  "https://www.daitongtrading.com",
];

function getAllowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = getAllowedOrigins(env);
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function jsonResponse(request, env, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request, env),
      "Content-Type": "application/json",
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildEmailHtml(data) {
  const productLines = Array.isArray(data.selectedProducts)
    ? data.selectedProducts.map((product) => {
        const sku = escapeHtml(product.sku || "");
        const title = escapeHtml(product.title || "");
        const category = escapeHtml(product.category || "");

        return `<li><strong>${sku}</strong> - ${title} <span style="color:#64748b">(${category})</span></li>`;
      })
    : [];

  return `
    <h2>New Quote Request</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone || "Not provided")}</p>
    <p><strong>Notes:</strong></p>
    <p>${escapeHtml(data.notes || "No custom requirements provided.").replaceAll("\n", "<br>")}</p>
    <h3>Selected Products</h3>
    <ul>${productLines.join("") || "<li>No products listed.</li>"}</ul>
  `;
}

function buildEmailText(data) {
  const productSummary =
    data.selectedProductSummary ||
    (Array.isArray(data.selectedProducts)
      ? data.selectedProducts.map((product) => `${product.sku} - ${product.title} (${product.category})`).join("\n")
      : "No products listed.");

  return [
    "New Quote Request",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    "",
    "Notes:",
    data.notes || "No custom requirements provided.",
    "",
    "Selected Products:",
    productSummary,
  ].join("\n");
}

async function sendInquiry(request, env) {
  if (!env.RESEND_API_KEY) {
    return jsonResponse(request, env, { error: "Email service is not configured." }, 500);
  }

  const data = await request.json();

  if (data.company) {
    return jsonResponse(request, env, { ok: true });
  }

  if (!data.name || !data.email) {
    return jsonResponse(request, env, { error: "Name and email are required." }, 400);
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.INQUIRY_FROM_EMAIL || "Daitong Trading <onboarding@resend.dev>",
      to: [env.INQUIRY_TO_EMAIL || "daitongtrading@gmail.com"],
      reply_to: data.email,
      subject: data.subject || `New quote request from ${data.name}`,
      html: buildEmailHtml(data),
      text: buildEmailText(data),
    }),
  });

  if (!response.ok) {
    return jsonResponse(request, env, { error: "Email delivery failed." }, 502);
  }

  return jsonResponse(request, env, { ok: true });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(request, env) });
  }

  if (request.method !== "POST") {
    return jsonResponse(request, env, { error: "Method not allowed." }, 405);
  }

  try {
    return await sendInquiry(request, env);
  } catch {
    return jsonResponse(request, env, { error: "Invalid inquiry request." }, 400);
  }
}
