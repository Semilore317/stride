import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const SearchBar = ({ onChange, onCategoryChnage, onClear }) => {

    return (
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mt-6">
            {/* Category Select */}
            <Select
                onValueChange={onCategoryChnage}
            >
                <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="watches">Formal Wear</SelectItem>
                    <SelectItem value="Sports Wear">Sports Wear</SelectItem>
                </SelectContent>
            </Select>

            {/* Search Input */}
            <Input
                type="text"
                onChange={onChange}
                placeholder="Search for product (e.g. watch)"
                className="w-full sm:flex-1"
            />

            {/* Clear Button */}
            <Button variant="outline" onClick={onClear} className="w-full text-black sm:w-auto">
                Clear Filter
            </Button>
        </div>
    );
};

export default SearchBar;
