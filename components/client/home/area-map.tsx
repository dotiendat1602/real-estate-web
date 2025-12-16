import { Button } from "@/components/ui/button"

export default function AreaMap() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white">Bản đồ khu vực</h2>
            <p className="text-white/60 max-w-2xl">
              Khám phá khu vực xung quanh để xem tiện ích, dịch vụ và các điểm quan trọng gần bất động sản. Chúng tôi hỗ
              trợ bạn nắm rõ bức tranh tổng quan trước khi quyết định.
            </p>
          </div>

          <button className="hidden md:flex items-center gap-2 text-white border border-[#1a1a1a] rounded-lg px-6 py-3 hover:bg-white/5 transition-colors">
            Xem tất cả câu hỏi
          </button>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Image */}
          <div className="rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#141414]">
            <img
              src="/modern-luxury-villa-pool.svg"
              alt="Bản đồ khu vực"
              className="w-full h-[520px] object-cover"
            />
          </div>

          {/* Right - Filter Panel */}
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#141414] p-6 lg:p-8">
            <div className="space-y-6">
              {[
                "Trường học (mầm non, tiểu học...)",
                "Bệnh viện, phòng khám",
                "Siêu thị, cửa hàng tiện lợi",
                "Bến xe, metro, trục đường",
              ].map((label, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">{label}</span>
                    <span className="text-[10px] text-white/40 border border-[#1a1a1a] rounded-full px-2 py-0.5">
                      Loại
                    </span>
                  </div>

                  <input
                    placeholder="Nhập từ khóa / khoảng cách"
                    className="w-full bg-[#0a0a0a] border border-dashed border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white/80 placeholder:text-white/40 focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}

              {/* Action */}
              <div className="pt-4 flex items-center gap-3">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
                  Chọn tiêu chí để lọc
                </Button>

                <button className="text-white/60 hover:text-white text-sm px-4 py-2 rounded-lg border border-[#1a1a1a]">
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
