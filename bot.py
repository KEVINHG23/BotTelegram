from flask import Flask, request, jsonify

app = Flask(__name__)

activo = False
numero_admin = "3311339673"
VERIFY_TOKEN = "12345"

@app.route("/", methods=["GET"])
def home():
    return "Bot WhatsApp activo"

# Verificacion de Meta
@app.route("/webhook", methods=["GET"])
def verificar():
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if token == VERIFY_TOKEN:
        return challenge
    return "Error"

# Recibir mensajes
@app.route("/webhook", methods=["POST"])
def webhook():
    global activo
    
    data = request.json
    
    try:
        mensaje = data["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"].lower()
        numero = data["entry"][0]["changes"][0]["value"]["messages"][0]["from"]

        if numero == numero_admin:
            if "buenos dias" in mensaje or "buenas tardes" in mensaje or "buenas noches" in mensaje:
                activo = True
            
            if "gracias por su atencion" in mensaje:
                activo = False

        print("Mensaje:", mensaje)
        print("Activo:", activo)

    except:
        pass

    return "ok"

app.run(host="0.0.0.0", port=5000)