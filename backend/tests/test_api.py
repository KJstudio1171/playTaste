def test_auth_me(client):
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 200
    assert response.json()["username"] == "demo"


def test_search_games(client):
    response = client.get("/api/v1/games/search", params={"q": "Quest"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] == 1
    assert payload["items"][0]["title"] == "Test Quest"


def test_game_detail_includes_my_state(client):
    rating_response = client.put("/api/v1/games/1/rating", json={"score": 5})
    review_response = client.post(
        "/api/v1/games/1/review",
        json={"content": "Demo user review content for detail verification."},
    )

    assert rating_response.status_code == 200
    assert review_response.status_code == 201

    detail_response = client.get("/api/v1/games/1")
    payload = detail_response.json()

    assert detail_response.status_code == 200
    assert payload["my_rating"] == 5
    assert payload["my_review"]["content"].startswith("Demo user review")


def test_review_crud_updates_counts(client):
    create_response = client.post(
        "/api/v1/games/1/review",
        json={"content": "A fresh review from the demo user."},
    )
    update_response = client.put(
        "/api/v1/games/1/review",
        json={"content": "An updated review from the demo user."},
    )
    delete_response = client.delete("/api/v1/games/1/review")
    detail_response = client.get("/api/v1/games/1")

    assert create_response.status_code == 201
    assert create_response.json()["review_count"] == 2
    assert update_response.status_code == 200
    assert update_response.json()["review"]["content"].startswith("An updated")
    assert delete_response.status_code == 200
    assert delete_response.json()["review_count"] == 1
    assert detail_response.json()["my_review"] is None


def test_profile_returns_recent_activity(client):
    client.put("/api/v1/games/1/rating", json={"score": 5})
    client.post(
        "/api/v1/games/1/review",
        json={"content": "Profile page should show this review entry."},
    )

    response = client.get("/api/v1/users/1")
    payload = response.json()

    assert response.status_code == 200
    assert payload["username"] == "demo"
    assert payload["stats"]["rating_count"] >= 1
    assert payload["recent_reviews"][0]["game"]["title"] == "Test Quest"
