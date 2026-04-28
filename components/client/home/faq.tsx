import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function FAQ() {
  const faqs = [
    {
      question: "Làm sao để tìm kiếm bất động sản trên Estatein?",
      answer: "Bạn có thể dùng bộ lọc nâng cao theo vị trí, giá, diện tích và nhiều tiêu chí khác để tìm đúng nhu cầu.",
    },
    {
      question: "Cần chuẩn bị giấy tờ gì để đăng bán bất động sản?",
      answer: "Tuỳ loại hình, bạn cần giấy tờ pháp lý (sổ/giấy tờ sở hữu), CMND/CCCD và các hồ sơ liên quan.",
    },
    {
      question: "Làm thế nào để liên hệ với môi giới của Estatein?",
      answer: "Bạn có thể nhắn trực tiếp qua form liên hệ, gọi hotline hoặc chat với nhân viên hỗ trợ ngay trên website.",
    },
  ]

  return (
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-12">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white">Câu hỏi thường gặp</h2>
            <p className="text-white/60 max-w-2xl">
              Tổng hợp các câu hỏi phổ biến về dịch vụ, danh sách bất động sản và quy trình giao dịch. Dù bạn là người
              mua lần đầu hay nhà đầu tư, chúng tôi luôn sẵn sàng hỗ trợ.
            </p>
          </div>

          <button className="hidden md:flex items-center gap-2 text-white border border-[#1a1a1a] rounded-lg px-6 py-3 hover:bg-white/5 transition-colors">
            Xem tất cả câu hỏi
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="bg-[#141414] border-[#1a1a1a] p-8 space-y-4">
              <h3 className="text-xl font-bold text-white">{faq.question}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
              <button className="text-white hover:text-purple-400 text-sm font-medium">Xem thêm</button>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-sm">01 / 10</div>
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
