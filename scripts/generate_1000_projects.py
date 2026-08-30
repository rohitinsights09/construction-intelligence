import random
import datetime

# Seed for absolute reproducibility
random.seed(42)

types = ["Tunnel", "Dam", "Building", "Road", "Bridge"]
locations = ["Houston", "Seattle", "Los Angeles", "New York", "Chicago"]
weathers = ["Snowy", "Cloudy", "Sunny", "Rainy", "Stormy"]
risks = ["High", "Medium", "Low"]

start_base = datetime.date(2020, 1, 1)

rows = ["Project_ID,Project_Type,Location,Start_Date,End_Date,Planned_Cost,Actual_Cost,Cost_Overrun,Planned_Duration,Actual_Duration,Schedule_Deviation,Vibration_Level,Crack_Width,Load_Bearing_Capacity,Temperature,Humidity,Weather_Condition,Air_Quality_Index,Energy_Consumption,Material_Usage,Labor_Hours,Equipment_Utilization,Accident_Count,Safety_Risk_Score,Image_Analysis_Score,Anomaly_Detected,Completion_Percentage,Risk_Level"]

for i in range(1, 1001):
    pid = f"PJT_{i}"
    ptype = random.choice(types)
    loc = random.choice(locations)
    
    # Dates
    start_dt = start_base + datetime.timedelta(days=int((i-1)*0.98))
    planned_dur = random.randint(180, 900)
    dev = random.uniform(-80, 450)
    actual_dur = max(60, planned_dur + dev)
    end_dt = start_dt + datetime.timedelta(days=int(actual_dur))
    
    # Cost
    planned_cost = random.randint(1_000_000, 50_000_000)
    overrun_ratio = random.uniform(-0.15, 0.50)
    cost_overrun = planned_cost * overrun_ratio
    actual_cost = planned_cost + cost_overrun
    
    # Sensors & Environment
    vib = random.uniform(0.1, 2.0)
    crack = random.uniform(0.0, 5.0)
    load = random.uniform(50.0, 500.0)
    temp = random.uniform(-10.0, 45.0)
    hum = random.uniform(20.0, 90.0)
    weather = random.choice(weathers)
    aqi = random.randint(50, 300)
    
    # Resources
    energy = random.uniform(5000.0, 50000.0)
    material = random.uniform(100.0, 1000.0)
    labor = random.randint(1000, 10000)
    equip = random.uniform(40.0, 100.0)
    
    # Safety & Risk
    accidents = random.randint(0, 9)
    safety_score = random.uniform(1.0, 10.0)
    img_score = random.uniform(50.0, 100.0)
    anomaly = 1 if (random.random() < 0.22 or crack > 4.2 or safety_score > 8.5) else 0
    completion = random.uniform(10.0, 100.0)
    
    if cost_overrun > 5_000_000 or dev > 150 or safety_score > 7.0 or accidents >= 6:
        risk = "High"
    elif cost_overrun > 500_000 or dev > 30 or safety_score > 4.0:
        risk = "Medium"
    else:
        risk = "Low"
        
    row = f"{pid},{ptype},{loc},{start_dt.isoformat()},{end_dt.isoformat()},{planned_cost},{actual_cost:.2f},{cost_overrun:.2f},{planned_dur},{actual_dur:.2f},{dev:.2f},{vib:.4f},{crack:.4f},{load:.2f},{temp:.2f},{hum:.2f},{weather},{aqi},{energy:.2f},{material:.2f},{labor},{equip:.2f},{accidents},{safety_score:.2f},{img_score:.2f},{anomaly},{completion:.2f},{risk}"
    rows.append(row)

with open("public/data/bim_construction_dataset.csv", "w") as f:
    f.write("\n".join(rows) + "\n")

print(f"Successfully generated {len(rows)-1} projects in public/data/bim_construction_dataset.csv")
