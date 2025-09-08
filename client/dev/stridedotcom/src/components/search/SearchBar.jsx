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
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mt-0">

            {/* Category Select */}
            <Select onValueChange={onCategoryChnage}>
                <SelectTrigger
                    className="w-full sm:w-48 text-black dark:text-white bg-white/60 dark:bg-white/10 backdrop-blur-md shadow-sm border-none focus:ring-0 focus:outline-none placeholder:text-purple-600"
                >
                    <SelectValue
                        placeholder="Select category"
                        className="text-purple-600 dark:text-gray-400"
                    />
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
                placeholder="Search for product category"
                className="w-full sm:flex-1 text-black dark:text-white placeholder:text-purple-600 dark:placeholder:text-gray-400 bg-white/60 dark:bg-white/10 backdrop-blur-md border-none focus:outline-none focus:ring-0"
            />

            {/* Clear Button */}
            <Button
                onClick={onClear}
                className="w-full sm:w-auto bg-white text-black dark:text-black hover:bg-purple-600 hover:text-white border-none shadow-sm transition"
            >
                Clear Filter
            </Button>
        </div>
    );
};

export default SearchBar;
