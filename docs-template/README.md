# Docs template

Thư mục này là mẫu chung cho các tài liệu mới, đồng bộ theo giao diện hiện tại của `python-zero2hero`.

## Cách dùng

1. Sao chép toàn bộ thư mục `docs-template/` thành thư mục mới của tài liệu.
2. Mở `lessons.json` và cập nhật:
   - `series.title`, `series.titleHtml`, `series.description`, `series.mark`
   - `series.logo`, `series.logoAlt`, `series.accent` nếu muốn dùng logo SVG và màu chủ riêng
   - `types` (phân loại bài học)
   - `lessons` (danh sách bài học)
3. Tạo các file bài học HTML tương ứng với trường `file`.
4. Nếu cần, cập nhật `../quick-links.json` ở thư mục gốc để dashboard lộ trình thấy khóa mới.

## Định dạng dữ liệu

- `series`: tiêu đề, mô tả và ký hiệu ngắn của bộ tài liệu
- `types`: danh sách nhóm, mỗi nhóm có `id`, `title`, `icon`, `color`
- `lessons`: mỗi mục có `id`, `type`, `title`, `description`, `file`, `sections`, `status`, `tags`

## Lưu ý

- `index.html` dùng `dashboard-script.js` cho trang danh sách bài.
- Trang bài học dùng `doc-styles.css` và `doc-script.js`.
- Giữ nguyên các file `style.css`, `dashboard-script.js`, `doc-styles.css`, `doc-script.js` khi nhân bản template.
