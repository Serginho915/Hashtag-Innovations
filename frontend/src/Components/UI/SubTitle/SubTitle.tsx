import React from 'react'
interface SubTitleProps {
  title: string;
  className?: string;
}

export const SubTitle: React.FC<SubTitleProps> = ({ title, className = "" }) => {
  return (
    <div className={className}>
      <h3>{title}</h3>
    </div>
  )
}
