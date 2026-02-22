from telegram import Update, ChatPermissions
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes

TOKEN = "8473066554:AAEQvU7HYnkDgfd52_vUcgvz5kFsAwnS68c"
ADMIN_ID = 8133854334  # tu id de telegram

async def manejar(update: Update, context: ContextTypes.DEFAULT_TYPE):
    texto = update.message.text.lower()
    user_id = update.message.from_user.id
    chat_id = update.message.chat.id

    if user_id != ADMIN_ID:
        return

    if texto in ["buenos dias", "buenas tardes", "buenas noches"]:
        permisos = ChatPermissions(can_send_messages=True)
        await context.bot.set_chat_permissions(chat_id, permisos)
        await update.message.reply_text("Grupo abierto.")

    if texto == "gracias por su atencion":
        permisos = ChatPermissions(can_send_messages=False)
        await context.bot.set_chat_permissions(chat_id, permisos)
        await update.message.reply_text("Grupo cerrado.")

app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(MessageHandler(filters.TEXT, manejar))
app.run_polling()