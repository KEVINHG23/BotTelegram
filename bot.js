const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    console.log('ESCANEAME CON TU CELULAR:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('¡Bot en línea y vigilando el grupo!');
});

client.on('message', async msg => {
    const text = msg.body.toLowerCase(); // Ignora mayúsculas
    const chat = await msg.getChat();

    if (chat.isGroup) {
        // Verificar si quien escribe es Admin
        const authorId = msg.author || msg.from;
        const isAdmin = chat.participants.find(p => p.id._serialized === authorId)?.isAdmin;

        if (isAdmin) {
            // COMANDOS DE APERTURA
            if (text.includes("buenos dias") || text.includes("buenas tardes") || text.includes("buenas noches")) {
                await chat.setMessagesAdminsOnly(false);
                await msg.reply('☀️ *Grupo Abierto.* ¡Ya pueden escribir todos!');
            }

            // COMANDO DE CIERRE
            if (text.includes("gracias por su atencion")) {
                await chat.setMessagesAdminsOnly(true);
                await msg.reply('🌙 *Grupo Cerrado.* Solo administradores pueden escribir ahora.');
            }
        }
    }
});

client.initialize();