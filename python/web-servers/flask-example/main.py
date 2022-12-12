import os
from dotenv import load_dotenv

from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    load_dotenv()
    app.run(port=os.getenv('SERVER_PORT'))