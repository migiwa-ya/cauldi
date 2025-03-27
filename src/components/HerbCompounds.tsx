import React from "react";

interface Compound {
  name: string;
  effect: string;
}

interface HerbCompoundsProps {
  compounds: Compound[];
}

const HerbCompounds: React.FC<HerbCompoundsProps> = ({ compounds }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>成分名</th>
          <th>特性</th>
        </tr>
      </thead>
      <tbody>
        {compounds.map((compound, index) => (
          <tr key={index}>
            <td>{compound.name}</td>
            <td>{compound.effect}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HerbCompounds;
