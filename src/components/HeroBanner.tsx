/** Banner promocional de la portada. Contenido estático (decorativo). */
export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-100 to-rose-50 px-8 py-10">
      <div className="max-w-md">
        <p className="text-xs font-semibold tracking-widest text-pink-500">NUEVA COLECCIÓN</p>
        <h2 className="mt-2 text-4xl font-bold leading-tight text-slate-800">
          Resalta tu belleza
          <br />
          <span className="font-serif italic text-pink-600">todos los días ✨</span>
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Descubre nuestros productos favoritos para ti con hasta 30% OFF.
        </p>
        <a
          href="#productos"
          className="mt-5 inline-block rounded-full bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
        >
          COMPRAR AHORA
        </a>
      </div>
      <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-pink-200/50 blur-3xl" />
    </section>
  );
}
