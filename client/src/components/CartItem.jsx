function CartItem({ item, onRemove, onQuantityChange, actionLoading }) {
  const product = item.productId;
  const productId = product?.id || product?._id;
  const stock = product?.stock || 0;

  return (
    <article className="panel mb-4 p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <img src={product?.image} alt={product?.name} className="h-24 w-24 rounded-lg object-cover" />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{product?.name}</h3>
          <p className="mt-1 text-sm text-slate-500">Brand: {product?.brand || 'N/A'}</p>
          <p className="text-sm text-slate-500">Category: {product?.category || 'N/A'}</p>
          {item.quantity >= stock && stock > 0 && (
            <p className="mt-1 text-xs font-medium text-orange-600">Stock limit reached ({stock} available)</p>
          )}
          <div className="mt-3 flex gap-4 text-sm">
            <button
              className="text-red-500"
              onClick={() => onRemove(productId)}
              disabled={actionLoading}
            >
              Remove
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between md:block md:text-right">
          <p className="font-display text-lg font-semibold">${Number(item.price).toFixed(2)}</p>
          <select
            className="mt-2 rounded border border-slate-300 px-2 py-1 text-sm"
            value={item.quantity}
            onChange={(event) => onQuantityChange(productId, Number(event.target.value))}
            disabled={actionLoading}
          >
            {Array.from({ length: Math.max(Math.min(stock, 10), 1) }, (_, index) => index + 1).map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
