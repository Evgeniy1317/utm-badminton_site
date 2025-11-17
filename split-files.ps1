# Скрипт для разделения CSS и JS файлов на модули

$cssFile = "css/style.css"
$jsFile = "script.js"

# Читаем CSS файл
$cssContent = Get-Content $cssFile -Raw -Encoding UTF8

# Разделяем CSS на секции по комментариям
$cssSections = @{
    "variables" = @{
        "start" = 1
        "end" = 233
    }
    "common" = @{
        "start" = 234
        "end" = 289
    }
    "header" = @{
        "start" = 290
        "end" = 1400
    }
    "hero" = @{
        "start" = 1401
        "end" = 1600
    }
    "buttons-sections" = @{
        "start" = 1601
        "end" = 1707
    }
    "about" = @{
        "start" = 1708
        "end" = 1879
    }
    "trainer" = @{
        "start" = 1880
        "end" = 1977
    }
    "halls" = @{
        "start" = 1978
        "end" = 2125
    }
    "schedule" = @{
        "start" = 2126
        "end" = 2238
    }
    "booking" = @{
        "start" = 2239
        "end" = 2315
    }
    "photo-modal" = @{
        "start" = 3010
        "end" = 3063
    }
    "contact" = @{
        "start" = 3279
        "end" = 3517
    }
    "footer" = @{
        "start" = 3518
        "end" = 3775
    }
    "faq" = @{
        "start" = 3776
        "end" = 4012
    }
    "animations" = @{
        "start" = 4209
        "end" = 4254
    }
}

# Создаем файлы для каждой секции CSS
$cssLines = Get-Content $cssFile -Encoding UTF8
foreach ($section in $cssSections.Keys) {
    $start = $cssSections[$section]["start"] - 1
    $end = $cssSections[$section]["end"] - 1
    $sectionContent = $cssLines[$start..$end] -join "`n"
    $outputFile = "css/blocks/$section.css"
    Set-Content -Path $outputFile -Value $sectionContent -Encoding UTF8
    Write-Host "Created: $outputFile"
}

Write-Host "CSS files created successfully!"

