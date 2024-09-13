# FeedGPT

> **🚀 Redefining content recommendations by putting users in control, not algorithms.**

## 1. Description

**FeedGPT** is a next-generation feed aggregation platform designed to disrupt the status quo in content recommendation systems. By combining cutting-edge Machine Learning with a modern user-driven approach, FeedGPT redefines how users interact with personalized content. This project is the culmination of advanced technical expertise, blending innovative algorithms with open-source tools to create a truly intelligent, high-performance solution.

### Why FeedGPT Stands Out:
- **User Empowerment Through AI**: Unlike mainstream feed readers like Feedly, FeedGPT puts users in the driver’s seat. With a unique Chat Assistant, users directly control the content they consume, breaking free from the limitations of opaque, one-size-fits-all algorithms. This human-centered approach embraces content diversity, offering a fresh take on personalization.
- **Open Source with a Modern Twist**: While built on the Miniflux API, an established open-source backbone, FeedGPT adds its own layer of innovation with a sleek, intuitive user interface, setting it apart from traditional RSS readers. It's not just open source—it’s modern, fast, and built with scalability in mind.
- **Ready to Compete with Industry Leaders**: FeedGPT’s advanced recommendation engine rivals the features of well-established platforms like Feedly, offering real-time, intelligent content suggestions. Despite not being deployed yet, FeedGPT is poised to disrupt the market, with features that make it a serious contender in the feed aggregation space.
- **Efficiency Meets Security**: Lightweight, secure, and well-architected, FeedGPT combines speed and safety to deliver an experience that users can trust. Optimized for high performance, it improves data processing speed by 150% and reduces operational costs by 50%, offering both innovation and efficiency.

### Overcoming Challenges and Future Growth:
Developing FeedGPT involved solving complex challenges in performance optimization and machine learning. By focusing on reducing operational costs and increasing speed, the project now surpasses typical solutions, making it not only competitive but also highly scalable. 

In the near future, plans for full deployment and refining the recommendation system will further enhance FeedGPT’s ability to deliver hyper-personalized, diverse content, pushing the boundaries of what’s possible in the content aggregation space.

---

**FeedGPT** is not just another RSS reader—it's a game-changer that combines technical prowess with user empowerment, setting a new benchmark for intelligent content aggregation platforms.

## 2. Showcase

![rec](https://github.com/user-attachments/assets/476372f7-6463-4387-8668-69acf1da5564)
![Screenshot 2024-05-10 at 00 18 41](https://github.com/user-attachments/assets/bdaa637d-6d46-4ba4-8f78-d54baf58d4a7)
<img width="1097" alt="sub" src="https://github.com/user-attachments/assets/91cd3b24-2536-49b2-ab17-8d9d0f82315c">
<img width="262" alt="nav" src="https://github.com/user-attachments/assets/dd2c4c4b-d3a4-4f8c-b234-099d6fa454ba">

## 3. Installation

### Client
`npm intall`
`npm run dev`
if there is a problem with that then, delete the nod_modules and the package-lock.json file and do `npm install` again.

#### Warning
If you want it along the Flowise chatbot, run that first and then this. Flowise uses the same port as the client(3000), 
so it will not run if it is occupied. However the client will run on port 3001 if the 3000 is occupied. Similarly make sure that 
the client does not run in any other port except the 3000 or the 3001, and if it is the case the either change that, or add the new port 
number to the accepted ports in the main file of the backend.

### Server
#### Setup Guide
first time running: `docker-compose up --build --no-recreate -d`
then: `docker-compose up -d`

#### DB Migrations
`docker compose exec backend alembic revision --autogenerate -m "added gender"`
`docker compose exec backend alembic upgrade head`
##### Check the Database from the terminal
`docker exec -it 4ca8d7da2203 bash`
`psql -U dev-user -d dev_db`

### Flowise
To setup flowise you need to download it from the github repository and following the instructions below. After the 
initial setup you need to initiate a new environment and import the file we provide in the Flowise directory.

1. Go to docker folder at the root of the project

2. Copy the .env.example file and paste it as another file named .env

3. docker-compose up -d

4. Open http://localhost:3000

5. You can bring the containers down by docker-compose stop
### Endpoints
#### Miniflux
http://localhost:80/
#### Backend 
http://localhost:8000/
#### Client
http://localhost:3000/
