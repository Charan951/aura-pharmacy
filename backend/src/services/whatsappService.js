export const sendWhatsAppNotification = async (to, message) => {
  if (!to || !message) {
    return;
  }

  if (!process.env.WHATSAPP_WEBHOOK_URL) {
    return;
  }

  try {
    await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, message }),
    });
  } catch {
  }
};

