export default function AdsTab({ ads = [], onAdd, onEdit, onDelete, onToggle }) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Ads</h2>
        <button onClick={onAdd}>+ Add Ad</button>
      </div>

      {ads.length === 0 ? (
        <p className="text-gray-400">No ads found</p>
      ) : (
        ads.map((ad) => (
          <div
            key={ad._id}
            className="p-4 bg-white/5 rounded-xl mb-3 flex justify-between"
          >
            <div>
              <p>{ad.title}</p>
              <p className="text-sm text-gray-400">{ad.companyName}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => onToggle(ad._id)}>Toggle</button>
              <button onClick={() => onEdit(ad)}>Edit</button>
              <button onClick={() => onDelete(ad._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}