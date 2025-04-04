import React from 'react';

interface Item {
  id: number;
  name: string;
  name_scientific: string;
  description: string;
}

const ListItem: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <a
      href={`/herbs/${item.name_scientific}`}
      className="relative flex flex-col items-center pb-2 outline-2 outline-vintage-ink outline-offset-2 border border-vintage-ink"
    >
      <div className="date-view p-1">
        <time dateTime="2025-03-21">
          <span>03</span>
          <span>21</span>
        </time>
      </div>
      <h2 className="p-2 mb-2 w-[90%] border-b border-vintage-ink text-sm text-center">
        {item.name}
      </h2>
      <img
        src="/ui/001.png"
        alt={item.name}
        width="400"
        height="300"
        className="my-4 scale-110 object-cover overflow-visible h-80 w-auto"
        style={{filter: 'contrast(150%) sepia(100%);'}}
      />
      <strong className="my-2 text-sm leading-[1]">基本情報</strong>
      <p className="px-2 line-clamp-3 text-xs">{item.description}</p>
    </a>
  );
};

export default ListItem;
