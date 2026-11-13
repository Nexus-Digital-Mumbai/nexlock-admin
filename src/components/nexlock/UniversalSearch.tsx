import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Store, User, CreditCard, Smartphone, X } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced query state
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  // Click outside detection & keyboard shortcuts
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
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
    <div ref={containerRef} className="relative w-full max-w-md md:max-w-lg">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80 transition-colors group-focus-within:text-primary pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder="Search dealers, devices, IMEI..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="h-11 pl-11 pr-16 bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/90 dark:border-white/15 rounded-full text-xs md:text-sm text-foreground placeholder:text-muted-foreground/75 shadow-sm hover:bg-white/85 focus-visible:bg-white dark:focus-visible:bg-slate-900/90 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          <kbd className="hidden select-none items-center gap-0.5 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground md:inline-flex">
            ⌘K
          </kbd>
        </div>
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2.5 max-h-[460px] overflow-y-auto rounded-2xl border border-white/85 dark:border-white/15 bg-white/90 dark:bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in-50 slide-in-from-top-1">
          {isLoading && query === debouncedQuery ? (
            <div className="flex items-center justify-center p-6 text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" /> Searching Nexus database…
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No matching records found for <span className="font-semibold text-foreground">"{query}"</span>
            </div>
          ) : (
            <div className="space-y-3 p-1">
              {/* Dealers */}
              {results.dealers.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Dealers ({results.dealers.length})
                  </div>
                  <div className="space-y-0.5">
                    {results.dealers.map((item: any) => {
                      const Icon = getTypeIcon(item.type);
                      return (
                        <div
                          key={`dealer-${item.id}`}
                          onClick={() => handleItemClick(item)}
                          className="flex items-center justify-between rounded-xl p-2 text-xs hover:bg-primary/10 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-foreground truncate">{item.title}</div>
                              <div className="text-[11px] text-muted-foreground truncate">{item.subtitle}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customers */}
              {results.customers.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Customers ({results.customers.length})
                  </div>
                  <div className="space-y-0.5">
                    {results.customers.map((item: any) => {
                      const Icon = getTypeIcon(item.type);
                      return (
                        <div
                          key={`cust-${item.id}`}
                          onClick={() => handleItemClick(item)}
                          className="flex items-center justify-between rounded-xl p-2 text-xs hover:bg-primary/10 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-foreground truncate">{item.title}</div>
                              <div className="text-[11px] text-muted-foreground truncate">{item.subtitle}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Devices */}
              {results.devices.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Devices ({results.devices.length})
                  </div>
                  <div className="space-y-0.5">
                    {results.devices.map((item: any) => {
                      const Icon = getTypeIcon(item.type);
                      return (
                        <div
                          key={`dev-${item.id}`}
                          onClick={() => handleItemClick(item)}
                          className="flex items-center justify-between rounded-xl p-2 text-xs hover:bg-primary/10 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-foreground truncate">{item.title}</div>
                              <div className="text-[11px] text-muted-foreground font-mono truncate">{item.subtitle}</div>
                            </div>
                          </div>
                        </div>
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
