import { CitiesListServerFetch } from '@/components/CitiesListServerFetch';
import { getCities } from './actions/cities';
import { CitiesListClientFetch } from '@/components/CitiesListClientFetch';

type SearchParams = {
  search?: string;
  sort?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const cities = await getCities(params.search, params.sort);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <div className="border-gray-200 p-6 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Cities Directory
        </h2>
      </div>
      <CitiesListServerFetch cities={cities} searchParams={params} />
      {/* <CitiesListClientFetch initialCities={cities} searchParams={params} /> */}
    </div>
  );
}
