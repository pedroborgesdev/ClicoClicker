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
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={label} className="font-medium text-xs text-white/70">{label}</label>
        <input 
          id={label} 
          type="number" 
          value={value} 
          min={min} 
          max={max} 
          onChange={handleInputChange} 
          onBlur={handleInputBlur} 
          className="rounded-xl w-16 p-1 text-center font-bold text-sm text-white/90 border border-white/[0.06] focus:outline-none focus:border-blue-500/30 transition-colors duration-200"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        />
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))} 
        className="w-full h-1.5 rounded-lg appearance-none group-enabled:cursor-pointer focus:outline-none"
      />
    </div>
  );
};

export default SliderInput;