import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, value, min, max, step = 1, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);
    if (newValue > max) newValue = max;
    onChange(newValue);
  };

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
     let newValue = Number(e.target.value);
     if (isNaN(newValue) || newValue < min) {
       newValue = min;
     }
     onChange(newValue);
  };
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <label htmlFor={label} className="font-medium text-gray-200">{label}</label>
        <input 
          id={label} 
          type="number" 
          value={value} 
          min={min} 
          max={max} 
          onChange={handleInputChange} 
          onBlur={handleInputBlur} 
          className="bg-black-dark-500 rounded-lg w-24 p-2 text-center font-bold text-lg focus:outline-none"
        />
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))} 
        className="w-full h-2 bg-black-dark-500 rounded-lg appearance-none group-enabled:cursor-pointer accent-blue-800 focus:outline-none"
      />
    </div>
  );
};

export default SliderInput;