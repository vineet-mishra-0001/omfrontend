import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Faq = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          className="bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <button
            className="w-full flex justify-between items-center p-4 text-left"
            onClick={() => toggleIndex(index)}
          >
            <h3 className="font-medium text-gray-900">{faq.question}</h3>
            {openIndex === index ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-sm text-gray-700">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Faq;
