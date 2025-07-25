'use server';

import { cities } from '@/data/cities';

export async function getCities(search?: string, sort?: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const searchTerm = search?.toLowerCase() || '';

  const filteredCities = cities.filter(
    city =>
      city.name.toLowerCase().includes(searchTerm) ||
      city.country.toLowerCase().includes(searchTerm)
  );

  return filteredCities.sort((a, b) => {
    if (sort === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sort === 'country') {
      return a.country.localeCompare(b.country);
    } else if (sort === 'country-desc') {
      return b.country.localeCompare(a.country);
    }

    return a.name.localeCompare(b.name);
  });
}
