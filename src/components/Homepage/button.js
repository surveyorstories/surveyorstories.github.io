// button.js
import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ to, children, className = '', ...props }) => {
  return (
    <Link
      to={to}
      className={`mb-4 mr-4 inline-block rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default Button;
