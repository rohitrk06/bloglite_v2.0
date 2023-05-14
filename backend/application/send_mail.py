import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
import os
from email import encoders
from jinja2 import Template

SMPTP_SERVER_HOST = 'localhost'
# SMPTP_SERVER_HOST = 'smtp.gmail.com'
SMPTP_SERVER_PORT = 1025
# SMPTP_SERVER_PORT = 587
SENDER_ADDRESS = 'support@bloglite.com'
SENDER_PASSWORD = ''

def send_email(to_address, subject, message,content='text',attachement_file=None):
    msg = MIMEMultipart()
    msg['From'] = SENDER_ADDRESS
    msg['To']=to_address
    msg['Subject'] = subject
    
    if content == 'html':
        msg.attach(MIMEText(message,'html'))
    else:
        msg.attach(MIMEText(message,'plain'))
    
    if attachement_file:
        with open(attachement_file,'rb') as attachment:
            part = MIMEBase('application','octet-stream')
            part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header(
            'Content-Disposition', f'attachment; filemane={attachement_file}',
        )
        msg.attach(part)
    try:
        s = smtplib.SMTP(host=SMPTP_SERVER_HOST,port=SMPTP_SERVER_PORT)
        # s.starttls()
        s.login(SENDER_ADDRESS,SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()
        return True
    except:
        return False
print(os.getcwd())

def format_message(template_file,data={}):
    with open(template_file) as file:
        template = Template(file.read())
        return template.render(data=data)
    
