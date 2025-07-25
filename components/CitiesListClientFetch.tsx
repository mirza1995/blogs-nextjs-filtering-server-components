'use client';

import { City } from '@/types/City';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { CitiesList } from './CitiesList';
import { getCities } from '@/app/actions/cities';

type CitiesListClientFetchProps = {
  initialCities: City[];
  searchParams: {
    search?: string;
    sort?: string;
  };
};

export function CitiesListClientFetch({
  initialCities,
  searchParams,
}: CitiesListClientFetchProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [search, setSearch] = useState(searchParams.search || '');
  const [sort, setSort] = useState(searchParams.sort || 'name');

  const [cities, setCities] = useState<City[]>(initialCities);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
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

    window.history.pushState({}, '', `/?${params.toString()}`);
  };

  const refetchCities = async () => {
    setIsLoading(true);
    const newCities = await getCities(search, sort);
    setCities(newCities);
    setIsLoading(false);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedUpdateSearch(value);
    refetchCities();
  };

  const handleSortChange = (value: string) => {
    updateSearchParams({ sort: value });
    setSort(value);
    refetchCities();
  };

  return (
    <CitiesList
      cities={cities}
      search={search}
      sort={sort}
      isLoading={isLoading}
      onSearchChange={handleSearchChange}
      onSortChange={handleSortChange}
    />
  );
}
