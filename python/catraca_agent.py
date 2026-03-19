import requests
import time
import json
import os
from datetime import datetime

# Configurações
API_URL = "http://localhost:3000/api/access/verify"
UNIT_ID = "gfteam_matriz" # Exemplo
CHECK_INTERVAL = 0.5 # Segundos

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

class CatracaAgent:
    def __init__(self):
        self.active = True
        log("Agente FacilGate Iniciado. Aguardando conexão...")

    def verify_access(self, identifier, method="qr"):
        """
        Consulta a API do SaaS para verificar se o aluno pode entrar.
        identifier: pode ser o ID do aluno, QR Code ou Token Facial
        """
        try:
            response = requests.post(API_URL, json={
                "tenantId": UNIT_ID,
                "identifier": identifier,
                "method": method
            })
            if response.status_code == 200:
                data = response.json()
                if data.get("allowed"):
                    self.unlock_turnstile(data.get("studentName"))
                else:
                    self.block_turnstile(data.get("reason"))
            else:
                log(f"Erro na API: {response.status_code}")
        except Exception as e:
            log(f"Erro de conexão: {e}")

    def unlock_turnstile(self, name):
        log(f"✅ ACESSO LIBERADO: {name}")
        # Aqui enviamos o comando real para o hardware (TCP/UDP ou Serial)
        # Exemplo para FacilGate: Socket para IP da catraca comando 'OPEN'
        # Por enquanto, simulamos o sucesso.

    def block_turnstile(self, reason):
        log(f"❌ ACESSO NEGADO: {reason}")
        # Comando para exibir mensagem de erro no display da catraca

    def run(self):
        log("Pronto para receber leituras (QR/Face/Biometria)...")
        # Loop principal que ficaria ouvindo o sensor da catraca
        while self.active:
            # Simulação: No mundo real, isso viria do Serial ou Hook de Rede
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    agent = CatracaAgent()
    # Para teste, simulamos uma leitura após 3 segundos
    time.sleep(3)
    agent.verify_access("student_123", method="qr")
