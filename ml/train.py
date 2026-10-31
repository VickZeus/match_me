
from datetime import datetime, timezone

from ml.fetch_data import fetch_scores, supabase
from ml.preprocessing import preprocess_data
from ml.clustering import train_kmeans


def save_results(features, result):
    run_data = {
        "best_k": result["best_k"],
        "silhouette_score": float(result["silhouette_score"]),
        "total_users": len(features),
        "status": "running"
    }

    run_response = (
        supabase.table("ml_model_runs")
        .insert(run_data)
        .execute()
    )

    run_id = run_response.data[0]["id"]

    assignments = []

    for username, cluster_id in zip(features.index, result["labels"]):
        assignments.append({
            "username": str(username),
            "cluster_id": int(cluster_id),
            "model_run_id": run_id,
            "updated_at": datetime.now(timezone.utc).isoformat()
        })

    batch_size = 500

    for start in range(0, len(assignments), batch_size):
        batch = assignments[start:start + batch_size]

        supabase.table("user_clusters").upsert(
            batch,
            on_conflict="username"
        ).execute()

    supabase.table("ml_model_runs").update({
        "status": "success"
    }).eq("id", run_id).execute()

    print("\nResults saved successfully!")
    print("Model Run ID:", run_id)
    print("Users updated:", len(assignments))


def main():
    try:
        print("Fetching data...")
        records = fetch_scores()

        print("\nPreprocessing data...")
        features = preprocess_data(records)

        print("\nTraining K-Means...")
        result = train_kmeans(features)

        print("\nSaving results to Supabase...")
        save_results(features, result)

    except Exception as error:
        print("\nPipeline failed:", error)
        raise


if __name__ == "__main__":
    main()
