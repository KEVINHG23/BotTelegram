const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// --- AJUSTES DEL BOT ---
const CLAVE_SECRETA = "777"; 

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "sesion-unificada"
    }),
    puppeteer: {
        headless: true,
        // IMPORTANTE: Dejamos esto vacío para que Puppeteer use su propio ejecutable descargado
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote'
        ]
    }
});

// Generar el QR con el Link de emergencia
client.on('qr', qr => {
    console.log('--- LINK PARA ESCANEAR (COPIA Y PEGA EN TU NAVEGADOR) ---');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
    console.log('-------------------------------------------------------');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ ¡SISTEMA CONECTADO Y VIGILANDO!');
});

client.on('message', async msg => {
    try {
        const text = msg.body.toLowerCase().trim();
        const chat = await msg.getChat();

        // Comando de prueba rápida
        if (text === ".test") {
            await msg.reply("🚀 El bot está respondiendo correctamente.");
        }

        if (chat.isGroup && text.includes(CLAVE_SECRETA)) {
            // ABRIR GRUPO
            if (text.includes("buenos dias")) {
                await chat.setMessagesAdminsOnly(false);
                await msg.reply('🔓 *Bot:* Grupo ABIERTO.');
            }
            // CERRAR GRUPO
            if (text.includes("gracias por su atencion")) {
                await chat.setMessagesAdminsOnly(true);
                await msg.reply('🔒 *Bot:* Grupo CERRADO.');
            }
        }
    } catch (err) {
        console.error('Error procesando mensaje:', err);
    }
});

client.initialize();