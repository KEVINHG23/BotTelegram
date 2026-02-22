const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "bot-control-grupos" }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
            '--no-zygote', '--single-process', '--disable-gpu'
        ],
        executablePath: '/usr/bin/chromium' // Forzado para Railway
    }
});

client.on('ready', () => {
    console.log('--- EL BOT ESTÁ VIVO Y ESCUCHANDO ---');
});

client.on('message', async msg => {
    const chat = await msg.getChat();
    const text = msg.body.toLowerCase().trim();
    
    // ESTO SALDRÁ EN RAILWAY: Te dirá qué mensaje llegó y de quién
    console.log(`Mensaje recibido: "${text}" en el chat: ${chat.name}`);

    if (chat.isGroup) {
        const authorId = msg.author || msg.from;
        
        // Obtenemos la lista de admins actualizada
        const participant = chat.participants.find(p => p.id._serialized === authorId);
        const isAdmin = participant ? (participant.isAdmin || participant.isSuperAdmin) : false;

        console.log(`¿El que escribió es admin?: ${isAdmin}`);

        if (isAdmin) {
            // COMANDOS (Usamos .includes para que sea más fácil de detectar)
            if (text.includes("buenos dias") || text.includes("buenas tardes") || text.includes("buenas noches")) {
                console.log('Intentando abrir grupo...');
                await chat.setMessagesAdminsOnly(false);
                await msg.reply('✅ *Acción de Admin:* El grupo ha sido ABIERTO.');
            }

            if (text.includes("gracias por su atencion")) {
                console.log('Intentando cerrar grupo...');
                await chat.setMessagesAdminsOnly(true);
                await msg.reply('🚫 *Acción de Admin:* El grupo ha sido CERRADO.');
            }
        }
    }
});

client.initialize();