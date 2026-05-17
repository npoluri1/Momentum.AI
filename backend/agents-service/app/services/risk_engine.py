from app.services.simulator import SystemicRiskSimulator

class RiskEngine:
    def __init__(self):
        self.simulator = SystemicRiskSimulator()
        self.task_queue = []

    def check_systemic_risk(self):
        data = self.simulator.get_stream()
        risks = []
        
        # Anomaly detection logic
        if data["energy_grid"]["load"] > 115:
            risk = {
                "severity": "CRITICAL",
                "message": f"Energy grid instability detected (Load: {data['energy_grid']['load']}%). Impact on manufacturing imminent."
            }
            risks.append(risk)
            self.auto_create_task(risk)
            
        if data["manufacturing"]["output"] < 90:
            risk = {
                "severity": "WARNING",
                "message": f"Manufacturing output drop (Output: {data['manufacturing']['output']}%). Correlated with energy instability."
            }
            risks.append(risk)
            self.auto_create_task(risk)

        return {
            "data": data,
            "risks": risks,
            "tasks": self.task_queue[-5:] # return last 5 tasks
        }

    def auto_create_task(self, risk):
        task = {
            "id": len(self.task_queue) + 1,
            "title": f"Agent Response: {risk['severity']} Alert",
            "description": risk['message'],
            "status": "In Progress"
        }
        self.task_queue.append(task)
