from openai import OpenAI
from flask_cors import CORS, cross_origin
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import requests
import os
from supabase import create_client, Client
from werkzeug.utils import secure_filename

load_dotenv()

OpenAI_Key:str = os.getenv('NEXT_PUBLIC_OPENAI_KEY')
client:str = OpenAI(api_key=OpenAI_Key)


app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST', 'GET'])
@cross_origin()
def process():
    data = request.json  # Get JSON data sent from Next.js
    clothingType = data.get('type')
    description = data.get('description')

    auth_header = request.headers.get('Authorization')
    if not auth_header:
      return jsonify({"message": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    
    imageResponse = client.images.generate(
      model="dall-e-3",
      prompt="Generate the following clothing item with a solid white background. The clothing item is in the category of " + clothingType + ". Make sure the image is from a straight on view, and it is a realistic depiction: " + description,
      size="1024x1024",
      quality="standard",
      n=1,
    )

    SUPABASE_URL:str = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    SUPABASE_KEY:str = os.getenv("NEXT_PUBLIC_SUPABASE_KEY")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.auth.session = lambda: {
    "access_token": token,
    "token_type": "Bearer"
    }


    image_url = imageResponse.data[0].url
    print(image_url)
    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
      file_name = secure_filename(os.path.basename(image_url))
      file_path = os.path.join(os.getcwd(), file_name)

      # Save the image locally
      with open(file_path, 'wb') as f:
        for chunk in response.iter_content(1024):
          f.write(chunk)

      # Step 2: Upload the image to Supabase Storage
      with open(file_path, 'rb') as f:
        storage_path = f"/{os.path.basename(file_name)}"
        res = supabase.storage.from_('clothes-images').upload(file=f,path=storage_path, file_options={"content-type": "image/png"})
        
        if res.status_code != 200:
          return None
       
      os.remove(file_path)
      print('complete')
      image_link = supabase.storage.from_('clothes-images').create_signed_url(storage_path, 1.262e8)


      print(image_link)
      return image_link['signedURL']

    return None

@app.route('/update', methods=['POST', 'GET'])
@cross_origin()
def update():
    data = request.json  # Get JSON data sent from Next.js
    clothingType = data.get('type')
    description = data.get('description')

    auth_header = request.headers.get('Authorization')
    if not auth_header:
      return jsonify({"message": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    
    imageResponse = client.images.generate(
      model="dall-e-3",
      prompt="Generate the following clothing item with a solid white background. The clothing item is in the category of " + clothingType + ". Make sure the image is from a straight on view, and it is a realistic depiction: " + description,
      size="1024x1024",
      quality="standard",
      n=1,
    )

    SUPABASE_URL:str = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    SUPABASE_KEY:str = os.getenv("NEXT_PUBLIC_SUPABASE_KEY")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.auth.session = lambda: {
    "access_token": token,
    "token_type": "Bearer"
    }


    image_url = imageResponse.data[0].url
    print(image_url)
    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
      file_name = secure_filename(os.path.basename(image_url))
      file_path = os.path.join(os.getcwd(), file_name)

      # Save the image locally
      with open(file_path, 'wb') as f:
        for chunk in response.iter_content(1024):
          f.write(chunk)

      # Step 2: Upload the image to Supabase Storage
      with open(file_path, 'rb') as f:
        storage_path = f"/{os.path.basename(file_name)}"
        res = supabase.storage.from_('clothes-images').upload(file=f,path=storage_path, file_options={"content-type": "image/png"})
        
        if res.status_code != 200:
          return None
       
      os.remove(file_path)
      print('complete')
      image_link = supabase.storage.from_('clothes-images').create_signed_url(storage_path, 1.262e8)


      print(image_link)
      return image_link['signedURL']

    return None

if __name__ == '__main__':
    app.run(debug=True, port=8080)
