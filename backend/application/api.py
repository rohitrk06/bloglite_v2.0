# from main import api
from flask import make_response, url_for, send_file
from flask_restful import Resource, fields, marshal_with, reqparse,request
from flask_security import current_user,auth_required
from backend.application.resource_marshals import *
from backend.application.models import *
from backend.application.validation import *
from werkzeug.utils import secure_filename
import secrets
import os
import json
import base64
from backend.application import task
from backend.application import workers
from backend.application.cache import cache
import time

# resource_user = {
#     "id" : fields.Integer,
#     "username" : fields.String,
#     "email" : fields.String,
# }
# resource_users = fields.List(fields.Nested(resource_user))

class LoggedUser(Resource):
    @auth_required('token')
    @marshal_with(resource_user)
    def get(self):
        return current_user

class AllUser(Resource):
    @cache.cached(timeout=50,key_prefix='all-users-present')
    @auth_required('token')
    @marshal_with(resource_user)
    def get(self):
        start = time.perf_counter_ns()
        users = User.query.all()
        stop=time.perf_counter_ns()
        print(stop-start)
        return users

class UserInfo(Resource):  
    @cache.memoize(50)  
    @auth_required('token')
    @marshal_with(resource_user)
    def get(self,user_id):
        user = User.query.filter_by(id=user_id).first()        
        if user:
            return user
        else:
            raise BusinessValidationError(404,'INVUSER01','User does not exist')

class Follow(Resource):
    @auth_required('token')
    def post(self,userId,followerUserId):
        if User.query.filter_by(id=userId).first() or User.query.filter_by(id=followerUserId):
            follower = FollowersList(
                user_id=followerUserId,
                follower=userId
            )
            db.session.add(follower)
            db.session.commit()
            return make_response('',200)
            
        else:
            raise BusinessValidationError(400,"INVUSER01","User does not Exist")
        
class unFollow(Resource):
    @auth_required('token')
    def post(self,userId,followerUserId):
        if User.query.filter_by(id=userId).first() or User.query.filter_by(id=followerUserId):
            FollowersList.query.filter_by(user_id=followerUserId).filter_by(follower=userId).delete()
            # db.session.delete(followers)
            db.session.commit()
            return make_response('',200)
            
        else:
            raise BusinessValidationError(400,"INVUSER01","User does not Exist")

class exportCSV(Resource):
    @auth_required('token')
    def get(self,userId):
        job = task.export_csv.delay(user_id = userId)
        return make_response(json.dumps({
            'task_id':job.id,
            'task_status':job.status,
            'task_result':job.result,
        }),200)
    
class exportStatus(Resource):
    @auth_required('token')
    def post(self):
        task_credentials = request.get_json()
        task_id = task_credentials.get('task_id')
        status = workers.celery.AsyncResult(task_id, app=workers.celery)
        return make_response(json.dumps({
            'task_id' : status.id,
            'task_status': status.status,
            'task_result': status.result,
        }),200)

blogargs = reqparse.RequestParser()
blogargs.add_argument('title')
blogargs.add_argument('description')

class Blog(Resource):
    @auth_required('token')
    def post(self,userId):
        title = request.form.get("title",None)
        description = request.form.get("description",None)
        images = request.files.getlist("blogmedia")
        if title=="":
            raise BusinessValidationError(400,'INVBLOG01',"title must not be empty")    
        if description=="":
            raise BusinessValidationError(400,'INVBLOG01','description must not be empty')
        user =  User.query.filter_by(id=userId).first() 
        if user:
            try:
                bmedias=[]
                for image in images:
                    if image.filename:
                        rand = secrets.token_hex(16)
                        file_name = secure_filename("blogimg_"+ rand + '.' +image.filename.split('.')[-1])
                        fileUrl = url_for('static',filename='images')+"/"+file_name
                        curr_dir = os.path.abspath(os.path.dirname(__file__))
                        img_url = os.path.normpath(os.path.join(curr_dir,'../../frontend/static/images/',file_name))
                        image.save(img_url)
                        bmedia = BlogMedia(
                            media_url = fileUrl
                        )
                        bmedias.append(bmedia)
                blog = Blogs(
                    title=title,
                    description=description,
                    user_id = userId,
                    b_media=bmedias
                )
                db.session.add(blog)
                db.session.commit()
                try:
                    user = User.query.filter_by(id=userId).first()
                    result = task.webhook_message.delay(f'{user.username} : created a new blog post titled {title}')
                except:
                    pass

                return make_response('',200)
            except:
                raise CustomError('',500)
        else:
            raise BusinessValidationError(400,"INVUSER01","User does not Exist")
    
    @auth_required('token')
    @marshal_with(resource_blog)
    def put(self,userId,blogID):
        args = blogargs.parse_args()
        title = args.get('title',None)
        description = args.get("description",None)
        updated=False
        if title:
            Blogs.query.filter_by(blog_id=blogID).update({'title':title})
            updated=True
        if description:
            Blogs.query.filter_by(blog_id=blogID).update({'description':description})
            updated=True
        if updated:
            db.session.commit()
            try:
                blog=Blogs.query.filter_by(blog_id=blogID).first()
                user = User.query.filter_by(id=userId).first()
                result = task.webhook_message.delay(f'{user.username} : edited a existing blog post titled {blog.title}')
            except:
                pass
            return Blogs.query.filter_by(blog_id = blogID).first()
        else:
            raise BusinessValidationError(400,'INVBLOG01','Invaild fields passed')
    
    @auth_required('token')
    def delete(self,userId,blogID):
        blogs = Blogs.query.filter_by(blog_id = blogID).first()
        if blogs:
            if User.query.filter_by(id=userId):
                db.session.delete(blogs)
                db.session.commit()
                try:
                    user = User.query.filter_by(id=userId).first()
                    result = task.webhook_message.delay(f'{user.username} : deleted a existing blog post titled {blogs.title}')
                except:
                    pass
                return make_response("",200)
            else:
                raise BusinessValidationError(400,'INVUSER01','User does not exits')
        else:
            raise BusinessValidationError(400,'INVBLOG02','Blog does not Exists')
        
class Search(Resource):
    @auth_required('token')
    @marshal_with(resource_user)
    def post(self):
        signup_credentials = request.get_json()
        search_param = signup_credentials.get('search_param')

        search = "%{}%".format(search_param)

        users = User.query.filter(User.username.like(search)).all()
        return users

class WelcomeMsg(Resource):
    def post(self):
        user_credentials = request.get_json()
        username = user_credentials.get('username')
        email_address = user_credentials.get('email')

        data = {
            'username':username,
            'email_address': email_address
        }

        assigned_task = task.send_welcome_msg.delay(data)
        
        return make_response(json.dumps({
            'task_id':assigned_task.id,
            'task_status':assigned_task.status,
            'task_result':assigned_task.result
        }),200)
        

        



        








