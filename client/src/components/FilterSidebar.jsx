function FilterSidebar({
  categories = [],
  brands = [],
  filters,
  onFilterChange,
  onReset,
}) {
  const toggleBrand = (brand) => {
    const exists = filters.brands.includes(brand);
    const nextBrands = exists
      ? filters.brands.filter((entry) => entry !== brand)
      : [...filters.brands, brand];

    onFilterChange({ brands: nextBrands, page: 1 });
  };

  return (
    <aside className="panel h-fit p-4">
      <div className="space-y-5 text-sm">
        <section>
          <h3 className="font-display font-semibold">Category</h3>
          <ul className="mt-2 space-y-2 text-slate-600">
            <li>
              <button className="text-left" onClick={() => onFilterChange({ category: '', page: 1 })}>
                All categories
              </button>
            </li>
            {categories.map((item) => (
              <li key={item}>
                <button
                  className={`text-left ${filters.category === item ? 'font-semibold text-brand-700' : ''}`}
                  onClick={() => onFilterChange({ category: item, page: 1 })}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-display font-semibold">Brands</h3>
          <div className="mt-2 space-y-2 text-slate-600">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display font-semibold">Price range</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              placeholder="Min"
              className="rounded border border-slate-300 px-2 py-1"
              value={filters.minPrice}
              onChange={(event) => onFilterChange({ minPrice: event.target.value, page: 1 })}
            />
            <input
              placeholder="Max"
              className="rounded border border-slate-300 px-2 py-1"
              value={filters.maxPrice}
              onChange={(event) => onFilterChange({ maxPrice: event.target.value, page: 1 })}
            />
          </div>
        </section>

        <section>
          <h3 className="font-display font-semibold">Minimum rating</h3>
          <div className="mt-2 space-y-1 text-slate-600">
            {['', 4, 3, 2].map((rating) => (
              <label key={rating} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rating"
                  checked={String(filters.rating) === String(rating)}
                  onChange={() => onFilterChange({ rating: rating ? String(rating) : '', page: 1 })}
                />
                {rating ? `${rating} stars & up` : 'All ratings'}
              </label>
            ))}
          </div>
        </section>

        <button
          className="w-full rounded border border-slate-300 py-1.5 font-medium text-slate-700"
          onClick={onReset}
        >
          Clear filters
        </button>
      </div>
    </aside>
  );
}

export default FilterSidebar;
