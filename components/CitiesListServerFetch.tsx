'use client';

import { City } from '@/types/City';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { CitiesList } from './CitiesList';

type CitiesListServerFetchProps = {
  cities: City[];
  searchParams: {
    search?: string;
    sort?: string;
  };
};

export function CitiesListServerFetch({
  cities,
  searchParams,
}: CitiesListServerFetchProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [search, setSearch] = useState(searchParams.search || '');
  const [sort, setSort] = useState(searchParams.sort || 'name');

  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setLoading(false);
  }, [cities]);

  const updateSearchParams = (updates: Record<string, string>) => {
    setLoading(true);
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
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedUpdateSearch(value);
  };

  const handleSortChange = (value: string) => {
    updateSearchParams({ sort: value });
    setSort(value);
  };

  return (
    <CitiesList
      cities={cities}
      search={search}
      sort={sort}
      onSearchChange={handleSearchChange}
      onSortChange={handleSortChange}
      isLoading={loading}
    />
  );
}
