# Covid-tracker-CT
Covid tracker app for Connecticut

# App idea
This is an covid data visualization project. I currently plan to focus mostly on the Connecticut's covid data. I plan to use the publicly
covid dataset provided by google for this project. Some things I could visualize are: 

- Current number of cases by county
- Current number of beds available by county 
- State of vaccinations by county
- Death toll in county by month

# Stacks used (Plan to use)
- Database: Google Big Query
- Server for API - express
- Data visuals - d3.js
- Frontend - Vanilla html/javascript (migrating to react soon)

# How to run the project so far
The project is still barebones and is a little messy. Will need to clean up the folder structure. For now the source code in the src are primarily used
## Step 1: Set up project/connection to Big Query
- First create a project in [google cloud console](https://console.cloud.google.com/home/dashboard) to start. 
- Next go to IAM tab and create a [service account](https://console.cloud.google.com/iam-admin/serviceaccounts) with at least editor access.
- Use the service account to generate and download a key in json format. You'll use this to access BigQuery and other gcloud services locally. 
- Execute the following on terminal to set up gcloud access permissions
  ```bash
  export GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"
  ```
## Step 2: Fire up the server
Right now the project is really in test mode. So it's mostly involved setting up the back end right and a little bit of data viz work to visualize the data. 
Navigate to `src` directory and execute: 
  ```bash
  node appExpress.js 
  ```
to see some real time covid data in CT!

# Some visuals
Here is a linechart that shows confirmed cases in CT over time
[linechart](https://github.com/reading-stiener/Covid-tracker-CT/blob/main/covid-tracker/public/LineGraph.png)

Here is a map chloropleth for the same metric for each county in CT
[chloropleth](https://github.com/reading-stiener/Covid-tracker-CT/blob/main/covid-tracker/public/CT_map.png) 
