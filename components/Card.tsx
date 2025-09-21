
import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  to: string;
  title: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ to, title, icon }) => {
  return (
    <Link to={to} className="group">
      <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer text-center">
        <div className="flex justify-center items-center mb-4 text-primary dark:text-primary-light">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default Card;
