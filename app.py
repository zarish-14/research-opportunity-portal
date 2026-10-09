import os
from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv

load_dotenv()          # reads the .env file

app = Flask(__name__)
CORS(app)              # lets your frontend talk to this backend later

def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

@app.route('/api/opportunities', methods=['GET'])
def get_all():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM opportunities")
        rows = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)