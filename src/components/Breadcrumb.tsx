import React from "react";

export interface BreadcrumbProps {
  items: { label: string; link?: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="text-xs" aria-label="Breadcrumb">
      <ol className="flex flex-nowrap items-center sm:justify-center justify-left line-clamp-1 text-nowrap pl-3 overflow-auto">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">›</span>}
            {item.link ? (
              <a href={item.link} className="underline text-link">
                {item.label}
              </a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
