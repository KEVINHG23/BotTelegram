const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "bot-control-grupos"
    }),
    puppeteer: {
        headless: true,
        // Ruta típica en Railway con nixpacks + chromium instalado
        executablePath: '/nix/store/*/bin/chromium',  // el * se expande al hash de nix
        // Alternativa si lo de arriba falla: prueba '/usr/bin/chromium-browser'
        ignoreHTTPSErrors: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process',
            '--disable-software-rasterizer',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-extensions',
            '--disable-infobars',
            '--window-size=1280,800'
        ]
    }
});

client.on('qr', qr => {
    console.log('--- ESCANEA ESTE QR PARA CONECTAR EL BOT ---');
    console.log('Opción 1 (link para móvil o PC):');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
    console.log('\nOpción 2 (QR en consola):');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ BOT CONECTADO CORRECTAMENTE Y VIGILANDO GRUPOS!');
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
                    await msg.reply('✅ *Acción de Admin:* Grupo ABIERTO para todos.');
                }

                if (text.includes("gracias por su atencion")) {
                    await chat.setMessagesAdminsOnly(true);
                    await msg.reply('🚫 *Acción de Admin:* Grupo CERRADO (solo admins).');
                }
            }
        }
    } catch (err) {
        console.error('Error procesando mensaje:', err.message);
    }
});

client.on('auth_failure', () => {
    console.log('❌ Falló la autenticación - borra la carpeta .wwebjs_auth y vuelve a escanear QR');
});

client.on('disconnected', (reason) => {
    console.log('Desconectado:', reason);
});

client.initialize()
    .then(() => console.log('Inicialización del cliente iniciada...'))
    .catch(err => console.error('Error al inicializar:', err));