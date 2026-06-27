"""
Konfigurasi aplikasi Flask untuk Manajemen Data Mahasiswa.
"""
import os


class Config:
    """Base configuration class."""

    # Flask settings
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "dev-secret-key-mahasiswa-2024")
    DEBUG: bool = os.environ.get("FLASK_DEBUG", "True").lower() == "true"

    # File paths
    BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    DATA_FILE: str = os.path.join(DATA_DIR, "mahasiswa.json")
    BACKUP_DIR: str = os.path.join(DATA_DIR, "backups")

    # API settings
    JSON_SORT_KEYS: bool = False
    MAX_CONTENT_LENGTH: int = 16 * 1024 * 1024  # 16 MB

    # CORS settings
    CORS_ORIGINS: list[str] = ["*"]


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG: bool = True


class ProductionConfig(Config):
    """Production configuration."""
    DEBUG: bool = False
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "")


class TestingConfig(Config):
    """Testing configuration."""
    TESTING: bool = True
    DEBUG: bool = True
    DATA_FILE: str = os.path.join(Config.DATA_DIR, "mahasiswa_test.json")


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}


def get_config(env: str = None) -> Config:
    """Get configuration based on environment."""
    env = env or os.environ.get("FLASK_ENV", "development")
    return config_by_name.get(env, DevelopmentConfig)()
