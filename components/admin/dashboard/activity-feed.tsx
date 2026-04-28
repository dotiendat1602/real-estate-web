export function ActivityFeed() {
  const activities = [
    {
      text: "Nguyễn Văn A đã post một bài viết mới về bất động sản vào ngày 28/09/2025",
      date: "28/09/2025",
    },
    {
      text: "Lê Thị B đã đăng ký tài khoản mới",
      date: "Hôm nay",
    },
    {
      text: "Trần Văn C đã cập nhật thông tin cá nhân",
      date: "01/10/2025",
    },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {activities.map((activity, index) => (
          <div key={index} className={cn("px-6 py-4", index !== activities.length - 1 && "border-b border-gray-100")}>
            <p className="text-sm text-gray-700">{activity.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
