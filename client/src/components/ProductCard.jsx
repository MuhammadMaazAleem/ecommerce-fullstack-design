import { Link } from 'react-router-dom';

function ProductCard({ product, compact = false, showDescription = true }) {
  return (
    <article className="panel overflow-hidden p-3">
      <img
        src={product.image}
        alt={product.name}
        className={`w-full rounded-lg object-cover ${compact ? 'h-28' : 'h-40'}`}
      />
      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">{product.name}</h3>
        <p className="font-display text-lg font-semibold text-slate-900">${product.price}</p>
        {showDescription && <p className="text-xs text-slate-500">{product.description}</p>}
        <Link to="/product/1" className="inline-block pt-1 text-sm font-medium text-brand-700">
          View details
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
