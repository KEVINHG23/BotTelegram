const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "bot-final" }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process' // Esto ahorra mucha RAM
        ]
    }
});

client.on('qr', qr => {
    // Solo imprimimos el link para no saturar la consola de Render
    console.log('--- LINK QR ---');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
    console.log('----------------');
});

client.on('ready', () => {
    console.log('✅ BOT ONLINE');
});

client.on('message', async msg => {
    try {
        const text = msg.body.toLowerCase().trim();
        const chat = await msg.getChat();
        const CLAVE = "777"; 

        if (chat.isGroup && text.includes(CLAVE)) {
            if (text.includes("buenos dias")) {
                await chat.setMessagesAdminsOnly(false);
                await msg.reply('🔓 Abierto');
            }
            if (text.includes("gracias por su atencion")) {
                await chat.setMessagesAdminsOnly(true);
                await msg.reply('🔒 Cerrado');
            }
        }
    } catch (e) {
        console.log("Error de ejecución");
    }
});

client.initialize();