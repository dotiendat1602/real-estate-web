export default function Stats() {
  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-white">200+</div>
            <div className="text-white/60">Khách hàng hài lòng</div>
          </div>

          <div className="space-y-2">
            <div className="text-4xl font-bold text-white">10k+</div>
            <div className="text-white/60">Bất động sản đang có</div>
          </div>

          <div className="space-y-2">
            <div className="text-4xl font-bold text-white">16+</div>
            <div className="text-white/60">Năm kinh nghiệm</div>
          </div>
        </div>
      </div>
    </section>
  )
}
