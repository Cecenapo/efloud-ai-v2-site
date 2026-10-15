# Kaynak–Kod Denetimi (EFLOUD AI 2.0, 15 Ekim 2026)

## Karar: SOURCE_RULES_AWAITING_VERIFICATION

Kullanıcının talebi: eğitimde doğrulanmayan parametre, sinyal veya kâr iddiaları aktif üründen çıkarılacak. Bu nedenle eski ve yeni iki otomatik pivot/sinyal motoru da **iptal edildi**. Kaynakla doğrulanmış tam bir otomatize giriş–stop–hedef ve fill tanımı ortaya konana kadar **sinyal sayısı = 0, kanıtlı backtest = 0**.

## Gerçekte kaynakta desteklenenler
EFLOUD 44 ders editoryal atlas:
- Ders 3: Range High, Range Low, EQ=(RH+RL)/2; range seçiminin bağlamsal ve kısmen öznel olduğu söyleniyor. Örnek kaynak: `Screen_Recording_20260923_194148_Chrome.mp4`, 06:40 kaynak kare.
- Ders 4: sweep/deviation ile gerçek breakout birbirinden ayrılır.
- Ders 10: OTE 0,618–0,786 aralığı, 0,705 referansı. Swing seçimi ve bağımsız fiyat teyidi olmadan giriş değildir.
- Ders 13: Actual gap, üç-mum FVG, liquidity void farklı bağlamlara sahiptir. Sabit FVG tetikleyicisi yoktur.
- Ders 14: Major/minor swing ve “dördüncü mum kuralı” tartışılır. Eğitmenin tam koşulu video kareleriyle doğrulanmadan 3 sol/3 sağ gibi kodlanamaz.
- Kaynak raporda geçen birçok `[BOT HİPOTEZİ]` ifadesi eğitmenin zorunlu otomatik işlem kuralı değildir.

## Silinen aktif davranışlar
1. Son 48 mumun high/low'uyla range üretmek;
2. “Doğrulanmış pivot” diye 3 soldan 3 sağdan mum filtresini ve %8 bant toleransını kaynak kuralı ilan etmek;
3. Her sınırda iki tekrarlı temasın zorunlu range onayı sayılması;
4. FVG retestte seçilen kapanış; OTE bandında bullish/bearish tek mum; basit breakout mumuna bağlanan hazır sinyal üretimi;
5. Filtresiz olayın yanı sıra RedK RSI > 50, son 3 barda Stoch flip, CCI eğimi ve MACD genişlemesini ayrı doğrulanmış giriş teyitleri saymak;
6. Stop'a 0,15 ATR eklemek; hedefi 0,55 × range'e mekanik projekte etmek;
7. 0,5R minimum filtre, 72 mum zorunlu timeout;
8. Gerçek borsa komisyon bilgisi ve kayıtlı fill olmadan 7,5bp ücret + 5bp kayan varsayımla hesaplanan “NET R”;
9. 30 işlemde onay, 25 gözlem ağırlığı / 70-30 bölme gibi örneklem seçimlerini EFLOUD'un kanıtlı performansı göstermek için kullanmak;
10. 20 aile × altı kol × 1280 tarif = 7.680 ve 245.760 planlanan deneyi çalışılmış veya doğrulanmış strateji göstermek.

## Gerçek hizmet
- GitHub Pages ücretsiz, statik HTML/JS/CSS.
- BTC/ETH/SOL/DODO Binance Spot halka açık gerçek fiyat verileri.
- Günlük sınırlı sayıda gerçek kapanmış Binance OHLC mumunun erişim ve bütünlük kontrolü.
- `source_policy.py` tek kaynak doğrulama kapısı; açık `0` onaylı tam otomatik kural.
- `source_range.explained_range` ancak **kaynağa dayalı önceden teyit edilmiş açık iki fiyat ve tarih girildiğinde** EQ hesaplar; kendi pivotlarını seçmez.
- `paper_forward.py` doğrulanmamış işlem açmaz, kapatmaz, kazanç raporlamaz veya “öğrenmiş” iddiası yaratmaz.

## Kaynağa geri dönüş koşulu
Her aday setup için: kaynak video ID'si, zaman kodu ve özgün kare; olay anında bilinen HTF/LTF swing bağlamı ve onay zamanı; bağımsız LTF tetikleyici; gerekçeli giriş; yapısal geçersizlik/stop; makul hedef; spot/futures uygulanabilirliği, kullanıcıya/gerçek piyasaya ait maliyet/işlem dolumu kanıtı. Bu alanlardan eksik olan **UNVERIFIED / NO TRADE**.

RedK kaynak Pine kodu **ayrı bir indikatördür**; EFLOUD hocasının giriş kuralına otomatik dahil edilemez.

Bu dosya uygulanan kuralların değişiklik günlüğüdür; geçmiş git commitleri tarihsel git kayıtlarında kalır, aktif ürünün bir parçası değildir.
