import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function SelectTest() {
  const handleChange = (value: string) => {
    console.log(value);
  };

  return (
    <Select value="ALL" onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All</SelectItem>
        <SelectItem value="ACTIVE">Active</SelectItem>
      </SelectContent>
    </Select>
  );
}
