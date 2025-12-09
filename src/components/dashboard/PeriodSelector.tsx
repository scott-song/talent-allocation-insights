import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface PeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const periods = [
  { value: "3", label: "3 Months" },
  { value: "6", label: "6 Months" },
  { value: "9", label: "9 Months" },
  { value: "12", label: "12 Months" },
];

const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[150px] bg-card border-border">
        <Calendar className="h-4 w-4 mr-2 text-primary" />
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {periods.map((period) => (
          <SelectItem key={period.value} value={period.value}>
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;
