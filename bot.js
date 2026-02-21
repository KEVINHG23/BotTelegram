const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializamos el cliente
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        headless: true, // Siempre headless en servidor
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    }
});

// Genera QR en consola
client.on('qr', qr => {
    console.log("ESCANEA EL QR 👇");
    qrcode.generate(qr, { small: true });
});

// Mensaje cuando el bot está listo
client.on('ready', () => {
    console.log('✅ BOT LISTO 24/7');
});

// Escucha mensajes en grupos
client.on('message', async msg => {
    const chat = await msg.getChat();

    if (!chat.isGroup) return; // Ignora chats privados

    const texto = msg.body.toLowerCase().trim();

    // 🔓 ABRIR GRUPO
    if (texto.includes("buenos dias") ||
        texto.includes("buenas tardes") ||
        texto.includes("buenas noches")) {
        try {
            await chat.setMessagesAdminsOnly(false);
            msg.reply("🔓 Grupo abierto");
        } catch (error) {
            console.error("Error al abrir grupo:", error);
        }
    }

    // 🔒 CERRAR GRUPO
    if (texto.includes("gracias por su atencion")) {
        try {
            await chat.setMessagesAdminsOnly(true);
            msg.reply("🔒 Grupo cerrado");
        } catch (error) {
            console.error("Error al cerrar grupo:", error);
        }
    }
});

// Inicializamos el cliente
client.initialize();