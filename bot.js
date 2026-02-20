const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: ['--no-sandbox','--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    console.log("ESCANEA EL QR 👇");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ BOT LISTO 24/7');
});

client.on('message', async msg => {

    const chat = await msg.getChat();

    if (!chat.isGroup) return;

    let texto = msg.body.toLowerCase().trim();

    // 🔓 ABRIR GRUPO
    if (
        texto.includes("buenos dias") ||
        texto.includes("buenas tardes") ||
        texto.includes("buenas noches")
    ) {
        await chat.setMessagesAdminsOnly(false);
        msg.reply("🔓 Grupo abierto");
    }

    // 🔒 CERRAR GRUPO
    if (texto.includes("gracias por su atencion")) {
        await chat.setMessagesAdminsOnly(true);
        msg.reply("🔒 Grupo cerrado");
    }

});

client.initialize();