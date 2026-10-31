
import pandas as pd


def preprocess_data(records):

    df = pd.DataFrame(records)

    if df.empty:
        raise ValueError("No records found!")

    df["score"] = pd.to_numeric(
        df["score"], errors="coerce"
    )

    df["created_at"] = pd.to_datetime(
        df["created_at"], utc=True, errors="coerce"
    )

    df = df.dropna(
        subset=["username", "quizname", "score", "created_at"]
    )

    # Sort by submission date
    df = df.sort_values("created_at")

    # Keep the latest attempt for each user and quiz
    df = df.drop_duplicates(
        subset=["username", "quizname"],
        keep="last"
    )

    # Convert into user-feature matrix
    features = df.pivot(
        index="username",
        columns="quizname",
        values="score"
    )

    # Handle missing values
    features = features.fillna(features.median())

    if features.empty:
        raise ValueError("No usable features found!")

    print("\nUser Feature Matrix:")
    print(features.head())

    print("\nTotal users:", len(features))
    print("Total quiz categories:", len(features.columns))

    return features
