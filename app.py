import os
from flask import Flask, jsonify,request
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
        for row in rows:
            if row["deadline"]:
                row["deadline"] = row["deadline"].isoformat()
        cursor.close()
        db.close()
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/api/opportunities/<int:id>', methods=['GET'])
def get_one(id):
    try:
        db=get_db()
        cursor=db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM opportunities WHERE id =%s", (id,))
        row=cursor.fetchone()
        cursor.close()
        db.close()
        if row is None:
            return jsonify({"error": "Opportunity not found"}), 404
        if row["deadline"]:
            row["deadline"] = row["deadline"].isoformat()
        return jsonify(row),200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)