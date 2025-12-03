import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

interface ButtonProps {
  children?: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  type = 'button',
  disabled = false
}) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border-2 border-primary text-primary hover:bg-gray-50"
  };

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick} 
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input 
      {...props} 
      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
    />
  </div>
);

export const FileUpload = ({ label, onFileSelect }: { label: string, onFileSelect: (base64: string) => void }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFile}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-primary file:text-white
          hover:file:opacity-90
        "
      />
    </div>
  );
};