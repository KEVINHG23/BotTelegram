const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Eliminamos la ruta manual y dejamos solo los argumentos de compatibilidad
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', qr => {
    console.log('--- ESCANEA EL CÓDIGO QR ABAJO ---');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('¡Bot activado con éxito! Ya puedes cerrar la laptop.');
});

client.on('message', async msg => {
    const text = msg.body.toLowerCase().trim(); // Limpia espacios y pasa a minúsculas
    const chat = await msg.getChat();

    if (chat.isGroup) {
        // Obtenemos al emisor del mensaje
        const authorId = msg.author || msg.from;
        
        // Buscamos si el emisor es administrador
        const participant = chat.participants.find(p => p.id._serialized === authorId);
        const isAdmin = participant ? (participant.isAdmin || participant.isSuperAdmin) : false;

        if (isAdmin) {
            // COMANDOS DE APERTURA (Buenos días, tardes o noches)
            if (text === "buenos dias" || text === "buenas tardes" || text === "buenas noches") {
                await chat.setMessagesAdminsOnly(false);
                await msg.reply('✅ *Acción de Admin:* El grupo ha sido ABIERTO. Todos pueden escribir.');
            }

            // COMANDO DE CIERRE
            if (text === "gracias por su atencion") {
                await chat.setMessagesAdminsOnly(true);
                await msg.reply('🚫 *Acción de Admin:* El grupo ha sido CERRADO. Solo administradores pueden escribir.');
            }
        }
    }
});

client.initialize();