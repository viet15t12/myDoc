# myDoc

## Template chung cho tài liệu

Thư mục `docs-template/` là mẫu chung để tạo bộ tài liệu mới. Các CSS/JS dùng chung được tách vào `shared/` để nhiều khóa học có thể tái sử dụng cùng một giao diện và logic.

Cách dùng:

1. Sao chép toàn bộ `docs-template/` sang thư mục mới.
2. Chỉnh `lessons.json` theo nội dung của tài liệu mới.
3. Cấu hình giao diện index con trong `lessons.json` tại `series`: `title`, `titleHtml`, `description`, `mark`, `logo`, `logoAlt`, `accent`, `tip`.
4. Giữ `index.html` theo template chung để dùng lại `../shared/css/...` và `../shared/js/...`.
5. Cập nhật `quick-links.json` ở thư mục gốc nếu muốn khóa mới xuất hiện trong dashboard lộ trình.
6. Nếu khóa học cần hành vi riêng, tạo file CSS/JS riêng trong thư mục khóa và chỉ override phần cần thiết.
