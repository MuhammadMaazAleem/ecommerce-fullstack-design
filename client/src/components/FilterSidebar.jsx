const categories = ['Mobile accessory', 'Electronics', 'Smartphones', 'Modern tech'];
const brands = ['Samsung', 'Apple', 'Huawei', 'Poco', 'Lenovo'];
const features = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'];

function FilterSidebar() {
  return (
    <aside className="panel h-fit p-4">
      <div className="space-y-5 text-sm">
        <section>
          <h3 className="font-display font-semibold">Category</h3>
          <ul className="mt-2 space-y-2 text-slate-600">
            {categories.map((item) => (
              <li key={item}>{item}</li>
            ))}
            <li className="text-brand-700">See all</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display font-semibold">Brands</h3>
          <div className="mt-2 space-y-2 text-slate-600">
            {brands.map((brand, i) => (
              <label key={brand} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={i === 0 || i === 1 || i === 3} />
                {brand}
              </label>
            ))}
            <p className="text-brand-700">See all</p>
          </div>
        </section>

        <section>
          <h3 className="font-display font-semibold">Features</h3>
          <div className="mt-2 space-y-2 text-slate-600">
            {features.map((feature, i) => (
              <label key={feature} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={i === 0} />
                {feature}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display font-semibold">Price range</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input placeholder="Min" className="rounded border border-slate-300 px-2 py-1" />
            <input placeholder="Max" className="rounded border border-slate-300 px-2 py-1" />
          </div>
          <button className="mt-2 w-full rounded bg-brand-500 py-1.5 font-medium text-white">Apply</button>
        </section>

        <section>
          <h3 className="font-display font-semibold">Condition</h3>
          <div className="mt-2 space-y-2 text-slate-600">
            {['Any', 'Refurbished', 'Brand new', 'Old items'].map((option, i) => (
              <label key={option} className="flex items-center gap-2">
                <input type="radio" name="condition" defaultChecked={i === 0} />
                {option}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display font-semibold">Ratings</h3>
          <div className="mt-2 space-y-1 text-slate-600">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={rating === 4 || rating === 3} />
                {rating} stars
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display font-semibold">Manufacturer</h3>
          <p className="mt-2 text-slate-500">Expandable list</p>
        </section>
      </div>
    </aside>
  );
}

export default FilterSidebar;
