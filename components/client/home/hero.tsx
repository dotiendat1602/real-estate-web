import { Search, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Subtle glow (top-right) */}
      <div className="pointer-events-none absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative px-4 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-[40px] leading-[1.1] sm:text-5xl lg:text-6xl font-bold text-white">
                  Tìm bất động sản phù hợp
                  <br />
                  chỉ trong vài phút.
                </h1>

                <p className="text-white/55 text-sm sm:text-base max-w-xl leading-relaxed">
                  Tìm kiếm theo khu vực, khoảng giá, diện tích, số phòng ngủ/phòng tắm, tiện nghi trong nhà và các tiện
                  ích xung quanh.
                </p>
              </div>

              {/* Search block (pill style like UI) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    placeholder="Nhập khu vực / tên dự án / tên đường"
                    className="h-11 w-full rounded-full bg-white text-zinc-900 placeholder:text-zinc-500 px-5 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-purple-500"
                  />

                  <input
                    placeholder="Khoảng giá (VD: 2-4 tỷ)"
                    className="h-11 w-full sm:w-[220px] rounded-full bg-white text-zinc-900 placeholder:text-zinc-500 px-5 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-purple-500"
                  />

                  <input
                    placeholder="Diện tích (m²)"
                    className="h-11 w-full sm:w-[160px] rounded-full bg-white text-zinc-900 placeholder:text-zinc-500 px-5 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-purple-500"
                  />

                  <Button className="h-11 rounded-full bg-purple-600 hover:bg-purple-700 text-white px-6">
                    <Search className="w-4 h-4 mr-2" />
                    Tìm kiếm →
                  </Button>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2">
                  {["Loại BĐS", "Số PN", "Số WC", "Tiện nghi", "Tiện ích xung quanh", "Pháp lý"].map((label) => (
                    <button
                      key={label}
                      className="h-9 px-4 rounded-full bg-[#0f0f0f] border border-[#1a1a1a] text-white/70 text-xs hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              {/* Circular badge */}
              <div className="absolute left-6 top-6 z-10 hidden lg:flex items-center justify-center">
                <div className="relative h-20 w-20 rounded-full border border-white/15 bg-black/40 backdrop-blur">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full border border-white/15 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-white/80" />
                    </div>
                  </div>

                  {/* fake circular text */}
                  <svg className="absolute inset-0" viewBox="0 0 100 100">
                    <defs>
                      <path
                        id="circlePath"
                        d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0"
                      />
                    </defs>
                    <text fill="rgba(255,255,255,0.55)" fontSize="8" letterSpacing="2">
                      <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                        BĐS TRONG MƠ • KHÁM PHÁ •
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>

              <div className="relative lg:ml-auto">
                {/* overlay */}
                <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a]/60" />

                {/* image */}
                <img
                  src="/modern-blue-glass-buildings-3d-render.svg"
                  alt="Tòa nhà hiện đại"
                  className="relative z-20 w-full max-w-[520px] lg:max-w-[620px] ml-auto object-contain"
                />
              </div>

              {/* Bottom fade */}
              <div className="pointer-events-none absolute -bottom-6 right-0 h-24 w-full bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
