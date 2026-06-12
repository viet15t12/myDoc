# myDoc

## Template chung cho tài liệu

Thư mục `docs-template/` là mẫu chung để tạo bộ tài liệu mới. Các CSS/JS dùng chung được tách vào `shared/` để nhiều khóa học có thể tái sử dụng cùng một giao diện và logic.

Cách dùng:

1. Sao chép toàn bộ `docs-template/` sang thư mục mới.
2. Chỉnh `index.html`, `lessons.json`, `quick-links.json` theo nội dung của tài liệu mới.
3. Giữ các đường dẫn `../shared/css/...` và `../shared/js/...` để dùng lại giao diện/logic chung.
4. Nếu khóa học cần hành vi riêng, tạo file CSS/JS riêng trong thư mục khóa và chỉ override phần cần thiết.
