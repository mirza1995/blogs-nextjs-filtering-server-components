"use client";

import { City } from "@/types/City";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";

type CitiesListProps = {
  cities: City[];
  searchParams: {
    search?: string;
    sort?: string;
  };
};

export function CitiesList({ cities, searchParams }: CitiesListProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [search, setSearch] = useState(searchParams.search || '');
  const [sort, setSort] = useState(searchParams.sort || 'name');

  const debouncedUpdateSearch = useMemo(
    () => debounce((searchTerm: string) => {
      updateSearchParams({
        search: searchTerm,
      });
    }, 300),
    [router, searchParamsHook]
  );

  useEffect(() => {
    // Cleanup debounced function on unmount
    return () => {
      debouncedUpdateSearch.cancel();
    };
  }, [debouncedUpdateSearch]);

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    //window.history.pushState({}, '', `/?${params.toString()}`);
    if (params.toString()) {
      router.replace(`/?${params.toString()}`);
    } else {
      router.replace('/');
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedUpdateSearch(value);
  };

  const handleSortChange = (value: string) => {
    updateSearchParams({ sort: value });
    setSort(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 px-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search cities or countries..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="country">Country (A-Z)</option>
            <option value="country-desc">Country (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="px-6 text-sm text-gray-600 dark:text-gray-400">
        Showing {cities.length} of 100 cities
      </div>

      {cities.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No cities match your search.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {cities.map((city) => (
            <li
              key={city.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {city.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {city.country}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}