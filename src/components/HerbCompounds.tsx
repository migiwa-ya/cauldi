import React from 'react';

interface Compound {
  name: string;
  effect: string;
}

interface HerbCompoundsProps {
  compounds: Compound[];
}

const HerbCompounds: React.FC<HerbCompoundsProps> = ({ compounds }) => {
  return (
    <div className="herb-compounds">
      <ul>
        {compounds.map((compound, index) => (
          <li key={index}>
            <strong>{compound.name}</strong>: {compound.effect}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HerbCompounds;
