import React from "react";

const values = [
  "Security",
  "Trust",
  "Innovation",
  "Flexibility",
  "Transparency",
  "Efficiency",
  "Compliance",
  "User-Friendly",
];

export default function Marquee() {
  return (
    <div className="bg-[#00ff7f] overflow-hidden py-4">
      <div className="animate-marquee whitespace-nowrap">
        {[...values, ...values, ...values].map((value, index) => (
          <React.Fragment key={index}>
            <span className="text-black text-xl font-bold mx-4">{value}</span>
            {index < values.length * 3 - 1 && (
              <span className="text-black text-xl mx-4">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
