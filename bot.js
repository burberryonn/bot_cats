import "dotenv/config";
import { Bot, Keyboard } from "grammy";
import axios from "axios";

// Инициализация бота
const bot = new Bot(process.env.BOT_API_KEY);

// Массив для хранения ID сообщений, отправленных ботом
let botMessages = [];

const keyboard = new Keyboard()
  .text("Котики")
  .row()
  .text("Собачки")
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
// Команда /restart

bot.command("", async (ctx) => {
  await ctx.reply("Бот перезапускается...");

  // Завершаем процесс
  process.exit(0); // Процесс будет завершён, а менеджер перезапустит его
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

// Обработчики нажатий на кнопки
bot.hears("Котики", async (ctx) => {
  await getCatImage(ctx);
});

bot.hears("Собачки", async (ctx) => {
  await getDogImage(ctx);
});

// Запуск бота
bot.start();
