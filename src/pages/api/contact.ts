import type { APIRoute } from "astro";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const company = String(body.company || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ ok: false, error: "Faltan campos obligatorios." }),
        { status: 400 },
      );
    }

    const apiKey = import.meta.env.BREVO_API_KEY;
    const senderEmail = import.meta.env.BREVO_SENDER_EMAIL;
    const receiverEmail = import.meta.env.BREVO_RECEIVER_EMAIL;
    const listId = import.meta.env.BREVO_LIST_ID;

    if (!apiKey || !senderEmail || !receiverEmail) {
      return new Response(
        JSON.stringify({ ok: false, error: "Configuración incompleta." }),
        { status: 500 },
      );
    }

    if (listId) {
      await fetch(BREVO_CONTACTS_URL, {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: name,
            COMPANY: company,
          },
          listIds: [Number(listId)],
          updateEnabled: true,
        }),
      });
    }

    const htmlContent = `
      <h2>Nueva consulta desde el portfolio</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Empresa:</strong> ${company || "No indicada"}</p>
      <hr />
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
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
      return new Response(
        JSON.stringify({ ok: false, error: "Brevo no pudo enviar el email." }),
        { status: 502 },
      );
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Error inesperado." }),
      { status: 500 },
    );
  }
};