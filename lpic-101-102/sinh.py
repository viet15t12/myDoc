import json
from pathlib import Path

json_file = "lessons.json"
output_dir = Path("html_output")
output_dir.mkdir(exist_ok=True)

with open(json_file, "r", encoding="utf-8") as f:
    data = json.load(f)

for lesson in data["lessons"]:
    filename = lesson["file"]
    filepath = output_dir / filename

    html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hello</title>
</head>
<body>
    <h1>Hello</h1>
</body>
</html>
"""

    filepath.write_text(html_content, encoding="utf-8")
    print(f"Đã tạo: {filepath}")

print("Hoàn tất!")