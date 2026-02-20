from flask import Flask, request
import datetime

app = Flask(__name__)

activo = False
numero_admin = "3311339673"

@app.route("/mensaje", methods=["POST"])
def mensaje():
    global activo
    
    texto = request.json.get("texto", "").lower()
    numero = request.json.get("numero", "")
    
    # Activar
    if numero == numero_admin:
        if "buenos dias" in texto or "buenas tardes" in texto or "buenas noches" in texto:
            activo = True
            return "Bot activado"
        
        if "gracias por su atencion" in texto:
            activo = False
            return "Bot desactivado"
    
    if activo:
        if "hola" in texto:
            return "Hola, el bot esta activo"
    
    return "ok"

app.run(host="0.0.0.0", port=5000)