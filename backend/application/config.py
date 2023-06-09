import secrets
class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///project.db"
    SECRET_KEY = '4FJwO_fyFymIe26DjpIQ0IWwVl_BoKtGIyGexUPFo0s'
    SECURITY_PASSWORD_SALT = '52c1cd1dbfa6f21207ec7cc328931af721ca0855'
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    SECURITY_REGISTERABLE = True
    SECURITY_CONFIRMABLE = False
    SECURITY_SEND_REGISTER_EMAIL = False
    SECURITY_UNAUTHORIZED_VIEW = None
    WTF_CSRF_ENABLED = False
    SECURITY_API_ENABLED_METHODS=['token']
    SECURITY_USERNAME_ENABLE=True
    SECURITY_USERNAME_REQUIRED=True
    CELERY_BROKER_URL="redis://localhost:6379"
    CELERY_RESULT_BACKEND = "redis://localhost:6379"
    CELERY_IMPORTS = ('backend.applicaiton.task')
    CACHE_TYPE = 'RedisCache'
    CACHE_DEFAULT_TIMEOUT=300
    CACHE_REDIS_HOST='localhost'
    CACHE_REDIS_PORT=6379