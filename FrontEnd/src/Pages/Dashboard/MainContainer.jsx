import React from "react";
import "./MainContainer.css";
import CardMain from "./CardMain";
import CardMain2 from "./CardMain2";

function MainContainer() {
    const cardData = [
        {
            imgSrc: 'https://images.prismic.io/turing/652ec640fbd9a45bcec819fd_AI_Powered_Virtual_Assistant_c6d268785b.webp?auto=format,compress',
            title: "AI Assistant",
            description: "Get personalized career advice.",
            link: "/assistant"
        },
        {
            imgSrc: 'https://cdn.aarp.net/content/dam/aarp/home-and-family/personal-technology/2022/10/1140-browser-extension-icon.jpg',
            title: "Chrome Extension",
            description: "Enhance your job search experience.",
        },
        {
            imgSrc: 'https://thumbs.dreamstime.com/b/applicant-tracking-flat-icon-software-app-automates-hiring-process-candidate-management-system-finding-workers-talent-management-215352765.jpg',
            title: "Application Tracking",
            description: "Track all your job applications in one place.",
        }
        ,
        {
            imgSrc: 'https://img.freepik.com/free-vector/man-search-hiring-job-online-from-laptop_1150-52728.jpg',
            title: "Job Search",
            description: "Discover matching job opportunities.",
            link: "/jobs"
        },
        {
            imgSrc: 'https://img.freepik.com/free-vector/internet-communication-with-community-people_24877-58869.jpg',
            title: "Alumni Network",
            description: "Connect with alumni from your institution.",
        }
    ];


    const cardData2 = [
        {
            imgSrc: 'https://img.freepik.com/free-vector/interview-concept-illustration_114360-1678.jpg',
            title: "Mock Interview",
            description: "AI-powered mock interviews for practice.",
            link: "http://localhost:3000/mockinterview"
        }
    ];


    return (
        <div className="maincontainer">
            <div className="left">
                <div className="header">
                    <h1>JFlow Dashboard</h1>
                    <p>From job search to offer letters - everything you need to advance your career</p>
                </div>

                <div className="cards-container">
                   
                    {cardData2.map((card, index) => (
                        <CardMain2
                            key={index}
                            imgSrc={card.imgSrc}
                            title={card.title}
                            description={card.description}
                            link={card.link}
                        />
                    ))}

                    {cardData.map((card, index) => (
                        <CardMain
                            key={index}
                            imgSrc={card.imgSrc}
                            title={card.title}
                            description={card.description}
                            link={card.link}
                        />
                    ))}
                    

                </div>
            </div>
        </div>
    );
}

export default MainContainer;