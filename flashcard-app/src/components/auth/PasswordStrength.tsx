import { Check } from "lucide-react";

interface PasswordStrengthProps {
  strength: number;
  strengthColor: string;
  strengthText: string;
}

export const PasswordStrength = ({
  strength,
  strengthColor,
  strengthText,
}: PasswordStrengthProps) => {
  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-${strengthColor}-500 transition-all duration-300`}
            style={{ width: `${(strength / 4) * 100}%` }}
          ></div>
        </div>
        <span className={`text-sm font-medium text-${strengthColor}-600`}>
          {strengthText}
        </span>
      </div>
    </div>
  );
};
