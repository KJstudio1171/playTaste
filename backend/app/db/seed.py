from datetime import date
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.game import Game
from app.models.game_genre import GameGenre
from app.models.game_platform import GamePlatform
from app.models.genre import Genre
from app.models.platform import Platform
from app.models.rating import Rating
from app.models.review import Review
from app.models.user import User
from app.services.aggregates import refresh_game_aggregates


GENRES = [
    {"name": "Action RPG", "slug": "action-rpg"},
    {"name": "RPG", "slug": "rpg"},
    {"name": "Action", "slug": "action"},
    {"name": "Adventure", "slug": "adventure"},
    {"name": "Roguelike", "slug": "roguelike"},
    {"name": "Simulation", "slug": "simulation"},
    {"name": "Strategy", "slug": "strategy"},
    {"name": "Indie", "slug": "indie"},
]

PLATFORMS = [
    {"name": "PC", "slug": "pc"},
    {"name": "PlayStation 5", "slug": "ps5"},
    {"name": "Xbox Series X|S", "slug": "xbox-series"},
    {"name": "Nintendo Switch", "slug": "switch"},
    {"name": "Steam Deck", "slug": "steam-deck"},
]

USERS = [
    {
        "username": "demo",
        "display_name": "Demo Critic",
        "bio": "MVP verification user. Rates everything before breakfast.",
        "avatar_url": "https://placehold.co/96x96/f97316/111827?text=DC",
    },
    {
        "username": "arcadejune",
        "display_name": "Arcade June",
        "bio": "Action-heavy player with a soft spot for stylish indies.",
        "avatar_url": "https://placehold.co/96x96/0f766e/f8fafc?text=AJ",
    },
    {
        "username": "minmaxer",
        "display_name": "Min Maxer",
        "bio": "If the build spreadsheet exists, I already made a copy.",
        "avatar_url": "https://placehold.co/96x96/1d4ed8/f8fafc?text=MM",
    },
    {
        "username": "storyroute",
        "display_name": "Story Route",
        "bio": "Narrative-first reviewer chasing emotional endings.",
        "avatar_url": "https://placehold.co/96x96/7c3aed/f8fafc?text=SR",
    },
    {
        "username": "latecheckpoint",
        "display_name": "Late Checkpoint",
        "bio": "Catches up to classics years late and still writes long reviews.",
        "avatar_url": "https://placehold.co/96x96/374151/f8fafc?text=LC",
    },
    {
        "username": "cozyharbor",
        "display_name": "Cozy Harbor",
        "bio": "Simulation and comfort games, occasionally derailed by roguelikes.",
        "avatar_url": "https://placehold.co/96x96/059669/f8fafc?text=CH",
    },
]

GAMES = [
    {"title": "Elden Ring", "slug": "elden-ring", "description": "Open-world action RPG with punishing combat and expansive discovery.", "developer": "FromSoftware", "publisher": "Bandai Namco", "release_date": date(2022, 2, 25), "genres": ["action-rpg", "adventure"], "platforms": ["pc", "ps5", "xbox-series"]},
    {"title": "Baldur's Gate 3", "slug": "baldurs-gate-3", "description": "Party-driven RPG built around tactical freedom, character drama, and co-op chaos.", "developer": "Larian Studios", "publisher": "Larian Studios", "release_date": date(2023, 8, 3), "genres": ["rpg", "strategy"], "platforms": ["pc", "ps5", "steam-deck"]},
    {"title": "Hades", "slug": "hades", "description": "Fast roguelike combat wrapped in a mythology-heavy narrative loop.", "developer": "Supergiant Games", "publisher": "Supergiant Games", "release_date": date(2020, 9, 17), "genres": ["roguelike", "action", "indie"], "platforms": ["pc", "switch", "steam-deck"]},
    {"title": "Animal Well", "slug": "animal-well", "description": "Dense puzzle exploration game with layers of secrets hiding behind every room.", "developer": "Shared Memory", "publisher": "Bigmode", "release_date": date(2024, 5, 9), "genres": ["indie", "adventure"], "platforms": ["pc", "ps5", "switch", "steam-deck"]},
    {"title": "Cyberpunk 2077", "slug": "cyberpunk-2077", "description": "Neon open-world RPG with high-density side stories and build variety.", "developer": "CD Projekt Red", "publisher": "CD Projekt", "release_date": date(2020, 12, 10), "genres": ["action-rpg", "rpg"], "platforms": ["pc", "ps5", "xbox-series"]},
    {"title": "Stardew Valley", "slug": "stardew-valley", "description": "Beloved farming simulation that turns daily routines into comfort loops.", "developer": "ConcernedApe", "publisher": "ConcernedApe", "release_date": date(2016, 2, 26), "genres": ["simulation", "indie"], "platforms": ["pc", "switch", "steam-deck"]},
    {"title": "The Legend of Zelda: Tears of the Kingdom", "slug": "zelda-tears-of-the-kingdom", "description": "Systemic adventure playground built around sky islands, construction, and improvisation.", "developer": "Nintendo", "publisher": "Nintendo", "release_date": date(2023, 5, 12), "genres": ["adventure", "action"], "platforms": ["switch"]},
    {"title": "Disco Elysium", "slug": "disco-elysium", "description": "Investigation-heavy RPG focused on dialogue, ideology, and fragile identity.", "developer": "ZA/UM", "publisher": "ZA/UM", "release_date": date(2019, 10, 15), "genres": ["rpg", "indie"], "platforms": ["pc", "ps5", "switch", "steam-deck"]},
    {"title": "Hollow Knight", "slug": "hollow-knight", "description": "Atmospheric action adventure with map mastery, boss battles, and precise movement.", "developer": "Team Cherry", "publisher": "Team Cherry", "release_date": date(2017, 2, 24), "genres": ["action", "adventure", "indie"], "platforms": ["pc", "switch", "steam-deck"]},
    {"title": "Sekiro: Shadows Die Twice", "slug": "sekiro-shadows-die-twice", "description": "Posture-based sword combat that rewards rhythm, confidence, and focus.", "developer": "FromSoftware", "publisher": "Activision", "release_date": date(2019, 3, 22), "genres": ["action", "adventure"], "platforms": ["pc", "xbox-series"]},
    {"title": "Metaphor: ReFantazio", "slug": "metaphor-refantazio", "description": "Stylized fantasy RPG with social loops, class builds, and political stakes.", "developer": "Studio Zero", "publisher": "Atlus", "release_date": date(2024, 10, 11), "genres": ["rpg"], "platforms": ["pc", "ps5", "xbox-series"]},
    {"title": "Helldivers 2", "slug": "helldivers-2", "description": "Chaotic co-op shooter driven by friendly fire and mission-scale disasters.", "developer": "Arrowhead Game Studios", "publisher": "Sony Interactive Entertainment", "release_date": date(2024, 2, 8), "genres": ["action"], "platforms": ["pc", "ps5"]},
    {"title": "Sea of Stars", "slug": "sea-of-stars", "description": "Retro-flavored RPG with clean pacing, timing-based combat, and rich pixel art.", "developer": "Sabotage Studio", "publisher": "Sabotage Studio", "release_date": date(2023, 8, 29), "genres": ["rpg", "indie"], "platforms": ["pc", "switch", "ps5", "xbox-series", "steam-deck"]},
    {"title": "Prince of Persia: The Lost Crown", "slug": "prince-of-persia-the-lost-crown", "description": "Agile side-scrolling adventure with fast traversal and tightly tuned combat.", "developer": "Ubisoft Montpellier", "publisher": "Ubisoft", "release_date": date(2024, 1, 18), "genres": ["action", "adventure"], "platforms": ["pc", "ps5", "switch", "xbox-series"]},
    {"title": "Alan Wake 2", "slug": "alan-wake-2", "description": "Survival horror thriller splitting reality between investigation and dread.", "developer": "Remedy Entertainment", "publisher": "Epic Games Publishing", "release_date": date(2023, 10, 27), "genres": ["adventure", "action"], "platforms": ["pc", "ps5", "xbox-series"]},
    {"title": "Persona 5 Royal", "slug": "persona-5-royal", "description": "Stylish life-sim RPG balancing dungeon crawling with friendship management.", "developer": "P-Studio", "publisher": "Atlus", "release_date": date(2022, 10, 21), "genres": ["rpg", "simulation"], "platforms": ["pc", "switch", "ps5", "xbox-series", "steam-deck"]},
    {"title": "Marvel's Spider-Man 2", "slug": "marvels-spider-man-2", "description": "Character-driven blockbuster with fast traversal and cinematic combat set pieces.", "developer": "Insomniac Games", "publisher": "Sony Interactive Entertainment", "release_date": date(2023, 10, 20), "genres": ["action", "adventure"], "platforms": ["ps5"]},
    {"title": "Palworld", "slug": "palworld", "description": "Survival crafting sandbox that weaponizes creature collecting for chaos.", "developer": "Pocketpair", "publisher": "Pocketpair", "release_date": date(2024, 1, 19), "genres": ["action", "simulation"], "platforms": ["pc", "xbox-series", "steam-deck"]},
    {"title": "Black Myth: Wukong", "slug": "black-myth-wukong", "description": "Mythic action adventure with cinematic boss encounters and lavish creature design.", "developer": "Game Science", "publisher": "Game Science", "release_date": date(2024, 8, 20), "genres": ["action", "adventure"], "platforms": ["pc", "ps5"]},
    {"title": "Astro Bot", "slug": "astro-bot", "description": "Joyfully tactile platforming showcase packed with short-form surprises.", "developer": "Team Asobi", "publisher": "Sony Interactive Entertainment", "release_date": date(2024, 9, 6), "genres": ["action", "adventure"], "platforms": ["ps5"]},
]

RATINGS = [
    ("demo", "elden-ring", 5), ("demo", "animal-well", 4), ("demo", "metaphor-refantazio", 5), ("demo", "helldivers-2", 4), ("demo", "baldurs-gate-3", 5),
    ("arcadejune", "elden-ring", 5), ("arcadejune", "hades", 5), ("arcadejune", "helldivers-2", 4), ("arcadejune", "astro-bot", 5), ("arcadejune", "black-myth-wukong", 4),
    ("minmaxer", "baldurs-gate-3", 5), ("minmaxer", "persona-5-royal", 5), ("minmaxer", "metaphor-refantazio", 4), ("minmaxer", "sea-of-stars", 4), ("minmaxer", "disco-elysium", 5),
    ("storyroute", "disco-elysium", 5), ("storyroute", "alan-wake-2", 5), ("storyroute", "baldurs-gate-3", 5), ("storyroute", "cyberpunk-2077", 4), ("storyroute", "persona-5-royal", 5),
    ("latecheckpoint", "hollow-knight", 5), ("latecheckpoint", "sekiro-shadows-die-twice", 4), ("latecheckpoint", "stardew-valley", 4), ("latecheckpoint", "cyberpunk-2077", 4), ("latecheckpoint", "prince-of-persia-the-lost-crown", 4),
    ("cozyharbor", "stardew-valley", 5), ("cozyharbor", "animal-well", 4), ("cozyharbor", "sea-of-stars", 4), ("cozyharbor", "palworld", 3), ("cozyharbor", "zelda-tears-of-the-kingdom", 5),
]

REVIEWS = [
    {"username": "demo", "game_slug": "elden-ring", "content": "The sense of discovery still carries every long session. Even when the fights are brutal, the map keeps rewarding curiosity."},
    {"username": "demo", "game_slug": "animal-well", "content": "It starts like a minimalist exploration game and slowly turns into a notebook-heavy obsession. Perfect MVP showcase game for review density."},
    {"username": "demo", "game_slug": "metaphor-refantazio", "content": "Huge style, big stakes, and party-building that makes every new archetype feel like a meaningful choice."},
    {"username": "arcadejune", "game_slug": "astro-bot", "content": "This is pure momentum. Every stage throws out a new idea before the old one gets tired."},
    {"username": "minmaxer", "game_slug": "baldurs-gate-3", "content": "So many systems overlap cleanly that theorycrafting is almost a metagame on its own."},
    {"username": "storyroute", "game_slug": "alan-wake-2", "content": "The dual-protagonist structure makes the horror feel personal instead of just loud."},
    {"username": "latecheckpoint", "game_slug": "hollow-knight", "content": "Late to it, but the world design is still unreal. Every shortcut feels earned."},
    {"username": "cozyharbor", "game_slug": "stardew-valley", "content": "The best kind of routine game: predictable enough to relax, flexible enough to keep surprising."},
]


def build_cover_url(slug: str) -> str:
    return f"https://picsum.photos/seed/{slug}/600/900"


def upsert_reference_data(db) -> tuple[dict[str, Genre], dict[str, Platform], dict[str, User]]:
    genres_by_slug: dict[str, Genre] = {}
    for payload in GENRES:
        genre = db.scalar(select(Genre).where(Genre.slug == payload["slug"]))
        if genre is None:
            genre = Genre(**payload)
            db.add(genre)
        else:
            genre.name = payload["name"]
        genres_by_slug[payload["slug"]] = genre

    platforms_by_slug: dict[str, Platform] = {}
    for payload in PLATFORMS:
        platform = db.scalar(select(Platform).where(Platform.slug == payload["slug"]))
        if platform is None:
            platform = Platform(**payload)
            db.add(platform)
        else:
            platform.name = payload["name"]
        platforms_by_slug[payload["slug"]] = platform

    users_by_username: dict[str, User] = {}
    for payload in USERS:
        user = db.scalar(select(User).where(User.username == payload["username"]))
        if user is None:
            user = User(**payload)
            db.add(user)
        else:
            user.display_name = payload["display_name"]
            user.bio = payload["bio"]
            user.avatar_url = payload["avatar_url"]
        users_by_username[payload["username"]] = user

    db.flush()
    return genres_by_slug, platforms_by_slug, users_by_username


def upsert_games(db, genres_by_slug: dict[str, Genre], platforms_by_slug: dict[str, Platform]) -> dict[str, Game]:
    games_by_slug: dict[str, Game] = {}
    for payload in GAMES:
        game = db.scalar(select(Game).where(Game.slug == payload["slug"]))
        if game is None:
            game = Game(slug=payload["slug"], title=payload["title"], description=payload["description"])
            db.add(game)

        game.title = payload["title"]
        game.description = payload["description"]
        game.developer = payload["developer"]
        game.publisher = payload["publisher"]
        game.release_date = payload["release_date"]
        game.cover_image_url = build_cover_url(payload["slug"])
        game.genre_links = [GameGenre(genre=genres_by_slug[slug]) for slug in payload["genres"]]
        game.platform_links = [GamePlatform(platform=platforms_by_slug[slug]) for slug in payload["platforms"]]
        games_by_slug[payload["slug"]] = game

    db.flush()
    return games_by_slug


def upsert_ratings(db, users_by_username: dict[str, User], games_by_slug: dict[str, Game]) -> None:
    for username, game_slug, score in RATINGS:
        user = users_by_username[username]
        game = games_by_slug[game_slug]
        rating = db.scalar(select(Rating).where(Rating.user_id == user.id, Rating.game_id == game.id))
        if rating is None:
            rating = Rating(user_id=user.id, game_id=game.id, score=score)
            db.add(rating)
        else:
            rating.score = score


def upsert_reviews(db, users_by_username: dict[str, User], games_by_slug: dict[str, Game]) -> None:
    for payload in REVIEWS:
        user = users_by_username[payload["username"]]
        game = games_by_slug[payload["game_slug"]]
        review = db.scalar(select(Review).where(Review.user_id == user.id, Review.game_id == game.id))
        if review is None:
            review = Review(user_id=user.id, game_id=game.id, content=payload["content"])
            db.add(review)
        else:
            review.content = payload["content"]


def main() -> None:
    with SessionLocal() as db:
        genres_by_slug, platforms_by_slug, users_by_username = upsert_reference_data(db)
        games_by_slug = upsert_games(db, genres_by_slug, platforms_by_slug)
        upsert_ratings(db, users_by_username, games_by_slug)
        upsert_reviews(db, users_by_username, games_by_slug)
        db.flush()

        for game in games_by_slug.values():
            refresh_game_aggregates(db, game)

        # TODO: when recommendation v2 lands, seed user taste snapshots from these ratings and reviews.
        db.commit()

        print(
            f"Seed complete: {len(users_by_username)} users, {len(genres_by_slug)} genres, "
            f"{len(platforms_by_slug)} platforms, {len(games_by_slug)} games."
        )


if __name__ == "__main__":
    main()
