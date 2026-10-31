from ml.fetch_data import fetch_scores
from ml.preprocessing import preprocess_data

records = fetch_scores()

features = preprocess_data(records)

print("\nFinal Matrix Shape:", features.shape)