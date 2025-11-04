import React from 'react';
import Link from '@docusaurus/Link';
import styles from './homepage.module.css';

const FeatureCard = ({ feature }) => {
    const cardRef = React.useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-0.5rem) scale(1.05)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'translateY(-0.5rem)';
    };

    return (
        <Link to={feature.link} className={styles.featureCardLink}>
            <div
                ref={cardRef}
                className={styles.featureCard}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ '--gradient-from': feature.fromColor, '--gradient-to': feature.toColor }}
            >
                <div className={styles.featureHeader}>
                    <div className={styles.featureIcon}></div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                </div>
                <p className={styles.featureDescription}>{feature.description}</p>
                <div className={styles.featureLinkText}>Visit Page &rarr;</div>
            </div>
        </Link>
    );
};

export default FeatureCard;
