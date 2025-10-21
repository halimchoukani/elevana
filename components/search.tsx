import React, { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

function SearchProducts() {
  const [searchValue, setSearchValue] = useState<string>("");
  return (
    <div className="hidden flex-1 max-w-md mx-8 md:block">
      <div className="relative">
        <div>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des produits..."
            className="pl-10"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.currentTarget.value);
            }}
          />
        </div>
        {searchValue !== "" && (
          <div className="absolute top-[120%] rounded-md bg-white w-full border-primary border-1 p-4">
            {searchValue}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchProducts;
