## Useful Commands
- Run MailHog server on Ubuntu Terminal: `~/go/bin/MailHog`
- Run Redis Server on Ubuntu Terminal: `redis-server`
- Run Celery Worker on Ubuntu Terminal: `celery -A main.celery worker -l info`
- Run Celery beat Scheduler on Ubuntu Terminal: `celery -A main.celery beat --max-interval 1 -l info`

# Instruction to run the applications

- Install all the required python modules from `requirement.txt` using the following command `pip install -r requirements.txt`
- Ensure you have linux environment setup in your system.
- Keep Celery and redis installed in linux environment.
- For mailing, This project uses fake mail server *MailHog*. Install the server in you linux environment ready
- After successfully installing the required modules, run `main.py` python file using the following command `python main.py` in command prompt.
- In new Ubuntu/Linux Terminal run MailHog server. See Useful Commands to for the same
- In new Ubuntu/Linux Terminal run Redis-server.
- In new Ubuntu/Linux Terminal run Celery Worker.
- In new Ubuntu/Linux Terminal run Celery Beat Scheduler.

- App is running on `http://127.0.0.1:5000`. Use above url to access the web application.
- In order to see api documentation refer `api.yaml`

# Folder Structure

- `backend` : files related to the backend operations
    - `application`: Python file for api, validation operations
- `frontend`
    - `static`: Static file such as Vue/JS file and static images
        - `components`:contains Vue components for frontend
        - `images`: images required for the application
- `instance`: sqlite database instance

```
+---backend
|	+---application
|	|	+---api.py
|	|	+---cache.py
|	|	+---config.py
|	|	+---database.py
|	|	+---models.py
|	|	+---resource_marshals.py
|	|	+---send_mail.py
|	|	+---task.py
|	|	+---validation.py
|	|	+---workers.py
+---frontend
|	+---static
|	|	+---components
|	|	|	+---blog.js
|	|	|	+---blog_component.js
|	|	|	+---delete_blog.js
|	|	|	+---edit_blog.js
|	|	|	+---followUsers.js
|	|	|	+---home.js
|	|	|	+---login.js
|	|	|	+---logout.js
|	|	|	+---newBlog.js
|	|	|	+---profile.js
|	|	|	+---profile_sidebars.js
|	|	|	+---search.js
|	|	|	+---signup.js
|	|	|	+---user_sidebar.js
|	|	|	+---userhomepage.js
|	|	+---images
|	|	+---application.js
|	|	+---routes.js
|	|	+---store.js
|	+---daily_reminder.html
|	+---engagement_mail.html
|	+---index.html
|	+---monthly_report.html
|	+---welcom_email.html
+---instance
|	+---project.db
+---celerybeat-schedule
+---main.py
+---readme.md
+---requirements.txt
```
