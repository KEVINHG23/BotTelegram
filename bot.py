from flask import Flask, request

app = Flask(__name__)

# Ruta principall
@app.route('/')
def home():
    return "Bot WhatsApp activo"

# Webhook para WhatsApp
@app.route('/webhook', methods=['GET', 'POST'])
def webhook():
    if request.method == 'GET':
        token = request.args.get('hub.verify_token')
        challenge = request.args.get('hub.challenge')
        if token == "12345":
            return challenge
        return "Token incorrecto"
    elif request.method == 'POST':
        data = request.json
        print("Mensaje recibido:", data)
        return "ok"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)