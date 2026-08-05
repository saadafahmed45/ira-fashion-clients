"use client";

import React, { useState, useEffect } from "react";

export function VariantSelector({ options = [], variants = [], onVariantChange }) {
  // Store selected option values e.g. { Size: "M", Color: "Black" }
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    // Initialize default selections using first value of each option
    if (options.length > 0 && Object.keys(selectedOptions).length === 0) {
      const initial = {};
      options.forEach((opt) => {
        if (opt.values && opt.values.length > 0) {
          initial[opt.name] = opt.values[0];
        }
      });
      setSelectedOptions(initial);
    }
  }, [options]);

  useEffect(() => {
    if (!variants || variants.length === 0) return;

    // Find matching variant based on selected options
    const matchedVariant = variants.find((variant) => {
      if (!variant.options) return false;

      // Handle map or object format
      const optMap = variant.options instanceof Map 
        ? Object.fromEntries(variant.options) 
        : variant.options;

      return Object.entries(selectedOptions).every(
        ([optName, optVal]) => optMap[optName] === optVal
      );
    });

    if (matchedVariant && onVariantChange) {
      onVariantChange(matchedVariant);
    }
  }, [selectedOptions, variants, onVariantChange]);

  const handleSelect = (optionName, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-col gap-5 my-4">
      {options.map((option) => (
        <div key={option.name} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
              {option.name}: <span className="font-normal text-[#666666]">{selectedOptions[option.name] || "Select"}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelect(option.name, value)}
                  className={`px-4 py-2 text-xs font-medium transition-all rounded-none uppercase tracking-wider ${
                    isSelected
                      ? "bg-[#111111] text-white border border-[#111111]"
                      : "bg-white text-[#111111] border border-[#E5E5E5] hover:border-[#111111]"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
