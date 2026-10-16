# EFLOUD AI 2.0 — Kaynak doğrulamalı araştırma paneli

**Web sitesi:** https://cecenapo.github.io/efloud-ai-v2-site/

## 16 Ekim 2026 — Bağımsız deneysel araştırma yeniden açıldı

**İki motor bilinçli olarak ayrı tutulur.** `source_policy.py` ve `learning_state.json` eğitmenin kaynak-video ile onaylanmış otomatik al/sat stratejilerini tutar: **şu an sıfır**. `scripts/experimental_lab.py` ise tamamen ayrı bir **mühendislik araştırma laboratuvarıdır**: `SWING_SWEEP` ve `PIVOT_BREAK` olaylarını çalışır veriyle tarar. Bu işlemler eğitmenin birebir sayısal stratejileri değildir.

- Günlük: GitHub Actions yalnız kapanmış Binance Spot mumlarıyla 32 sembol/periyot kombinasyonunda tarihsel olayları, bir sonraki bar açılışını, stop/TP önceliğini ve kronolojik eğitim–validasyon–holdout dönemlerini inceler; `experimental_lab.json` oluşturur.
- Saatlik: Son kapanmış mumdaki deneysel olayları `experimental_radar.json` içine yalnız **ARAŞTIRMA ADAYI** olarak kaydeder; gerçek emre, fill'e veya kâr/zarar raporuna dönüştürmez.
- Her olayda RH/RL pivot fiyatı, pivotun teyit edildiği mum, göstergesel sinyal kapanışı, yapısal geçersizlik ve geçmişte bilinen hedef saklanır. Giriş *sinyal kapanışı değildir*; tarihsel simülasyonda ancak **sonraki mumun açılışı** kullanılır.
- Araştırma sayısal parametreleri: pivot sol/sağ 2/2, 3/3, 4/4; maksimum gözlem ufku 48 mum; doğrulanmış pivot arama belleği 180 mum; varsayımsal maliyet senaryoları 0, 10, 30 baz puan.
- Bunlar **kullanıcı/EFLOUD eğitmeni tarafından onaylanmış sabit kurallar değildir**. Stres/holdout testleri geçilmeden bir hipoteze avantaj iddiası yazılmaz. Testi geçse dahi ancak deneysel araştırma adayıdır; yatırım tavsiyesi değildir.
- Açık maliyet senaryoları **gerçek komisyon/slippage değildir**. Hiçbir gerçek emir veya gerçek net R kaydı yoktur.
- Grafik: deneysel olay seçildiğinde çizgiler **kesikli ve DENEY** etiketlidir. Kaynaktan teyitli grafik/strateji kapısı ayrı ve hâlâ kapalıdır.

Bu ayrım, "eğitimden öğrenen bir bot" beklentisi ile "bağımsız hipotezleri test et" beklentisini sahte bir eğitmen kuralı icat etmeden birleştirmek içindir. Çalışmanın kanıtı `experimental_lab.json` dosyasındaki örneklem sayıları, kronolojik holdout ve stres maliyeti sonuçlarıdır.

## Mevcut durum (15 Ekim 2026)

**Yalnız doğrulanabilir piyasa verisi ve eğitimde gerçekten anlatılmış kavramlar görüntülenir.**

GitHub Pages üzerinde ücretsiz statik panel; Binance Spot halka açık fiyat ve OHLC kaynağı; GitHub Actions ile saatlik fiyat özeti, günlük kapanmış mum erişim denetimi.

**Şu anda otomatik işlem sinyali YOK.** Eski otomatik Range Sweep, Breakout, FVG Retest, OTE, RedK RSI/Stoch/CCI/MACD filtreleri eğitimden doğrulanmış eksiksiz emir kuralları değildi. 48 mum, 0,15 ATR, 0,55 range; daha sonra eklenen pivot 3/3, %8 fiyat toleransı, 2 temas, en az 0,5R, 72 mum zorunlu kapanış, 7,5bp ücret ve tahmini spread/slippage de aynı şekilde kullanıcıdan veya eğitmen kaynaklarından kanıtlanmış kesin işlem parametreleri değildi.

Bunlar aktif sinyal/backtest/öğrenme motorlarından çıkarıldı. Eski 576 deney sonucu, 7.680 model tarifi, 245.760 deney planı ve eski paper pozisyonları **mevcut doğrulanmış strateji sonucu olarak yayımlanmaz**. Doğrulanmamış kazanma oranı, beklenen net R veya güven skoru verilmez.

### Gerçek kaynak kavramları

- **Ders 3:** Range High, Range Low ve Equilibrium. Range pivot seçimi bağlama duyarlı; tek zorunlu mum sayısı yok.
- **Ders 4:** Deviation, likidite sweep ve mum kapanışıyla kırılım farkı.
- **Ders 10:** Fibonacci OTE 0,618–0,786; **dokunması tek başına işlem gerekçesi değildir**.
- **Ders 13:** Actual gap, üç-mum FVG ve liquidity void farklıdır.
- **Ders 14:** Piyasa yapısı major/minor swing, pivotun teyit zamanı; kitap “dördüncü mum kuralını” anıyor ama karelerle koşulları teyit etmeden otomasyon yapılamaz.
- **RedK:** Kullanıcının ayrıca sağladığı osilatör Pine kodunun kendi standart RSI, Stoch, CCI, MACD kaynakları vardır; bunları EFLOUD eğitiminden onaylı al/sat filtreleri olarak yorumlamak yanlış olur.

Editoryal 44 ders derlemesinin içinde **[BOT HİPOTEZİ]** ve **[ALGORİTMA TASARIMI — YALNIZCA ARAŞTIRMA HİPOTEZİ]** ifadeleri geçmektedir. Bunlar eğitmenin açıklanmış kesin otomatik işlem algoritması olarak kabul edilemez.

### Kod yapısı

| Dosya | Çalışan ve doğrulanabilir işlev |
|---|---|
| `scripts/source_policy.py` | Kaynak/provenans denetimi, onaylı otomatik sinyal sayısı 0 |
| `scripts/source_range.py` | Yalnızca **dışarıdan açıkça seçilmiş ve teyitlenmiş** RH/RL'ye göre EQ hesaplama; otomatik pivot/range seçimi yok |
| `scripts/research_engine.py` | Gerçek Binance kapanmış mum sayısı ve erişim aralığı denetimi; strateji kârlılık simülasyonu yok |
| `scripts/paper_forward.py` | Kaynak doğrulama kapısı; uydurma emir, stop/TP, ücret, R veya öğrenme ağırlığı üretmez |
| `scripts/collect_live.py` | Anahtarsız, okuma amaçlı gerçek piyasa fiyat özeti |
| `app-chart-v2.js`, `setup-chart.js` | Kaynak kavramları, fiyatlar, gerçek OHLC grafiği; onaysız işlem çizgisi yok |
| `.github/workflows/*` | Ücretsiz halka açık depo üzerinde saatlik veri + günlük kapsam denetimi |

### Denetim standartları

Eksiksiz otomatik kurallara geçişte her sinyal için kaynak ders/video/kare/zaman, HTF/LTF, RH/RL veya swing teyit anı, giriş tetikleyicisi, geçersizlik/stop gerekçesi, hedef gerekçesi, emir tipi ve gerçek spread/ücret/kayma varsayımları **kaynaklardan açıkça doğrulanmalıdır**. Sadece kavramın videoda geçmesi, tam emir algoritmasının doğrulandığı anlamına gelmez.

- **Testler:** `PYTHONPATH=scripts python -m unittest discover -s scripts -p 'test_*.py'`
- **Ücretsiz:** GitHub Pages statik barındırma; herkese açık repo standart Actions. Platformlar hız, çalıştırma ve kota politikalarını değiştirebilir. Ücretli hizmete otomatik geçiş yok.
- **Emir:** Gerçek emir yok. Spot SHORT emir yok. Doğrulanmış edge yok.

Kaynak denetimi ayrıntıları: [SOURCE_RULE_AUDIT.md](docs/SOURCE_RULE_AUDIT.md).
