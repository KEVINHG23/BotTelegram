const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "bot-control-grupos" }),
    puppeteer: {
        headless: true,
        // Esta línea es la magia: busca la variable de Railway automáticamente
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
        ],
    }
});

client.on('qr', qr => {
    console.log('--- LINK DE EMERGENCIA PARA EL QR ---');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('--- BOT EN LÍNEA Y VINCULADO ---');
});

client.on('message', async msg => {
    try {
        const text = msg.body.toLowerCase().trim();
        const chat = await msg.getChat();

        if (chat.isGroup) {
            const authorId = msg.author || msg.from;
            const participant = chat.participants.find(p => p.id._serialized === authorId);
            const isAdmin = participant ? (participant.isAdmin || participant.isSuperAdmin) : false;

            if (isAdmin) {
                if (text.includes("buenos dias") || text.includes("buenas tardes") || text.includes("buenas noches")) {
                    await chat.setMessagesAdminsOnly(false);
                    await msg.reply('☀️ Grupo abierto para todos.');
                }

                if (text.includes("gracias por su atencion")) {
                    await chat.setMessagesAdminsOnly(true);
                    await msg.reply('🌙 Grupo cerrado (solo admins).');
                }
            }
        }
    } catch (e) {
        console.log("Error leyendo mensaje: ", e);
    }
});

client.initialize();