from tokenize import String
from flask import Flask
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

@app.route("/")
def home():
  return "Server is running on port 5000"

@app.route("/revenue", methods = ['GET'])
def revenue():
  data = pd.read_csv('data/revenue_data.csv')
  return dict(data['Amount'][data['Revenue or Spending'] == 'Revenue'])

@app.route("/cattle", methods = ['GET'])
def cattle():
  cattleData = pd.read_csv('data/Livestock_data.csv')
  cattleData.drop(['ref_state_id','ref_district_id','state_name','district_name','Total_poultry','cattle'], axis=1, inplace=True)
  animalTypes = cattleData.columns.values
  demo ={}
  animalData = {}
  for animal in animalTypes:
    animalData[animal] = int(cattleData[animal].sum())
  print(animalData)
  return (animalData)
  # return dict(animalData)

@app.route("/crops", methods= ['GET'])
def crops():
  cropData = pd.read_csv('data/crop_data.csv')
  crops={}
  for crop in cropData['label'].unique():
    crops[crop] = int(cropData['label'][cropData['label']==crop].count())
  return (crops)

if __name__ == "__main__":
  app.run()