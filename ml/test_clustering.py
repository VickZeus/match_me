
from ml.fetch_data import fetch_scores
from ml.preprocessing import preprocess_data
from ml.clustering import train_kmeans

# Fetch data
records = fetch_scores()

# Preprocess data
features = preprocess_data(records)

# Train model
result = train_kmeans(features)

# Display cluster assignments
print("\nCluster Distribution:")

for cluster_id in sorted(set(result["labels"])):
    count = sum(result["labels"] == cluster_id)

    print(f"Cluster {cluster_id}: {count} users")

# Display centroids
print("\nCluster Centroids:")

for i, centroid in enumerate(result["centroids"]):
    print(f"Cluster {i}: {centroid}")
