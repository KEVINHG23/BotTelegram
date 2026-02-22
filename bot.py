import os
from telegram import Update, ChatPermissions
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes

# --------- CONFIGURACION ---------
TOKEN = "8473066554:AAFzMRlIZVP4ijgkSPahYtptaDr06lYWC7E"
ADMIN_ID = 8133854334  # tu id de telegram
PORT = int(os.environ.get("PORT", "8443"))  # Railway asigna el puerto
WEBHOOK_URL = f"https://bottelegram-production-826d.up.railway.app/{TOKEN}"

# --------- FUNCION PRINCIPAL ---------
async def manejar(update: Update, context: ContextTypes.DEFAULT_TYPE):
    texto = update.message.text.lower()
    user_id = update.message.from_user.id
    chat_id = update.message.chat.id

    if user_id != ADMIN_ID:
        return

    if texto in ["buenos dias", "buenas tardes", "buenas noches", "grupo abierto"]:
        permisos = ChatPermissions(can_send_messages=True)
        await context.bot.set_chat_permissions(chat_id, permisos)
        await update.message.reply_text("Grupo abierto. Solo ADMIN puede mandar mensajes.")

    if texto in ["gracias por su atencion", "grupo cerrado"]:
        permisos = ChatPermissions(can_send_messages=False)
        await context.bot.set_chat_permissions(chat_id, permisos)
        await update.message.reply_text("Grupo cerrado. Solo ADMIN puede mandar mensajes.")

# --------- CONSTRUCCION DE LA APP ---------
app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, manejar))

# --------- EJECUCION CON WEBHOOK ---------
app.run_webhook(
    listen="0.0.0.0",
    port=PORT,
    webhook_url=WEBHOOK_URL
)