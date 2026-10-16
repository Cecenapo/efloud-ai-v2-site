# RedK Indicator Amplifier × EFLOUD AI 2.0 — Deneysel Araştırma

**Kaynak:** Kullanıcının 16.10.2026 tarihinde sağladığı
\`EFLOUD_AI2_RedK_7680_Model_Entegrasyonu(1).zip\`.

**Orijinal gösterge:** RedK Indicator Amplifier v1.0, © RedKTrader,
[Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).
Kaynak amp dosyası \`backend/features/redk_amplifier.py\` ve filtreleri
\`backend/research/amplifier_filters.py\` arşivdeydi. Bu repodaki
\`scripts/redk_features.py\` aynı varsayılan dört osilatörün neden-sonuç
bağımlılığını ve beş filtre maskesini bir veri-adaptörü olarak taşır.
Dosyanın üstünde SPDX ve orijinal yazar/lisans bilgisi vardır.
**RedK i-Amp, tek başına otomatik kârlı işlem stratejisi değildir**:
kaynak osilatörün seviye/flip bilgilerini görselleştiren/genişleten yardımcı
araçtır.

## Denenmeye başlayan altı kol

| Kod | Kaynaktan türetilen hipotez, sinyal kapanışında | Tür |
|---|---|---|
| none | Hiç indikatör kapısı yok | Filtresiz kontrol |
| rsi_bias | RSI(14) merkez-50 tarafı işlem yönüyle aynı | Araştırma |
| stoch_flip_recent | Stochastic(14,3) tarafı ve son 3 kapanmış mumda merkez flip | Araştırma |
| cci_impulse | CCI(20), kapanış fiyatına göre, işaret + bir mumluk eğim yönünde | Araştırma |
| macd_expansion | MACD histogram(12,26,9) işareti + bir mumluk değişim yönünde | Araştırma |
| rsi_macd_agree | RSI ve MACD histogram işareti aynı yönü gösteriyor | Araştırma |

Scaling: RSI/Stochastic \`(osc - 50)/50\`; CCI/MACD histogram \`osc / max(abs(osc), son 100 kapalı bar)\`. Yetersiz warm-up **NaN** olarak kalır ve filtreyi geçemez. RedK Amplifier'daki \`peak hold\` ve seviyeler özellik matrisine eklenir ancak **ayrıca işlem emri üretmez**.

### Yöntem

- Sabit EMA/RSI eşiği gibi filtreleri **EFLOUD eğitmen kuralı** olarak etiketleme.
- Price Action araştırma motorunun (\`SWING_SWEEP\`, \`PIVOT_BREAK\`) **aynı tarihsel olay listesine** RedK filtrelerini uygula. Bu olayların pivot parametreleri de ayrı mühendislik araştırma hipotezleridir.
- İndikatörü **yalnızca sinyalin kapanmış mumundaki** bilgiyle değerlendir; ileri veri/backfill yok.
- Simülasyon girişi sonraki mum açılışı; hem stop hem hedef aynı mumdaysa stop varsayılır. **Gerçek dolum değildir.**
- Kronolojik dönem: ilk %60 eğitim, sonraki %20 validasyon, son %20 holdout. Sınırı aşan açık gözlemler sonuçlara alınmaz.
- **0, 10, 30 baz puan** round-trip *maliyet senaryoları*; gerçek Binance hesap masrafı/spread/slippage değildir.
- Filtreli alt grup / filtresiz grup OOS işlem sayısını ve ortalama R'yi **birlikte** raporla. Farkın pozitif olması tek başına indikatörün işe yaradığını kanıtlamaz (farklı olay sayısı, çoklu test ve birbirine bağımlı setup).
- **Holdout'ta en iyi kolu seçip onun holdout başarısını yeni bağımsız doğrulama gibi sunma.** İleri dönemde yeni mumlar ve daha fazla maliyet gözlemi gereklidir.
- Gösterim: adaylarda ayrı RedK kapı bilgisi ve RedK alt grup araştırması; ayrı **"RedK · 6 kol karşılaştırması"** sekmesi.
- **Gerçek emir YOK**, broker API, kaldıraç, şifre/anahtar, ücretli altyapı kullanılmaz. Source gate (öğretmen onaylı sinyal) bağımsız kalır.

### Veri dosyaları ve durum

- \`experimental_lab.json\`: daily backtest; \`reports[].redk_ablation\` içinde altı kolun train/validation/holdout R, işlem sayısı, maliyet stresleri.
- \`experimental_radar.json\`: saatlik kapanmış gerçek mumun \`redk_ablation_filters\` maskesi ve varsa tarihsel alt grup kanıtı.
- \`scripts/redk_features.py\`: orijinal yüklenen amp uyarlaması.
- \`scripts/redk_ablation.py\`: karşılaştırma ve maliyet-senaryo testi.
- \`scripts/test_redk_features.py\`: arşivdeki osilatörün **sayısal referans değerlerine karşı regresyon** ve future-lookahead testleri.
- \`.github/workflows/daily-research.yml\` / \`hourly-prices.yml\`: açık GitHub deposunda ücretsiz çalışabilen scheduled işler.

Yüklenen ZIP'in \`7680\` model/ \`245760\` planlı test rakamları **sadece arşivdeki tarif sayılarıdır**. Bu sürümde bunların tamamı çalıştırılmış veya kazandırmış gibi ilan edilmez. Biz iki deneysel Price Action ailesini ve altı RedK kolunu **somut tarihsel veri ve şeffaf OOS** ile karşılaştırıyoruz.

**Kârı ve başarı oranını artırdığı kanıtlanırsa** veriye göre bunu raporlayacağız; gerçekleşmediğinde açıkça "fayda bulunmadı" diyeceğiz.
