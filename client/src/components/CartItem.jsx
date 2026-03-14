function CartItem({ item }) {
  return (
    <article className="panel mb-4 p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{item.name}</h3>
          <p className="mt-1 text-sm text-slate-500">Size: medium, Color: blue, Material: plastic</p>
          <p className="text-sm text-slate-500">Seller: Artel Market</p>
          <div className="mt-3 flex gap-4 text-sm">
            <button className="text-red-500">Remove</button>
            <button className="text-brand-700">Save for later</button>
          </div>
        </div>
        <div className="flex items-center justify-between md:block md:text-right">
          <p className="font-display text-lg font-semibold">${item.price}</p>
          <select className="mt-2 rounded border border-slate-300 px-2 py-1 text-sm">
            <option>{item.qty}</option>
            <option>1</option>
            <option>3</option>
            <option>9</option>
          </select>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
