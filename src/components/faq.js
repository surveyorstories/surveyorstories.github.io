import React, { useState } from "react";

const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAccordionClick = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close the accordion if it's already open
    } else {
      setActiveIndex(index); // Open the clicked accordion item
    }
  };

  const accordionData = [
    {
      question: "Does Bhukamatha have an officially developed plugin?",
      answer:
        "While Bhukamatha is a valuable tool, it's important to clarify that it wasn't officially developed. The official plugin for this purpose is SSLR. Bhukamatha, on the other hand, is a community-driven project created by SurveyorStories with the support of village surveyors",
    },
    {
      question: "Can I use Bhukamatha to generate LPMS?",
      answer:
        "While Bhukamatha supports generating LPMS and other map formats like Stone maps, Village maps, and PPMs, we strongly advise using the official SSLR plugin for this task. The decision ultimately rests with you, but SSLR is the officially recommended tool. ",
    },
    {
      question: "How would Bhukamatha prevent the misuse of data?",
      answer:
        "Bhukamatha doesn't collect or store any data. This means all the processed information remains solely on your personal computer. Consequently, creating Land Parcel Maps(LPMs) using Bhukamatha necessitates possession of the original data, making it an offline",
    },
    {
      question:
        "Is Team Bhukamatha was interested in Collaboration/ Contribution? ",
      answer:
        "We at the Bhukamatha project value your expertise and believe you can make a significant impact by collaborating with us. Your contributions, be it in developing new features, improving documentation, or updating the portal, will be instrumental in shaping the future of Bhukamatha. Feel free to reach out to us at surveyorstories@gmail.com",
    },

    // Add more questions and answers as needed
  ];

  return (
    <div className="accordion-container">
      <h1 className="faq-title">FAQ'S</h1>
      <div className="accordion">
        {accordionData.map((item, index) => (
          <div className="accordion-item" key={index}>
            <div
              className="accordion-header"
              onClick={() => handleAccordionClick(index)}
            >
              <h3 className="accordion-title">{item.question}</h3>
            </div>
            <div
              className={`accordion-content ${
                activeIndex === index ? "open" : ""
              }`}
            >
              <p className="accordion-text">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
