from flask_restful import fields
resource_cMedia={
    "c_media_id" : fields.Integer,
    "comment_id" : fields.Integer,
    "cmedia_url" : fields.String
}

resource_comment = {
    "comment_id" : fields.Integer,
    "user_id" : fields.Integer,
    "comment" : fields.String,
    "c_media" : fields.List(fields.Nested(resource_cMedia))
}

resource_like={
    "likes_id":fields.Integer,
    "blog_id":fields.Integer,
    "user_id":fields.Integer
}

resource_bMedia={
    "media_id" : fields.Integer,
    "blog_id" : fields.Integer,
    "media_url":fields.String
}

resource_blog = {
    "blog_id":fields.Integer,
    "title":fields.String,
    "description":fields.String,
    "user_id":fields.String,
    "created":fields.DateTime,
    "updated":fields.DateTime,
    "b_media":fields.List(fields.Nested(resource_bMedia)),
    "likes":fields.List(fields.Nested(resource_like)),
    "comments":fields.List(fields.Nested(resource_comment))
}

resource_following={
    # "follower_id":fields.Integer,
    "user_id":fields.Integer,
}

resource_follower={
    # "follower_id":fields.Integer,
    "follower":fields.Integer
}

resource_user = {
    "id" : fields.Integer,
    "username" : fields.String,
    "email" : fields.String,
    "blogs":fields.List(fields.Nested(resource_blog)),
    "following": fields.List(fields.Nested(resource_following)),
    "followers":fields.List(fields.Nested(resource_follower)),
    "comments":fields.List(fields.Nested(resource_comment))
}
resource_users = fields.List(fields.Nested(resource_user))