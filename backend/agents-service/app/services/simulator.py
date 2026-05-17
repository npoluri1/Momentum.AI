import random
import time

class SystemicRiskSimulator:
    def __init__(self):
        self.energy_load = 100
        self.factory_output = 100

    def get_stream(self):
        self.energy_load += random.uniform(-2, 2)
        if random.random() < 0.05:
            self.energy_load += 20
        
        if self.energy_load > 110:
            self.factory_output -= 5
        else:
            self.factory_output = min(100, self.factory_output + 2)

        return {
            "timestamp": time.time(),
            "energy_grid": {"load": round(self.energy_load, 2)},
            "manufacturing": {"output": round(self.factory_output, 2)}
        }
