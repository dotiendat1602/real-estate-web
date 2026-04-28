import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Logo and Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
                <div
                  className="w-4 h-4 bg-white rounded-full"
                  style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                />
              </div>
              <span className="text-xl font-bold text-white">Estatein</span>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="flex-1 bg-[#141414] border border-[#1a1a1a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Home Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">Home</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  New Section
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Properties
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* About Us Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">About Us</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Our Works
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Our Clients
                </a>
              </li>
            </ul>
          </div>

          {/* Properties Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">Properties</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Valuation Mastery
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Strategic Marketing
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Negotiation Wizardry
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Closing Success
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm">
                  Property Management
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/60 text-sm">
            @2023 Estatein. All Rights Reserved. &nbsp;
            <a href="#" className="hover:text-white">
              Terms & Conditions
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/60 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" className="text-white/60 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            <a href="#" className="text-white/60 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
