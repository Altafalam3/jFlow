import React from "react";
import { BsFillHeartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function CardMain({ imgSrc, title, hearts, link }) {
    const navigate = useNavigate();
    const handleClick = () => {
        if (link) {
            navigate(link);
        }
    };
    return (
        <div
            className="card_main"
            onClick={handleClick}
            style={{ cursor: link ? "pointer" : "default" }}
        >
            <img src={imgSrc} alt="" className="card_main_img" />
            <div className="card_main_name">
                <h2>{title}</h2>
                <div className="card_main_icon">
                    <i>{/* <BsFillHeartFill /> <span>{hearts}</span> */}</i>
                </div>
            </div>

            {/* <div className="stat">
        <div>
          <p>
            Current Bid<span>1.2 ETH</span>
          </p>
        </div>
        <div>
          <p>
            Ending In<span>1d:12h:10m</span>
          </p>
        </div>
      </div> */}

            {/* <div className="card_main_button">
        <a href="#" className="button btn">
          Place a Bid
        </a>
        <a href="#" className="button2 btn">
          History
        </a>
      </div> */}
        </div>
    );
}

export default CardMain;
