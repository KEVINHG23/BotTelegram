const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "bot-control-grupos"
    }),
    puppeteer: {
        headless: true,
        // Eliminamos la ruta manual /usr/bin/chromium para que el sistema lo encuentre solo
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process'
        ]
    }
});

client.on('qr', qr => {
    console.log('--- OPCIÓN 1: LINK PARA EL QR ---');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
    console.log('--- OPCIÓN 2: QR EN CONSOLA ---');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('--- ¡BOT CONECTADO Y VIGILANDO! ---');
});

client.on('message', async msg => {
    try {
        const chat = await msg.getChat();
        const text = msg.body.toLowerCase().trim();

        if (chat.isGroup) {
            const authorId = msg.author || msg.from;
            const participant = chat.participants.find(p => p.id._serialized === authorId);
            const isAdmin = participant ? (participant.isAdmin || participant.isSuperAdmin) : false;

            if (isAdmin) {
                if (text.includes("buenos dias") || text.includes("buenas tardes") || text.includes("buenas noches")) {
                    await chat.setMessagesAdminsOnly(false);
                    await msg.reply('✅ *Acción de Admin:* Grupo abierto.');
                }

                if (text.includes("gracias por su atencion")) {
                    await chat.setMessagesAdminsOnly(true);
                    await msg.reply('🚫 *Acción de Admin:* Grupo cerrado.');
                }
            }
        }
    } catch (err) {
        console.error('Error en el bot:', err);
    }
});

client.initialize();