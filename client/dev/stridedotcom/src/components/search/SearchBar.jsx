import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllCategories } from "@/store/features/categorySlice";
import { setSelectedCategory, setSearchQuery, clearFilters } from "@/store/features/searchSlice";

const SearchBar = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const searchQuery = useSelector((state) => state.search.searchQuery);
    const selectedCategory = useSelector((state) => state.search.selectedCategory);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleCategoryChange = (category) => {
        dispatch(setSelectedCategory(category));
        const params = new URLSearchParams(searchParams);
        if (category && category !== "all") params.set("category", category);
        else params.delete("category");
        setSearchParams(params);
    };

    const handleSearchQueryChange = (event) => {
        const value = event.target.value;
        dispatch(setSearchQuery(value));
        const params = new URLSearchParams(searchParams);
        if (value) params.set("search", value);
        else params.delete("search");
        setSearchParams(params);
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setSearchParams({});
    };

    useEffect(() => {
        dispatch(getAllCategories());
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "all";
        dispatch(setSearchQuery(search));
        dispatch(setSelectedCategory(category));
    }, [dispatch, searchParams]);

    return (
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mt-0">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-48 text-black dark:text-white bg-white/60 dark:bg-white/10 backdrop-blur-md shadow-sm border-none focus:ring-0 focus:outline-none">
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name.toLowerCase()}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder="Search for products..."
                className="w-full sm:flex-1 text-black dark:text-white placeholder:text-black-600 dark:placeholder:text-gray-400 bg-white/60 dark:bg-white/10 backdrop-blur-md border-none focus:outline-none focus:ring-0"
            />

            <Button
                onClick={handleClearFilters}
                className="w-full sm:w-auto bg-white text-black dark:text-black hover:bg-purple-600 hover:text-white border-none shadow-sm transition"
            >
                Clear Filter
            </Button>
        </div>
    );
};

export default SearchBar;
