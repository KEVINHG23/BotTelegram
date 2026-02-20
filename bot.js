const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('BOT LISTO 24/7');
});

client.on('message', async msg => {

    let chat = await msg.getChat();

    if (!chat.isGroup) return;

    let texto = msg.body.toLowerCase();

    if (texto.includes("buenos dias") ||
        texto.includes("buenas tardes") ||
        texto.includes("buenas noches")) {

        await chat.setMessagesAdminsOnly(false);
        msg.reply("🔓 Grupo abierto");
    }

    if (texto.includes("gracias por su atencion")) {

        await chat.setMessagesAdminsOnly(true);
        msg.reply("🔒 Grupo cerrado");
    }
});

client.initialize();