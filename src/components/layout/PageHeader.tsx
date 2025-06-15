
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => (
  <div className="mb-8">
    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
    {description && <p className="text-lg text-muted-foreground mt-1">{description}</p>}
  </div>
);

export default PageHeader;
