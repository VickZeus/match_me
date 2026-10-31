
import os
import sys
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage


def send_email(event):
    username = os.getenv("MAIL_USERNAME")
    password = os.getenv("MAIL_APP_PASSWORD")
    recipient = os.getenv("MAIL_TO")

    if not all([username, password, recipient]):
        raise ValueError("Email credentials are missing!")

    run_id = os.getenv("GITHUB_RUN_ID", "Local test")
    run_number = os.getenv("GITHUB_RUN_NUMBER", "")
    repository = os.getenv("GITHUB_REPOSITORY", "")
    server_url = os.getenv("GITHUB_SERVER_URL", "https://github.com")

    run_url = (
        f"{server_url}/{repository}/actions/runs/{run_id}"
        if repository else "Not available for local test"
    )

    if event == "started":
        subject = f"MatchKARO: Training Started #{run_number}"
        body = f"""
Your MatchKARO ML model training has started.

Run: #{run_number}
Repository: {repository}
Started at: {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")}

Track progress:
{run_url}
"""
    else:
        outcome = os.getenv("TRAINING_OUTCOME", "unknown").upper()
        subject = f"MatchKARO: Training {outcome} #{run_number}"
        body = f"""
Your MatchKARO ML model training has finished.

Status: {outcome}
Run: #{run_number}
Repository: {repository}
Finished at: {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")}

View workflow details:
{run_url}
"""

    message = EmailMessage()
    message["From"] = username
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30) as server:
        server.login(username, password)
        server.send_message(message)

    print(f"Email sent: {subject}")


if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in ("started", "ended"):
        raise SystemExit("Usage: python -m ml.send_email started|ended")

    send_email(sys.argv[1])
