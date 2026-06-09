# Template tài liệu

Thư mục này là mẫu chung cho các tài liệu mới, lấy cảm hứng từ cấu trúc `lpic-101-102`.

## Cách dùng

1. Sao chép toàn bộ thư mục `docs-template/` thành thư mục mới của tài liệu.
2. Mở `index.html` và chỉnh:
   - `title`
   - `seriesTitle` và `seriesDesc`
   - `logo.svg` hoặc phần logo hiển thị
3. Mở `lessons.json` và cập nhật:
   - `title`, `description`
   - `types` (phân loại bài học)
   - `lessons` (danh sách bài học)
4. Nếu cần, chỉnh `quick-links.json` để hiện dashboard liên kết nhanh.
5. Thay `VISITED_KEY` trong `doc-script.js` nếu muốn tránh trùng với các bộ tài liệu khác.

## Định dạng dữ liệu

- `types`: danh sách nhóm, mỗi nhóm có `id`, `title`, `icon`, `color`
- `lessons`: mỗi mục có `id`, `type`, `title`, `description`, `file`, `sections`, `status`, `tags`

## Lưu ý

- `index.html` và `doc-script.js` đã thiết kế để hoạt động chung với `lessons.json`.
- Nếu copy sang thư mục khác, giữ nguyên các tệp `style.css`, `doc-script.js`, `lessons.json` và `quick-links.json` để đảm bảo hoạt động.
