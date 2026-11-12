import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Store, User, CreditCard, Smartphone, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: "Dealer" | "Customer" | "Device";
}

export function UniversalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced query state
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Click outside detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results
  const { data, isLoading } = useQuery({
    queryKey: ["universal-search", debouncedQuery],
    queryFn: () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) return null;
      return apiClient.get(`/bi/search?q=${encodeURIComponent(debouncedQuery)}`);
    },
    enabled: debouncedQuery.trim().length >= 2,
  });

  const results = data?.data || { dealers: [], customers: [], devices: [] };
  const hasResults =
    results.dealers.length > 0 ||
    results.customers.length > 0 ||
    results.devices.length > 0;

  const handleItemClick = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery("");

    // Scoped navigation based on entity type
    if (item.type === "Dealer") {
      window.location.href = `/dealers?search=${item.subtitle}`;
    } else if (item.type === "Customer") {
      window.location.href = `/customers?search=${item.subtitle}`;
    } else if (item.type === "Device") {
      window.location.href = `/devices?search=${item.subtitle}`;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Dealer":
        return Store;
      case "Customer":
        return User;
      case "Loan":
        return CreditCard;
      default:
        return Smartphone;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl md:mx-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search codes, phone, serials, names..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="h-9 pl-9 pr-12 bg-muted/40 border-transparent focus-visible:bg-card focus-visible:border-border transition-all duration-200"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          <kbd className="hidden md:inline select-none rounded border border-border bg-card px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
            ⌘ K
          </kbd>
        </div>
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[450px] overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-lg backdrop-blur-md animate-in fade-in-50 slide-in-from-top-1">
          {isLoading && query === debouncedQuery ? (
            <div className="flex items-center justify-center p-6 text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" /> Searching platform records...
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No matching dealers, customers or devices found.
            </div>
          ) : (
            <div className="space-y-3 p-1">
              {/* Dealers */}
              {results.dealers.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dealers</div>
                  <div className="space-y-0.5">
                    {results.dealers.map((item: any) => {
                      const Icon = getTypeIcon(item.type);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs text-foreground transition-colors hover:bg-muted/80"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{item.title}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{item.subtitle}</div>
                          </div>
                          <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customers */}
              {results.customers.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customers</div>
                  <div className="space-y-0.5">
                    {results.customers.map((item: any) => {
                      const Icon = getTypeIcon(item.type);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs text-foreground transition-colors hover:bg-muted/80"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/10 text-emerald-600">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{item.title}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{item.subtitle}</div>
                          </div>
                          <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground/30" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Devices */}
              {results.devices.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Devices</div>
                  <div className="space-y-0.5">
                    {results.devices.map((item: any) => {
                      const Icon = getTypeIcon(item.type);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs text-foreground transition-colors hover:bg-muted/80"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-purple-500/10 text-purple-600">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{item.title}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{item.subtitle}</div>
                          </div>
                          <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground/30" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
