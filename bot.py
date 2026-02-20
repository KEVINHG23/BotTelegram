from flask import Flask, request
import requests

app = Flask(__name__)

VERIFY_TOKEN = "bot123"
TOKEN = "TU_ACCESS_TOKEN"
PHONE_NUMBER_ID = "TU_PHONE_NUMBER_ID"
ADMIN = "3311339673"

bot_activo = False


# ✅ VERIFICACION DE META (GET)
@app.route("/webhook", methods=["GET"])
def verify():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        return challenge, 200
    else:
        return "Error", 403


def enviar_mensaje(numero, mensaje):
    url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"

    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }

    data = {
        "messaging_product": "whatsapp",
        "to": numero,
        "type": "text",
        "text": {"body": mensaje}
    }

    requests.post(url, headers=headers, json=data)


# ✅ MENSAJES QUE LLEGAN
@app.route("/webhook", methods=["POST"])
def webhook():
    global bot_activo
    data = request.get_json()

    try:
        mensaje = data["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"]
        numero = data["entry"][0]["changes"][0]["value"]["messages"][0]["from"]

        # 🔥 IGNORA MAYUSCULAS O MINUSCULAS
        mensaje = mensaje.lower()

        if numero == ADMIN:

            if mensaje in ["buenos dias", "buenas tardes", "buenas noches"]:
                bot_activo = True
                enviar_mensaje(numero, "Grupo ABIERTO")

            elif "gracias por su atencion" in mensaje:
                bot_activo = False
                enviar_mensaje(numero, "Grupo CERRADO")

        if bot_activo:
            if "hola" in mensaje:
                enviar_mensaje(numero, "Bienvenido al grupo")

    except:
        pass

    return "ok", 200


app.run(host="0.0.0.0", port=10000)