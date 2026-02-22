const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// --- CONFIGURACIÓN DE TU BOT ---
const CLAVE_SECRETA = "777"; // Cambia esta clave si quieres
// -------------------------------

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "sesion-principal" }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--disable-gpu'
        ],
        executablePath: '/usr/bin/chromium'
    }
});

client.on('qr', qr => {
    console.log('--- NUEVO QR (ESCANEALO RÁPIDO) ---');
    console.log(`LINK: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ BOT 100% ACTIVO Y LISTO');
});

client.on('message', async msg => {
    const text = msg.body.toLowerCase().trim();
    const chat = await msg.getChat();

    // COMANDO DE PRUEBA: Escribe ".hola" para saber si el bot está vivo
    if (text === ".hola") {
        await msg.reply("👋 ¡Hola! Estoy activo y escuchando.");
        return;
    }

    if (chat.isGroup) {
        // APERTURA: "buenos dias 777"
        if (text.includes("buenos dias") && text.includes(CLAVE_SECRETA)) {
            try {
                await chat.setMessagesAdminsOnly(false);
                await msg.reply('☀️ *GRUPO ABIERTO* (Comando correcto)');
            } catch (e) {
                await msg.reply('❌ Error: ¿Me hiciste administrador del grupo?');
            }
        }

        // CIERRE: "gracias por su atencion 777"
        if (text.includes("gracias por su atencion") && text.includes(CLAVE_SECRETA)) {
            try {
                await chat.setMessagesAdminsOnly(true);
                await msg.reply('🌙 *GRUPO CERRADO* (Comando correcto)');
            } catch (e) {
                await msg.reply('❌ Error: Asegúrate de que el bot sea administrador.');
            }
        }
    }
});

client.initialize();