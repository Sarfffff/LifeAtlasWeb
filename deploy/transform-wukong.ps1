$src = "E:\简历\Game_Design_notes - 副本\《黑神话：悟空》拆解.md"
$postPath = "D:\MyProjects\LifeAtlasWeb\source\_posts\Black-Myth-Wukong-System-Analysis.md"
$dlPath = "D:\MyProjects\LifeAtlasWeb\source\downloads\黑神话悟空拆解.md"

# Copy original to downloads
Copy-Item $src $dlPath -Force

# Read original content
$lines = Get-Content $src -Encoding UTF8

# Build output
$out = New-Object System.Collections.ArrayList

# Frontmatter
[void]$out.Add("---")
[void]$out.Add("title: 《黑神话：悟空》系统拆解（模块化）")
[void]$out.Add("date: 2026-08-22 12:00:00")
[void]$out.Add("categories:")
[void]$out.Add("  - 游戏拆解")
[void]$out.Add("tags:")
[void]$out.Add("  - 黑神话悟空")
[void]$out.Add("  - 系统拆解")
[void]$out.Add("  - 游戏设计")
[void]$out.Add("  - 笔记")
[void]$out.Add("---")
[void]$out.Add("")
[void]$out.Add('> 📄 **完整 Markdown 版下载**：[黑神话悟空拆解.md](https://lifeatlas.cn/downloads/黑神话悟空拆解.md)')
[void]$out.Add("")

$firstLine = $true
foreach ($line in $lines) {
    # Skip the original H1 title
    if ($firstLine -and $line -match "^# 《黑神话") {
        $firstLine = $false
        continue
    }
    $firstLine = $false

    # Replace TOC anchor links: (#N-xxx) -> (#sec-N)
    $line = $line -replace '\(#(\d+)-[^\)]+\)', '(#sec-$1)'

    # Replace ## N. Title -> <h2 id="sec-N">N. Title</h2>
    if ($line -match '^## (\d+)\. (.+)') {
        $n = $Matches[1]
        $t = $Matches[2]
        $line = '<h2 id="sec-' + $n + '">' + $n + '. ' + $t + '</h2>'
    }

    [void]$out.Add($line)
}

# Write output (UTF8 without BOM)
$content = $out -join "`n"
[System.IO.File]::WriteAllText($postPath, $content, [System.Text.UTF8Encoding]::new($false))

Write-Host "Done. Post lines: $($out.Count)"
