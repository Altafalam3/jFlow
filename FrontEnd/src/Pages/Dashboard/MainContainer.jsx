import React from "react";
import "./MainContainer.css";
// import Banner from "../img/1.jpg";
import CardMain from "./CardMain";
import MainRightTopCard from "./MainRightTopCard.jsx";
import MainRightBottomCard from "./MainRightBottomCard";

function MainContainer() {
    return (
        <div className="maincontainer">
            <div className="left">
                {/* <div
          className="banner"
          style={{
            background: `url(${Banner})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="textContainer">
            <h1>Round Hall</h1>
            <h2>1.5 ETH</h2>
            <p>Uploaded by Alexander Vernof</p>
            <div className="bid">
              <a href="#" className="button">
                Bid Now
              </a>
              <p>
                Ending In <span>2d:15h:20m</span>
              </p>
            </div>
          </div>
        </div> */}

                <div className="cards">
                    {/* <div className="filters">
                        <div className="popular">
                            <h2>Feed</h2>
                            <a href="#" className="button2">
                                Popular
                            </a>
                        </div>
                        <div className="filter_buttons">
                            <a href="#" className="button">
                                All
                            </a>
                            <a href="#" className="button2">
                                Illustration
                            </a>
                            <a href="#" className="button2">
                                Art
                            </a>
                            <a href="#" className="button2">
                                Games
                            </a>
                        </div>
                    </div> */}

                    <main style={{ marginTop: "70px" }}>
                        <CardMain
                            // imgSrc={Card1}
                            title={"Application Tracking"}
                            // hearts={"65"}
                        />
                        <CardMain
                            // imgSrc={Card2}
                            title={"Mock Interview"}
                            // hearts={"65"}
                        />
                        <CardMain
                            // imgSrc={Card3}
                            title={"Job Search"}
                            // hearts={"65"}
                            link={"/jobs"}
                        />
                        <CardMain
                            title={"Alumni Connection"}
                            link={"/alumni"} // Add this link so users can navigate
                        />

                        <CardMain
                            // imgSrc={Card5}
                            title={"Jflow AI Assistant"}
                            // hearts={"65"}
                        />
                        <CardMain
                            // imgSrc={Card5}
                            title={"Chrome Extension"}
                            // hearts={"65"}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default MainContainer;
