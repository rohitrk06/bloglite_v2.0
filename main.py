from flask import Flask,redirect,url_for,render_template
from flask_restful import Api
from backend.application.database import db
from backend.application.config import Config
from backend.application.models import *
from flask_security import SQLAlchemyUserDatastore, Security, utils
from flask_cors import CORS
from backend.application import workers
from backend.application import task
from backend.application.cache import cache

def create_app():
    app = Flask(__name__,template_folder='frontend',static_folder='frontend/static')
    app.config.from_object(Config) 
    # Database Initialization
    db.init_app(app)

    #API Intialization
    api = Api(app)
    #Cache App Initialization
    cache.init_app(app)

    celery = workers.celery
    celery.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"]
    )
    celery.Task = workers.ContextTask
    #Setting Flask Security Setup
    user_datastore = SQLAlchemyUserDatastore(db,User,Role)
    app.security = Security(app, user_datastore) 
    with app.app_context():
        db.create_all()
    app.app_context().push()

    

    return app,api,celery

app,api,celery = create_app()
CORS(app)

from backend.application.api import *

api.add_resource(LoggedUser,'/api/logged_user') 
api.add_resource(AllUser,'/api/user') 
api.add_resource(UserInfo,'/api/user/<int:user_id>') 
api.add_resource(Follow,'/api/user/follow/<int:userId>/<int:followerUserId>') 
api.add_resource(unFollow,'/api/user/unfollow/<int:userId>/<int:followerUserId>')
api.add_resource(Blog,'/api/user/<int:userId>/blog','/api/user/<int:userId>/blog/<int:blogID>') 
api.add_resource(exportCSV,"/api/export/<int:userId>") 
api.add_resource(exportStatus,"/api/export_status")
api.add_resource(Search,"/api/search")
api.add_resource(WelcomeMsg,'/api/welcomeMail')

@app.route("/get_file/<userId>")
def download_file(userId):
    return send_file(f'report_{userId}.csv')

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8000,debug=True)