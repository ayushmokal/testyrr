import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: searchResults } = useQuery({
    queryKey: ['blogs', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .ilike('title', `%${searchQuery}%`)
        .limit(5);
      
      if (error) {
        console.error('Error searching blogs:', error);
        return [];
      }
      
      return data;
    },
    enabled: searchQuery.length > 0,
  });

  return (
    <div className="relative w-full max-w-[200px] sm:max-w-[300px]">
      <Input
        type="search"
        placeholder="Search articles..."
        className="w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setOpen(true)}
      />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput 
            placeholder="Search articles..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Articles">
              {searchResults?.map((article) => (
                <CommandItem
                  key={article.id}
                  onSelect={() => {
                    navigate(`/article/${article.slug}`);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {article.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}