import sys
import time

from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from app.db.session import engine


def main() -> None:
    for attempt in range(30):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            print("Database is ready.")
            return
        except OperationalError:
            remaining = 29 - attempt
            print(f"Waiting for database... retries left: {remaining}")
            time.sleep(2)

    print("Database connection failed.", file=sys.stderr)
    raise SystemExit(1)


if __name__ == "__main__":
    main()
