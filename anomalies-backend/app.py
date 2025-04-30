# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import json
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity

# app = Flask(__name__)
# CORS(app)

# # Charger les cas d’anomalies connus
# with open('anomalies.json', 'r', encoding='utf-8') as f:
#     known_cases = json.load(f)

# descriptions = [item["description"] for item in known_cases]

# # Initialiser le vectoriseur TF-IDF
# vectorizer = TfidfVectorizer()
# tfidf_matrix = vectorizer.fit_transform(descriptions)

# @app.route('/analyze', methods=['POST'])
# def analyze():
#     data = request.get_json()
#     new_text = data.get('text')

#     if not new_text:
#         return jsonify({'error': 'No text provided'}), 400

#     new_vector = vectorizer.transform([new_text])
#     similarities = cosine_similarity(new_vector, tfidf_matrix)[0]

#     similar_cases = sorted(
#         [
#             {
#                 **case,  # toutes les infos originales
#                 "similarity": float(sim)
#             }
#             for case, sim in zip(known_cases, similarities)
#         ],
#         key=lambda x: -x["similarity"]
#     )[:5] # Top 5 similaires

#     return jsonify({"similar_cases": similar_cases})

# if __name__ == '__main__':
#     app.run(port=5000)


from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Charger les anomalies depuis le fichier JSON
with open('anomalies.json', 'r', encoding='utf-8') as f:
    anomalies = json.load(f)

# Extraire les descriptions
descriptions = [item["description"] for item in anomalies]

# Initialiser le vectoriseur TF-IDF
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(descriptions)

def generate_plan(anomaly):
    """ Générer un plan d'action simple en fonction de la description de l'anomalie. """
    desc = anomaly["description"].lower()
    if "rayure" in desc:
        return "Inspecter la machine d'usinage et vérifier la qualité des outils de coupe."
    if "bavure" in desc:
        return "Ajuster l'outil d'ébavurage et contrôler le processus de finition."
    if "tolérance" in desc or "diamètre" in desc or "alignement" in desc:
        return "Revoir les réglages machine et effectuer une maintenance préventive."
    return "Effectuer un audit qualité et former le personnel."

@app.route('/analyze', methods=['POST'])
def analyze():
    # Charger les anomalies à chaque appel pour prendre en compte les changements
    with open('anomalies.json', 'r', encoding='utf-8') as f:
        anomalies = json.load(f)

    data = request.get_json()
    new_text = data.get("text", "")
    
    if new_text == "":
        return jsonify({"error": "No text provided"}), 400

    # Extraire les descriptions
    descriptions = [item["description"] for item in anomalies]

    # Recréer la matrice TF-IDF avec les nouvelles données
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(descriptions)

    new_vector = vectorizer.transform([new_text])
    similarities = cosine_similarity(new_vector, tfidf_matrix)[0]

    results = []
    for anomaly, sim in zip(anomalies, similarities):
        result = anomaly.copy()
        result["similarity"] = float(sim)
        results.append(result)

    # Trier par similarité décroissante
    results = sorted(results, key=lambda x: -x["similarity"])

    return jsonify({"similar_cases": results[:5]})


@app.route('/all_anomalies', methods=['GET'])
def get_all_anomalies():
    with open('anomalies.json', 'r', encoding='utf-8') as f:
        all_anomalies = json.load(f)
    return jsonify({"all_anomalies": all_anomalies})


@app.route('/generate_plan', methods=['POST'])
def get_plan():
    """ Génère un plan d'action pour la première anomalie (la plus similaire) envoyée depuis le front. """
    data = request.get_json()
    anomaly = data.get("anomaly")
    if not anomaly:
        return jsonify({"error": "Anomaly data missing"}), 400

    plan = generate_plan(anomaly)
    return jsonify({"plan_action": plan})

if __name__ == '__main__':
    app.run(port=5000)
