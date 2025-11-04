import React, { useEffect, useState } from 'react';
import '../css/flash-announcement.css';

const MAX_VIEWS_PER_DAY = 10;
const LAST_VIEW_DATE_KEY = 'flashAnnouncementLastViewDate';
const DAILY_VIEW_COUNT_KEY = 'flashAnnouncementDailyViewCount';

const FlashAnnouncement = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastViewDate = localStorage.getItem(LAST_VIEW_DATE_KEY);
    let dailyViewCount = parseInt(localStorage.getItem(DAILY_VIEW_COUNT_KEY) || '0', 10);

    if (lastViewDate !== today) {
      // New day, reset count
      dailyViewCount = 0;
      localStorage.setItem(LAST_VIEW_DATE_KEY, today);
    }

    if (dailyViewCount < MAX_VIEWS_PER_DAY) {
      setShowAnnouncement(true);
      localStorage.setItem(DAILY_VIEW_COUNT_KEY, (dailyViewCount + 1).toString());
    }
  }, []);

  const handleClose = () => {
    setShowAnnouncement(false);
  };

  if (!showAnnouncement) {
    return null;
  }

  const renderSparkles = () => {
    const sparkles = [];
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#ADFF2F', '#87CEEB', '#EE82EE']; // Gold, Orange, Tomato, GreenYellow, SkyBlue, Violet

    for (let i = 0; i < 30; i++) { // Generate 30 stars
      const delay = Math.random() * 4; // Random delay up to 4 seconds
      const xOffset = (Math.random() - 0.5) * 300; // Random X offset for different directions, increased range
      const rotation = Math.random() * 720; // Random rotation, increased range
      const left = Math.random() * 100; // Random starting horizontal position
      const top = Math.random() * 100; // Random starting vertical position
      const color = colors[Math.floor(Math.random() * colors.length)];

      sparkles.push(
        <div
          key={i}
          className="sparkle"
          style={{
            animationDelay: `${delay}s`,
            left: `${left}%`,
            top: `${top}%`,
            backgroundColor: color,
            '--star-x-offset': `${xOffset}px`,
            '--star-rotation': `${rotation}deg`,
          }}
        ></div>
      );
    }
    return sparkles;
  };

  return (
    <div className="flash-announcement-overlay">
      <div className="flash-announcement-card">
        <button className="flash-announcement-close" onClick={handleClose}>&times;</button>
        <h2><span className="animated-star">✨</span> New Notices Available! <span className="animated-star">✨</span></h2>
        <p><span className="animated-rocket">🚀</span> Svamitva GT GV and 9/2 Notices are now available! Check them out! <span className="animated-star">🌟</span></p>
        <div className="sparkle-container">
          {renderSparkles()}
        </div>
      </div>
    </div>
  );
};

export default FlashAnnouncement;
