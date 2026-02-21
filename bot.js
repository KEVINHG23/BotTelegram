const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    // 1. SESIÓN PERSISTENTE: Guarda la conexión para que no pida QR siempre
    authStrategy: new LocalAuth({
        clientId: "bot-control-grupos" 
    }),
    puppeteer: {
        headless: true,
        // Argumentos necesarios para correr en servidores como Railway
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
        // Si Railway te da error de "Browser not found", descomenta la siguiente línea:
        // executablePath: '/usr/bin/chromium'
    }
});

// 2. GENERACIÓN DEL QR CON LINK DE EMERGENCIA
client.on('qr', qr => {
    console.log('-----------------------------------------------------');
    console.log('OPCIÓN 1: Abre este link para ver el QR perfecto:');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
    console.log('-----------------------------------------------------');
    console.log('OPCIÓN 2: Intenta escanear aquí (usa zoom pequeño si se ve mal):');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('¡BOT VINCULADO! Ya puedes cerrar todo, el bot trabajará 24/7.');
});

// 3. LÓGICA DE CONTROL DE GRUPO
client.on('message', async msg => {
    const text = msg.body.toLowerCase().trim();
    const chat = await msg.getChat();

    if (chat.isGroup) {
        const authorId = msg.author || msg.from;
        const participant = chat.participants.find(p => p.id._serialized === authorId);
        const isAdmin = participant ? (participant.isAdmin || participant.isSuperAdmin) : false;

        if (isAdmin) {
            // COMANDOS DE APERTURA
            if (text === "buenos dias" || text === "buenas tardes" || text === "buenas noches") {
                await chat.setMessagesAdminsOnly(false);
                await msg.reply('✅ *Acción de Admin:* El grupo ha sido ABIERTO. Ya pueden escribir.');
            }

            // COMANDO DE CIERRE
            if (text === "gracias por su atencion") {
                await chat.setMessagesAdminsOnly(true);
                await msg.reply('🚫 *Acción de Admin:* El grupo ha sido CERRADO. Solo admins pueden escribir.');
            }
        }
    }
});

client.initialize();