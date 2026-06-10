export default function AdsTab({
ads = [],
onAdd,
onEdit,
onDelete,
onToggle,
}) {
return ( <div> <div className="flex justify-between items-center mb-6"> <h2 className="text-xl font-bold">Ads</h2>

    <button
      onClick={onAdd}
      className="px-4 py-2 bg-blue-600 rounded-lg"
    >
      + Add Ad
    </button>
  </div>

  {ads.length === 0 ? (
    <p className="text-gray-400">No ads found</p>
  ) : (
    ads.map((ad) => (
      <div
        key={ad._id}
        className="p-4 bg-white/5 rounded-xl mb-3 flex justify-between items-center"
      >
        <div>
          <p className="font-semibold">
            {ad.title}
          </p>

          <p className="text-sm text-gray-400">
            {ad.companyName}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggle(ad._id)}
            className="px-3 py-1 bg-yellow-600 rounded"
          >
            Toggle
          </button>

          <button
            onClick={() => onEdit(ad)}
            className="px-3 py-1 bg-green-600 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(ad._id)}
            className="px-3 py-1 bg-red-600 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>

);
}
