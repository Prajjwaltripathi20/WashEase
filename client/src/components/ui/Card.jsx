import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, radius='2xl', ...props }) => {
  const radiusClass = radius === '30' ? 'rounded-[30px]' : 'rounded-2xl';
  return (
    <div
      className={clsx(`${radiusClass} bg-wash-card border border-[#0f161b] shadow-wash-lg p-6`, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
