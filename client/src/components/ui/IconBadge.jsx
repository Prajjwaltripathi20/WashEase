import React from 'react';

const IconBadge = ({ Icon, className }) => {
  return (
    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center" aria-hidden>
      <Icon className="w-5 h-5 text-wash-card" />
    </div>
  );
};

export default IconBadge;
