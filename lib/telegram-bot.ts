import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = "1779446679";

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

export const sendTelegramNotification = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  try {
    const telegramMessage = `
<b>New Contact Form Submission</b>

<b>Name:</b> ${name}
<b>Email:</b> ${email}
<b>Subject:</b> ${subject}
<b>Message:</b> ${message}
`;

    const result = await bot.sendMessage(CHAT_ID, telegramMessage, {
      parse_mode: "HTML",
    });
    console.log("@telegram_success", result);
    return result;
  } catch (error) {
    console.log("@telegram_error", error);
    throw error;
  }
};