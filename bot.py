from flask import Flask, request
import requests

app = Flask(__name__)

TOKEN = "TU_WHATSAPP_TOKEN"
ADMIN = "521XXXXXXXXXX"

bot_activo = False

def enviar_mensaje(numero, mensaje):
    url = "https://graph.facebook.com/v18.0/TU_PHONE_NUMBER_ID/messages"

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

@app.route("/webhook", methods=["POST"])
def webhook():
    global bot_activo

    data = request.get_json()

    try:
        mensaje = data["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"].lower()
        numero = data["entry"][0]["changes"][0]["value"]["messages"][0]["from"]

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

app.run(host="0.0.0.0", port=5000)