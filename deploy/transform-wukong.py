import re

src = r"E:\简历\Game_Design_notes - 副本\《黑神话：悟空》拆解.md"
post_path = r"D:\MyProjects\LifeAtlasWeb\source\_posts\Black-Myth-Wukong-System-Analysis.md"

with open(src, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

out = []
# Frontmatter
out.append("---")
out.append("title: 《黑神话：悟空》系统拆解（模块化）")
out.append("date: 2026-08-22 12:00:00")
out.append("categories:")
out.append("  - 游戏拆解")
out.append("tags:")
out.append("  - 黑神话悟空")
out.append("  - 系统拆解")
out.append("  - 游戏设计")
out.append("  - 笔记")
out.append("---")
out.append("")
out.append('> 📄 **完整 Markdown 版下载**：[黑神话悟空拆解.md](https://lifeatlas.cn/downloads/黑神话悟空拆解.md)')
out.append("")

first_line = True
for line in lines:
    # Skip the original H1 title
    if first_line and re.match(r'^# 《黑神话', line):
        first_line = False
        continue
    first_line = False

    # Replace TOC anchor links: (#N-xxx) -> (#sec-N)
    line = re.sub(r'\(#(\d+)-[^\)]+\)', r'(#sec-\1)', line)

    # Replace ## N. Title -> <h2 id="sec-N">N. Title</h2>
    m = re.match(r'^## (\d+)\. (.+)', line)
    if m:
        n = m.group(1)
        t = m.group(2)
        line = f'<h2 id="sec-{n}">{n}. {t}</h2>'

    out.append(line)

result = '\n'.join(out)

with open(post_path, 'w', encoding='utf-8') as f:
    f.write(result)

print(f"Done. Total lines: {len(out)}")
