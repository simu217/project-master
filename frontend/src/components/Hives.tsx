import { IHive } from "./Dashboard";

export interface IHiveProps {
  hives: IHive[];
  name: string;
}

function Hives({ hives, name }: IHiveProps) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {name}
      </h2>
      {hives.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">You have no hives.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {hives.map((h: IHive) => (
            <a
              key={h._id}
              href={`/dashboard/${h._id}`}
              className="block bg-white dark:bg-gray-800 rounded p-4 shadow hover:shadow-md transition"
            >
              <h3 className="font-bold text-indigo-600 dark:text-indigo-300 text-lg">
                {h.name || "Unnamed Hive"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {h.crystals?.length || 0} crystals
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Hives;
