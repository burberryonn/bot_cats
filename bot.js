import "dotenv/config";
import { Bot, Keyboard } from "grammy";
import axios from "axios";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.CHAT_GPT_API_KEY });

const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "write a haiku about ai" }],
});

console.log(completion);

// Инициализация бота
const bot = new Bot(process.env.BOT_API_KEY);

// Массив для хранения ID сообщений, отправленных ботом
let botMessages = [];

const keyboard = new Keyboard()
  .text("Котики")
  .row()
  .text("Собачки")
  .row()
  .text("Очистить чат") // Кнопка для очистки чата
  .row()
  .resized()
  .persistent();

// Команда /start
bot.command("start", async (ctx) => {
  const message = await ctx.reply("Добро пожаловать! Используйте меню ниже.", {
    reply_markup: keyboard,
  });

  // Сохраняем ID сообщения, отправленного ботом
  botMessages.push(message.message_id);
});

// Функция для получения изображения котика
async function getCatImage(ctx) {
  try {
    const response = await axios.get(
      "https://api.thecatapi.com/v1/images/search"
    );
    const catImageUrl = response.data[0].url;
    const message = await ctx.replyWithPhoto(catImageUrl);

    // Сохраняем ID сообщения, отправленного ботом
    botMessages.push(message.message_id);
  } catch (error) {
    console.error("Ошибка получения изображения:", error);
    await ctx.reply(
      "Произошла ошибка при получении изображения котика. Попробуйте позже."
    );
  }
}

// Функция для получения изображения собаки
async function getDogImage(ctx) {
  try {
    const response = await axios.get(
      "https://api.thedogapi.com/v1/images/search"
    );
    const dogImageUrl = response.data[0].url;
    const message = await ctx.replyWithPhoto(dogImageUrl);

    // Сохраняем ID сообщения, отправленного ботом
    botMessages.push(message.message_id);
  } catch (error) {
    console.error("Ошибка получения изображения:", error);
    await ctx.reply(
      "Произошла ошибка при получении изображения собаки. Попробуйте позже."
    );
  }
}

// Функция для очистки чата (удаляет только сообщения бота)
async function clearChat(ctx) {
  const chatId = ctx.chat.id;

  for (const messageId of botMessages) {
    try {
      await ctx.api.deleteMessage(chatId, messageId.message_id);
    } catch (error) {
      console.error("Не удалось удалить сообщение:", error);
    }
  }

  // Очищаем массив после удаления
  botMessages = [];
  await ctx.reply("Чат был очищен!");
}

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });

// Обработчики нажатий на кнопки
bot.hears("Котики", async (ctx) => {
  await getCatImage(ctx);
});

bot.hears("Собачки", async (ctx) => {
  await getDogImage(ctx);
});

bot.hears("Очистить чат", async (ctx) => {
  await clearChat(ctx);
});

// Запуск бота
bot.start();
