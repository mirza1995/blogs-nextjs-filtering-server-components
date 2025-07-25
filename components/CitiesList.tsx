import { City } from '@/types/City';

type CitiesListProps = {
  cities: City[];
  search?: string;
  sort?: string;
  isLoading?: boolean;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
};

export function CitiesList({
  cities,
  search,
  sort,
  isLoading,
  onSearchChange,
  onSortChange,
}: CitiesListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 px-6 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search cities or countries..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={sort}
            onChange={e => onSortChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
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

      {isLoading ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      ) : cities.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No cities match your search.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {cities.map(city => (
            <li
              key={city.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {city.name}
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
