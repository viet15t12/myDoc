from __future__ import annotations

import argparse
import html
import json
from pathlib import Path
from datetime import datetime


def make_html(lesson: dict, series: dict | None = None) -> str:
    title = str(lesson.get("title", "Untitled lesson"))
    description = str(lesson.get("description", ""))
    lesson_id = str(lesson.get("id", ""))
    lesson_type = str(lesson.get("type", ""))
    minutes = lesson.get("minutes", "")
    sections = lesson.get("sections", "")
    status = str(lesson.get("status", "coming"))
    tags = lesson.get("tags", []) or []
    series_title = ""
    if isinstance(series, dict):
        series_title = str(series.get("title", ""))

    tag_html = "\n".join(
        f'        <span class="tag">{html.escape(str(tag))}</span>' for tag in tags
    )

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{html.escape(title)}</title>
    <style>
        * {{
            box-sizing: border-box;
        }}

        body {{
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f8fafc;
        }}

        .container {{
            max-width: 960px;
            margin: 0 auto;
            padding: 32px 20px;
        }}

        .card {{
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }}

        .badge {{
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: #f97316;
            color: white;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.03em;
            text-transform: uppercase;
        }}

        h1 {{
            margin: 16px 0 8px;
            font-size: 34px;
            line-height: 1.2;
        }}

        .description {{
            color: #4b5563;
            font-size: 18px;
        }}

        .meta {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            margin: 24px 0;
        }}

        .meta-item {{
            padding: 14px;
            border-radius: 12px;
            background: #f1f5f9;
        }}

        .meta-label {{
            display: block;
            color: #64748b;
            font-size: 13px;
        }}

        .meta-value {{
            font-weight: 700;
        }}

        .tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 16px;
        }}

        .tag {{
            display: inline-block;
            padding: 5px 10px;
            border-radius: 999px;
            background: #e0f2fe;
            color: #075985;
            font-size: 13px;
        }}

        .placeholder {{
            margin-top: 28px;
            padding: 18px;
            border-left: 4px solid #f97316;
            background: #fff7ed;
            border-radius: 8px;
        }}

        footer {{
            margin-top: 28px;
            color: #64748b;
            font-size: 14px;
        }}
    </style>
</head>
<body>
    <main class="container">
        <article class="card">
            <span class="badge">Bài {html.escape(lesson_id)}</span>
            <h1>{html.escape(title)}</h1>
            <p class="description">{html.escape(description)}</p>

            <section class="meta" aria-label="Thông tin bài học">
                <div class="meta-item">
                    <span class="meta-label">Series</span>
                    <span class="meta-value">{html.escape(series_title)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Loại</span>
                    <span class="meta-value">{html.escape(lesson_type)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Thời lượng</span>
                    <span class="meta-value">{html.escape(str(minutes))} phút</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Số phần</span>
                    <span class="meta-value">{html.escape(str(sections))}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Trạng thái</span>
                    <span class="meta-value">{html.escape(status)}</span>
                </div>
            </section>

            <section>
                <h2>Nội dung bài học</h2>
                <div class="placeholder">
                    File này được tạo tự động vì còn thiếu trong thư mục bài học.
                    Bạn có thể thay phần này bằng nội dung chi tiết của bài học.
                </div>
            </section>

            <section>
                <h2>Tags</h2>
                <div class="tags">
{tag_html if tag_html else '                    <span class="tag">chưa có tag</span>'}
                </div>
            </section>

            <footer>
                Tạo tự động lúc: {html.escape(now)}
            </footer>
        </article>
    </main>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Kiểm tra lessons.json và tạo các file HTML còn thiếu."
    )
    parser.add_argument(
        "--json",
        "-j",
        default="lessons.json",
        help="Đường dẫn file lessons.json. Mặc định: lessons.json",
    )
    parser.add_argument(
        "--dir",
        "-d",
        default="lessons",
        help="Thư mục chứa file HTML. Mặc định: lessons",
    )
    parser.add_argument(
        "--overwrite-coming",
        action="store_true",
        help="Ghi đè file đã có nếu lesson có status là coming.",
    )
    args = parser.parse_args()

    json_path = Path(args.json)
    lessons_dir = Path(args.dir)

    if not json_path.exists():
        print(f"[ERROR] Không tìm thấy file JSON: {json_path}")
        return 1

    try:
        data = json.loads(json_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"[ERROR] JSON không hợp lệ: {exc}")
        return 1

    lessons = data.get("lessons")
    if not isinstance(lessons, list):
        print("[ERROR] Không tìm thấy mảng 'lessons' trong JSON.")
        return 1

    series = data.get("series", {})
    lessons_dir.mkdir(parents=True, exist_ok=True)

    created = 0
    skipped = 0
    overwritten = 0
    invalid = 0

    for lesson in lessons:
        if not isinstance(lesson, dict):
            invalid += 1
            print("[INVALID] Lesson không hợp lệ, bỏ qua.")
            continue

        file_name = lesson.get("file")
        if not file_name:
            invalid += 1
            print(f"[INVALID] Bài {lesson.get('id', '?')} không có trường file, bỏ qua.")
            continue

        html_path = lessons_dir / str(file_name)
        exists = html_path.exists()
        is_coming = str(lesson.get("status", "")).lower() == "coming"

        if exists and not (args.overwrite_coming and is_coming):
            skipped += 1
            print(f"[SKIP]   {file_name}")
            continue

        content = make_html(lesson, series)
        html_path.write_text(content, encoding="utf-8")

        if exists:
            overwritten += 1
            print(f"[UPDATE] {file_name}")
        else:
            created += 1
            print(f"[CREATE] {file_name}")

    print("\nDone!")
    print(f"Created:     {created}")
    print(f"Skipped:     {skipped}")
    print(f"Overwritten: {overwritten}")
    print(f"Invalid:     {invalid}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
