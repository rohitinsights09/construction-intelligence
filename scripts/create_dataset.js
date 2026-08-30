import fs from 'fs';
import path from 'path';

// Let's create the default CSV generator script
const csvHeader = 'Project_ID,Project_Type,Location,Start_Date,End_Date,Planned_Cost,Actual_Cost,Cost_Overrun,Planned_Duration,Actual_Duration,Schedule_Deviation,Vibration_Level,Crack_Width,Load_Bearing_Capacity,Temperature,Humidity,Weather_Condition,Air_Quality_Index,Energy_Consumption,Material_Usage,Labor_Hours,Equipment_Utilization,Accident_Count,Safety_Risk_Score,Image_Analysis_Score,Anomaly_Detected,Completion_Percentage,Risk_Level\n';

fs.writeFileSync(path.resolve(process.cwd(), 'public/data/bim_construction_dataset.csv'), csvHeader);
console.log('Dataset header initialized.');
