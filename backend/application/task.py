from backend.application.workers import celery
from celery.schedules import crontab
from datetime import datetime, timedelta
from backend.application.models import *
from flask import url_for
from backend.application.send_mail import format_message, send_email
from sqlalchemy import desc
import requests
from jinja2 import Template
from weasyprint import HTML
from datetime import datetime
import csv, os


@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=7,minute=30,day_of_month=1), engagment.s(), name='Monthly Report')
    sender.add_periodic_task(crontab(minute=0, hour=0), daily_reminder.s(), name='daily reminders')


@celery.task()
def daily_reminder():
    users = User.query.all()
    for user in users:
        latest_post = Blogs.query.filter_by(user_id = user.id).order_by(desc(Blogs.created)).first()
        now = datetime.now()
        if not latest_post or latest_post.created < now - timedelta(hours=24):
            data = {
                'username':user.username
            }
            message= format_message('frontend/daily_reminder.html',data=data)
            send_email(
                user.email,
                subject="Reminder: Your Last Post on Blog Lite",
                message=message,
                content="html",
            )

@celery.task()
def send_welcome_msg(data):
    message = format_message(
        "frontend/welcome_email.html", data=data
    )
    send_email(
        data['email_address'],
        subject="Welcome to the Blog Lite website",
        message=message,
        content="html",
    )

@celery.task()
def engagment():
    users = User.query.all()
    for user in users:
        result = monthly_engagement.delay(user.id)


def format_report(template_file,user,month,blogs,year):
    with open(template_file) as file:
        template = Template(file.read())
        return template.render(user = user,month = month, blogs = blogs,year=year)

@celery.task()
def monthly_engagement(user_id):
    user = User.query.filter_by(id = user_id).first()

    now = datetime.now()
    month = now.month
    year = now.year

    filtered_blogs = []
    for blog in user.blogs:
        if blog.created.month == month and blog.created.year == year:
            filtered_blogs.append(blog)

    file_html = format_report('frontend/monthly_report.html',user = user,month = month, blogs = filtered_blogs,year=year)
    html=HTML(string=file_html)
    filename = f'{user.username}_{month}_{year}.pdf'
    html.write_pdf(target=filename)

    data = {
        'username':user.username,
        'month':month,
        'year':year,
    }
    
    message = format_message(
        "frontend/engagement_mail.html", data=data
    )
    send_email(
        user.email,
        subject=f"Monthly Engagement Report - {month}/{year}",
        message=message,
        content="html",
        attachement_file=filename
    )
    



@celery.task()
def webhook_message(message):
    url = "https://chat.googleapis.com/v1/spaces/AAAAkFHZRH0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=6axDTGmldc81bT2AG6NzlNBY9cbyWngf2MukvZs4CvM%3D"
    payload = {"text": message}
    headers = {"Content-Type": "application/json; charset=UTF-8"}
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        print("Something went wrong")


@celery.task()
def export_csv(user_id):
    blogs = Blogs.query.filter_by(user_id = user_id).all()
    with open(f"report_{user_id}.csv", "w", newline="") as csvfile:
        count=1
        csvwriter = csv.writer(csvfile, delimiter=",")
        csvwriter.writerow(["Sr No", "Title", "Description", "user_id"])
        for i in blogs:
            csvwriter.writerow([count, i.title, i.description,i.user_id])
            count+=1
