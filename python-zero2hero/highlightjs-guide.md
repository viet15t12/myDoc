# Hướng Dẫn Tô Màu Code Bằng Highlight.js Trên GitHub Pages

## 1. Giới thiệu

Highlight.js là thư viện JavaScript giúp tự động tô màu cú pháp (Syntax Highlighting) cho nhiều ngôn ngữ lập trình như:

* Python
* C++
* C
* Java
* JavaScript
* Bash
* PowerShell
* SQL
* HTML/CSS
* Go
* Rust

Sau khi cài đặt, các đoạn mã nguồn trên website sẽ có màu sắc tương tự VS Code, giúp dễ đọc và chuyên nghiệp hơn.

---

## 2. Thêm Highlight.js vào Website

Chèn đoạn mã sau vào phần `<head>` của trang HTML:

```html
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css">
```

Chèn đoạn mã sau trước thẻ `</body>`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>

<script>
hljs.highlightAll();
</script>
```

---

## 3. Cách Viết Khối Code

### Python

```html
<pre><code class="language-python">
def cong(a, b):
    return a + b
</code></pre>
```

### Bash

```html
<pre><code class="language-bash">
git status
git add .
git commit -m "First Commit"
</code></pre>
```

### SQL

```html
<pre><code class="language-sql">
SELECT * FROM users;
</code></pre>
```

### C++

```html
<pre><code class="language-cpp">
#include <iostream>

int main() {
    std::cout << "Hello World";
    return 0;
}
</code></pre>
```

---

## 4. Các Theme Phổ Biến

### Atom One Dark (Khuyến nghị)

```html
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css">
```

### GitHub Dark

```html
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css">
```

### VS2015

```html
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/vs2015.min.css">
```

---

## 5. Kiểm Tra Hoạt Động

Mở trình duyệt và nhấn:

```text
F12 → Console
```

Nhập:

```javascript
console.log(hljs.versionString);
```

Nếu xuất hiện:

```text
11.11.1
```

thì Highlight.js đã được tải thành công.

---

## 6. Ví Dụ Hoàn Chỉnh

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css">
</head>
<body>

<pre><code class="language-python">
def cong(a, b):
    return a + b
</code></pre>

<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>

<script>
hljs.highlightAll();
</script>

</body>
</html>
```

---

## 7. Khuyến Nghị Cho Website Học Git/Python

Nên sử dụng:

* Theme: Atom One Dark
* Highlight.js 11.11.1
* Nút Copy Code
* Hiển thị số dòng (Line Number)
* Khối code nền tối

Cấu hình này cho giao diện gần giống VS Code và phù hợp với GitHub Pages.
