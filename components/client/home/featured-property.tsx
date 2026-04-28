import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function FeaturedProperties() {
  const properties = [
    {
      image: "/modern-luxury-villa-pool.svg",
      title: "Biệt thự ven biển Serenity",
      description: "Biệt thự 3PN 2WC, sân vườn rộng rãi, thiết kế hiện đại và không gian thoáng mát.",
      price: "Giá",
      area: "Diện tích",
      category: "Loại hình",
    },
    {
      image: "/modern-apartment-building.png",
      title: "Căn hộ trung tâm Metropolitan",
      description: "Căn hộ 1PN đầy đủ nội thất, view thành phố, phù hợp ở và cho thuê.",
      price: "Giá",
      area: "Diện tích",
      category: "Loại hình",
    },
    {
      image: "/modern-cottage-at-night.png",
      title: "Nhà vườn Rustic Retreat",
      description: "Nhà 3PN 3WC, nằm trong khu dân cư an ninh, không gian yên tĩnh.",
      price: "Giá",
      area: "Diện tích",
      category: "Loại hình",
    },
  ]

  return (
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-12">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white">Bất động sản nổi bật</h2>
            <p className="text-white/60 max-w-2xl">
              Tuyển chọn những bất động sản chất lượng cao. Từ căn hộ, nhà ở gia đình đến sản phẩm phù hợp đầu tư.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="text-white border border-[#1a1a1a] rounded-lg px-6 py-3 hover:bg-white/5 transition-colors">
              Mới đăng
            </button>
            <button className="text-white border border-[#1a1a1a] rounded-lg px-6 py-3 hover:bg-white/5 transition-colors">
              Giá tốt
            </button>
            <button className="text-white border border-[#1a1a1a] rounded-lg px-6 py-3 hover:bg-white/5 transition-colors">
              Mới cập nhật
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property, idx) => (
            <Card key={idx} className="bg-[#141414] border-[#1a1a1a] overflow-hidden">
              <img src={property.image || "/placeholder.svg"} alt={property.title} className="w-full h-56 object-cover" />

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{property.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{property.description}</p>
                  <button className="text-white/40 hover:text-white text-sm mt-2">Đọc thêm</button>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#1a1a1a]">
                  <div className="flex-1 text-center py-2 border border-[#1a1a1a] rounded-lg">
                    <div className="text-white/60 text-xs">{property.price}</div>
                  </div>
                  <div className="flex-1 text-center py-2 border border-[#1a1a1a] rounded-lg">
                    <div className="text-white/60 text-xs">{property.area}</div>
                  </div>
                  <div className="flex-1 text-center py-2 border border-[#1a1a1a] rounded-lg">
                    <div className="text-white/60 text-xs">{property.category}</div>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Xem chi tiết bất động sản</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-sm">01 / 60</div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#1a1a1a] rounded-lg hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 border border-[#1a1a1a] rounded-lg hover:bg-white/5 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
