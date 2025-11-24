Academic Research Paper Finder:

A web application that allows users to search for academic research papers using the Semantic Scholar API.
The project is deployed on two web servers using Nginx, and traffic is distributed using HAProxy for load balancing.

Load Balancer URL: 52.87.178.171

This Academic Research Paper Finder app enables users to:
- Search research papers by keywords
- View details such as title, authors, abstract, year, and citation count
- Sort results by year or citations
- Enjoy a fast, clean, beginner-friendly interface
- Access an API-powered backend with secure key management

Built using:
- Frontend: HTML, CSS, JavaScript
- Server: nginx (static file server + HA proxy)
- API: Semantic Scholar (https://api.semanticscholar.org)

Deployment:
On Web01 and Web02
1. Install required packages
sudo apt update
sudo apt install -y nginx

2. Configure Nginx and restart
sudo nano /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl restart nginx

On the Load Balancer(HAProxy)
1. Install HAProxy, configure and restart
sudo apt install -y haproxy

Test Load balancing
curl -sI  https://academicresearch.dianahshimwa.tech/


Website link: https://academicresearch.dianahshimwa.tech/
Demo video link: https://youtu.be/EQsiJIiHzo4

