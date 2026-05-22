import type { APIRoute } from "astro";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const company = String(body.company || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return json({ ok: false, error: "Faltan campos obligatorios." }, 400);
    }

    const apiKey = import.meta.env.BREVO_API_KEY;
    const senderEmail = import.meta.env.BREVO_SENDER_EMAIL;
    const receiverEmail = import.meta.env.BREVO_RECEIVER_EMAIL;
    const listId = import.meta.env.BREVO_LIST_ID;

    if (!apiKey || !senderEmail || !receiverEmail) {
      return json({ ok: false, error: "Configuración incompleta." }, 500);
    }

    if (listId) {
      const contactResponse = await fetch(BREVO_CONTACTS_URL, {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: name,
            COMPANY: company || undefined,
          },
          listIds: [Number(listId)],
          updateEnabled: true,
        }),
      });

      if (!contactResponse.ok) {
        console.warn("Brevo contact sync failed:", await contactResponse.text());
      }
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company || "No indicada");
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    const htmlContent = `
      <h2>Nueva consulta desde el portfolio</h2>
      <p><strong>Nombre:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Empresa:</strong> ${safeCompany}</p>
      <hr />
      <p><strong>Mensaje:</strong></p>
      <p>${safeMessage}</p>
    `;

    const brevoResponse = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Portfolio Diego Pulido",
          email: senderEmail,
        },
        to: [
          {
            email: receiverEmail,
            name: "Diego Pulido",
          },
        ],
        replyTo: {
          email,
          name,
        },
        subject: `Nueva consulta desde portfolio — ${name}`,
        htmlContent,
      }),
    });

    if (!brevoResponse.ok) {
      console.error("Brevo email failed:", await brevoResponse.text());
      return json({ ok: false, error: "Brevo no pudo enviar el email." }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return json({ ok: false, error: "Error inesperado." }, 500);
  }
};