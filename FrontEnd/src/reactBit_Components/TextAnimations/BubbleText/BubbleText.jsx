import React from 'react';
import styles from './bubble.module.css';

const BubbleText = (props) => {
  return (
    <h2 className="text-center text-3xl md:text-2xl sm:text-lg xs:text-md lg:text-4xl font-bold text-white">
      {props.title.split('').map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </h2>
  );
};

export default BubbleText;
