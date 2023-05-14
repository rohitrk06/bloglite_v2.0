from backend.application.database import db
from flask_security import RoleMixin, UserMixin
from datetime import datetime

roles_users = db.Table('roles_users',
        db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
        db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))    

class TimeStampModel(db.Model):
    __abstract__ = True
    created = db.Column(db.DateTime,nullable=False,default = datetime.utcnow)
    updated = db.Column(db.DateTime, onupdate = datetime.utcnow)

class User(TimeStampModel, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    username = db.Column(db.String(255),unique = True,nullable=False)
    email = db.Column(db.String,nullable=False,unique=True)
    password = db.Column(db.String(255))
    active  = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255),unique=True,nullable=False)
    fs_token_uniquifier = db.Column(db.String(255),unique=True)
    roles = db.relationship('Role', secondary=roles_users,backref=db.backref('users', lazy='dynamic'))
    blogs = db.relationship('Blogs',backref='user',cascade='all, delete')
    following = db.relationship('FollowersList',foreign_keys='FollowersList.follower',cascade='all, delete')
    followers = db.relationship('FollowersList',foreign_keys='FollowersList.user_id',cascade='all, delete')
    comments = db.relationship('Comments',backref='user',cascade='all, delete')

class Role(db.Model,RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    name = db.Column(db.String,nullable = False)
    description= db.Column(db.String)

class Blogs(TimeStampModel):
    blog_id = db.Column(db.Integer,nullable = False,primary_key = True, autoincrement = True)
    title = db.Column(db.String,nullable = False)
    description = db.Column(db.String)
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"),nullable = False)
    b_media = db.relationship('BlogMedia',cascade='all, delete')
    likes = db.relationship('Likes',cascade='all, delete')
    comments = db.relationship('Comments',cascade='all, delete')

class BlogMedia(db.Model):
    media_id = db.Column(db.Integer,primary_key = True,autoincrement = True)
    blog_id = db.Column(db.Integer,db.ForeignKey("blogs.blog_id"),nullable = False) 
    media_url = db.Column(db.String,nullable = False) 

class Likes(db.Model):
    likes_id = db.Column(db.Integer,primary_key = True, autoincrement = True)
    blog_id = db.Column(db.Integer, db.ForeignKey("blogs.blog_id"),nullable = False)
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"),nullable = False)

class Comments(TimeStampModel):
    comment_id = db.Column(db.Integer,primary_key=True, autoincrement = True, nullable = False)
    blog_id = db.Column(db.Integer, db.ForeignKey("blogs.blog_id"),nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"),nullable = False)
    comment = db.Column(db.String)
    c_media = db.relationship('CommentMedia',cascade='all, delete')

class CommentMedia(db.Model):
    cmedia_id = db.Column(db.Integer,primary_key = True, autoincrement = True)
    comment_id = db.Column(db.Integer,db.ForeignKey("comments.comment_id"),nullable = False)
    cmedia_url = db.Column(db.String,nullable = False)

class FollowersList(db.Model):
    follower_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = False)
    follower = db.Column(db.Integer,db.ForeignKey("user.id"),nullable = False)











