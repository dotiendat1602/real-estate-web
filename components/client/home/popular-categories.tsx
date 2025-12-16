import { ArrowRight } from "lucide-react"

export default function PopularCategories() {
  const categories = [
    {
      title: "Nhà ở",
      items: ["Nhà phố/căn hộ với thiết kế hiện đại, nhiều tiện ích", "Phù hợp ở thực và đầu tư lâu dài"],
    },
    {
      title: "Thương mại",
      items: ["Mặt bằng kinh doanh vị trí đẹp, lưu lượng cao", "Phù hợp mở cửa hàng, văn phòng, showroom"],
    },
    {
      title: "Đất thổ cư",
      items: ["Quỹ đất tiềm năng, pháp lý rõ ràng", "Vị trí đẹp phù hợp xây dựng và đầu tư"],
    },
  ]

  return (
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-4xl font-bold text-white">Danh mục phổ biến</h2>
            <p className="text-white/60">
              Khám phá các danh mục bất động sản nổi bật. Từ căn hộ cao cấp, nhà ở gia đình đến bất động sản thương mại
              phục vụ đầu tư.
            </p>
          </div>

          <button className="hidden md:flex items-center gap-2 text-white border border-[#1a1a1a] rounded-lg px-6 py-3 hover:bg-white/5 transition-colors">
            Xem tất cả bất động sản
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.title} className="bg-[#141414] border border-[#1a1a1a] rounded-xl p-8 space-y-6">
              <h3 className="text-2xl font-bold text-white">{category.title}</h3>

              <div className="space-y-3">
                {category.items.map((item, idx) => (
                  <div key={idx} className="text-white/60 text-sm leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors text-sm font-medium">
                Xem chi tiết
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
