import React from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CardMain2({ imgSrc, title, description, hearts, link }) {

   const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
         opacity: 1,
         y: 0,
         transition: {
            duration: 0.5
         }
      },
      hover: {
         scale: 1.03,
         boxShadow: "0px 10px 30px rgba(0, 120, 255, 0.2)",
         transition: {
            duration: 0.3
         }
      }
   };

   return (
      <motion.div
         className="card_main"
         style={{ cursor: link ? "pointer" : "default" }}
         variants={cardVariants}
         initial="hidden"
         animate="visible"
         whileHover="hover"
      >
         <a
            href={link}
            className="button"
            target="_blank"  // Add this to open in new tab
            rel="noopener noreferrer"  // Security best practice
         >
            <div className="card_image_container">
               <img
                  src={imgSrc}
                  alt={title}
                  className="card_main_img"
                  onError={(e) => {
                     e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                  }}
               />
            </div>
            <div className="card_content">
               <h2 className="card_title">{title}</h2>
               <p className="card_description">{description}</p>
               <div className="card_footer">
                  <div className="card_main_icon">
                    
                     <span>{hearts || 0}</span>
                  </div>
                  {link && <span className="card_link">Explore →</span>}
               </div>
            </div>
         </a>
      </motion.div>
   );
}

export default CardMain2;