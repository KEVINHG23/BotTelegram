import os
from telegram import Update, ChatPermissions
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes

TOKEN = os.getenv("TOKEN")
ADMIN_ID = 8133854334

async def manejar(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message:
        return

    texto = update.message.text.lower()
    user_id = update.message.from_user.id
    chat_id = update.message.chat.id

    if user_id != ADMIN_ID:
        return

    if texto in ["buenos dias", "buenas tardes", "buenas noches"]:
        permisos = ChatPermissions(can_send_messages=True)
        await context.bot.set_chat_permissions(chat_id, permisos)
        await update.message.reply_text("Grupo abierto.")

    elif texto == "grupo cerrado":
        permisos = ChatPermissions(can_send_messages=False)
        await context.bot.set_chat_permissions(chat_id, permisos)

        await context.bot.restrict_chat_member(
            chat_id=chat_id,
            user_id=ADMIN_ID,
            permissions=ChatPermissions(can_send_messages=True)
        )

        await update.message.reply_text("Grupo cerrado. Solo el administrador puede escribir.")

app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, manejar))

PORT = int(os.environ.get("PORT", 8000))
app.run_webhook(
    listen="0.0.0.0",
    port=PORT,
    webhook_url=os.environ.get("RAILWAY_STATIC_URL")
)