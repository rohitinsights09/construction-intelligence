# Construction Intelligence

## Construction Project Analytics & Performance Platform

### Author
Rohit Shinde

### GitHub
https://github.com/rohitinsights09

---

## Project Overview

Construction Intelligence is an interactive analytics dashboard that analyzes construction project performance across multiple dimensions. The platform provides a comprehensive view of project cost, schedule, progress, risk, resources, and safety metrics sourced from the BIM-AI Integrated Construction Dataset.

The dashboard dynamically calculates analytics from the actual CSV dataset and presents them through an interactive interface with multiple specialized views. Each metric and insight is calculated from the dataâ€”no hard-coded values are used anywhere in the application.

---

## Business Problem

Construction project managers face several key challenges:

- **Cost Overruns:** Projects frequently exceed budgeted thresholds, impacting project profitability and portfolio performance
- **Schedule Delays:** Projects often run behind schedule, affecting downstream deliverables and resource availability
- **Project Risk:** Many projects have high risk profiles that require active management and monitoring
- **Resource Utilization:** Inefficient allocation of labor, equipment, and materials drives up project costs
- **Portfolio Visibility:** Lack of centralized visibility into all active projects prevents effective management prioritization
- **Management Attention:** Without clear signals, managers struggle to identify which projects require immediate focus

---

## Project Objectives

This analytics platform addresses construction management challenges by providing:

- Centralized dashboard visibility into portfolio of construction projects
- Performance metrics across cost, schedule, and risk dimensions
- Interactive filtering and drill-down capability to analyze specific projects or subsets
- Data quality monitoring to ensure analytics reliability
- Executive-ready insights highlighting critical management issues
- Searchable project database with detailed project-level analysis

---

## Dataset

**BIM-AI Integrated Construction Dataset**

The dashboard analyzes construction project data from the BIM-AI Integrated Construction Dataset. The data is loaded from a CSV file and all analytics are calculated dynamically from the available fields in the dataset.

The dataset includes projects with dimensions such as:
- Project identification and classification (type, location, risk level)
- Financial metrics (planned cost, actual cost, cost variance)
- Temporal metrics (start date, end date, duration, schedule deviation)
- Structural and sensor data (vibration, crack width, anomaly detection)
- Environmental and resource metrics (temperature, humidity, labor hours, equipment utilization)
- Safety and quality metrics (accident count, safety risk score, image analysis score)

---

## Key Analytics

The dashboard calculates the following analytics from the dataset:

**Financial Metrics:**
- Portfolio value (total actual cost across all projects)
- Planned vs. actual cost comparison
- Cost overrun tracking (absolute and percentage)
- Cost performance index

**Schedule Metrics:**
- Schedule deviation (planned vs. actual duration)
- Delayed projects count and percentage
- Project completion percentage
- Schedule performance index

**Risk & Safety Metrics:**
- Risk distribution (High, Medium, Low projects)
- Sensor anomaly detection
- Safety incidents tracking
- Safety risk scoring

**Resource Metrics:**
- Equipment utilization rates
- Labor hours allocation
- Material usage tracking
- Energy consumption

**Quality Metrics:**
- Data completeness percentage
- Duplicate record detection
- Missing value analysis per column

---

## Dashboard Modules

The application includes the following analytical modules:

1. **Executive Overview** - Portfolio-level KPIs, risk distribution, and top projects requiring attention
2. **Cost Intelligence** - Cost performance analysis, budget variance, and cost trends by project type and location
3. **Schedule & Delays** - Schedule adherence tracking, delayed projects, and timeline performance
4. **Risk Command** - Risk distribution, anomaly detection, and high-risk project identification
5. **Safety Analytics** - Safety incidents, risk scores, and air quality metrics
6. **Resource Analytics** - Equipment utilization, labor hours, material usage, and energy consumption
7. **Data Quality** - Data completeness, column validation, missing values, and data governance metrics
8. **Project Explorer** - Searchable project database with detailed project-level metrics and drill-down capability
9. **About** - Application information and navigation

---

## Key Features

- **Interactive Filters** - Real-time filtering across 10 dimensions (type, location, risk, weather, anomalies, cost overrun, delays, completion range, and text search)
- **Dynamic KPIs** - Key metrics calculated from actual CSV data and updated instantly when filters change
- **Interactive Charts** - Bar charts, pie charts, and scatter plots for multi-dimensional analysis
- **Project Search** - Full-text search across project records with sortable columns
- **Project Details** - Detailed modal view of individual project metrics
- **Executive Insights** - Automatically generated insights highlighting critical portfolio issues
- **CSV Import** - Upload custom construction datasets for analysis
- **CSV Export** - Export filtered project data as CSV file
- **Data Quality Checks** - Per-column validation and completeness reporting
- **Responsive Interface** - Works on desktop, tablet, and mobile devices

---

## Data Processing

The application follows this data flow:

```
CSV Dataset
    â†“
Parse CSV (PapaParse)
    â†“
Normalize Data
    â†“
Validate Fields
    â†“
Calculate Derived Metrics (CPI, SPI, Attention Scores)
    â†“
Store in Application Context
    â†“
Apply User Filters
    â†“
Calculate Aggregated KPIs
    â†“
Render Interactive Dashboard
```

---

## Technology Stack

- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling and responsive design
- **Recharts** - Data visualization and charting
- **PapaParse** - CSV parsing and processing
- **Lucide React** - Icon library

---

## Project Architecture

Main directories:

- `src/components/` - Reusable UI components (KPI cards, charts, filters, modals)
- `src/pages/` - Dashboard modules (Overview, Cost, Schedule, Risk, Safety, Resource, Quality, Explorer)
- `src/layouts/` - Layout components and app shell
- `src/context/` - Global state management (DataContext)
- `src/types/` - TypeScript type definitions
- `src/utils/` - Data processing, analytics calculations, formatting utilities
- `public/data/` - CSV dataset file

---

## Running Locally

### Prerequisites
- Node.js (version 16+)
- npm (version 8+)

### Installation

```bash
git clone https://github.com/rohitinsights09/construction-intelligence.git
cd construction-intelligence
npm install
```

### Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Verification

```bash
npm run lint
```

---

## Production Build

### Build

```bash
npm run build
```

### Build Output

The `dist/` folder contains the production-ready application ready for deployment.

### Deployment

The built application can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, AWS S3, etc.).

---

## Portfolio Value

This project demonstrates:

- **Data Analysis** - Working with real-world construction datasets and extracting meaningful metrics
- **Data Visualization** - Building interactive charts and KPI dashboards with React and Recharts
- **Business Intelligence** - Translating business problems into analytical dashboards and insights
- **KPI Development** - Calculating cost performance index, schedule performance index, and attention scoring
- **Data Quality** - Monitoring data completeness, validating fields, and tracking missing values
- **Interactive Dashboard Development** - Building responsive, real-time filtering interfaces with React
- **Construction Domain Analytics** - Understanding construction-specific metrics and business problems
- **Full-Stack Analytics** - Complete pipeline from CSV data to interactive dashboard

---

## Future Improvements

Potential enhancements for future phases:

- **Power BI Integration** - Export dashboards and data to Power BI for enterprise analytics
- **SQL Data Warehouse** - Migrate from CSV to PostgreSQL/SQL Server for scalability
- **Predictive Delay Analysis** - Machine learning models to forecast project delays
- **Cost Forecasting** - Predictive modeling for final project costs based on current trends
- **Advanced Risk Scoring** - Multi-factor risk assessment combining cost, schedule, and safety metrics
- **Real-Time IoT Integration** - Connect to live sensor data streams for real-time monitoring
- **Custom Report Generation** - Export executive summaries and analytical reports
- **Multi-Project Benchmarking** - Compare current portfolio against historical and industry benchmarks

---

## Author

**Rohit Shinde**

Data Analyst | Analytics Portfolio

GitHub: https://github.com/rohitinsights09
