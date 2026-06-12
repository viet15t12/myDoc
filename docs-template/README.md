# Docs template

Thư mục này là mẫu chung cho các tài liệu mới. Giao diện và logic dùng chung nằm trong `../shared/`, giúp các khóa học tái sử dụng cùng một bộ CSS/JS.

## Cách dùng

1. Sao chép toàn bộ thư mục `docs-template/` thành thư mục mới của tài liệu.
2. Mở `lessons.json` và cập nhật:
   - `series.title`, `series.titleHtml`, `series.description`, `series.mark`
   - `series.logo`, `series.logoAlt`, `series.accent` nếu muốn dùng logo SVG và màu chủ riêng
   - `series.tip` để đổi nội dung mẹo học tập trên sidebar của index
   - `types` (phân loại bài học)
   - `lessons` (danh sách bài học)
3. Tạo các file bài học HTML tương ứng với trường `file`.
4. Nếu cần, cập nhật `../quick-links.json` ở thư mục gốc để dashboard lộ trình thấy khóa mới.
5. Giữ nguyên các đường dẫn đến `../shared/css/...` và `../shared/js/...` nếu không có nhu cầu override riêng.

## Định dạng dữ liệu

- `series`: tiêu đề, mô tả và ký hiệu ngắn của bộ tài liệu
- `types`: danh sách nhóm, mỗi nhóm có `id`, `title`, `icon`, `color`
- `lessons`: mỗi mục có `id`, `type`, `title`, `description`, `file`, `sections`, `status`, `tags`

## Lưu ý

- `index.html` dùng `../shared/css/style.css` và `../shared/js/dashboard-script.js`.
- Trang bài học dùng `../shared/css/doc-styles.css` và `../shared/js/doc-script.js`.
- Thư mục khóa học chỉ nên chứa dữ liệu, nội dung bài học, logo/asset riêng và các override thật sự cần thiết.
