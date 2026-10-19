# EFLOUD — Eğitmenin kendi kuralları (ham dökümlerden)

Kaynak: Drive'daki ders dökümleri (Whisper ASR; bozuk kelimeler olabilir, sayılar ve seviyeler karelerle doğrulanmalı).
Her kural: **ID · ders · zaman damgası · eğitmenin dediği (sadık özet) · tür · botta durum**.
Türler: **M** = mekanik (koda dökülebilir), **F** = bağlam/filtre, **Y** = yargı (göz kararı, otomatikleşmesi tartışmalı).

Durum: ✅ tamamlandı · ⏳ sırada

| Ders | Durum |
|---|---|
| 19 MSB / Breaker | ✅ |
| 44 EUR/USD + DXY | ✅ |
| 14 Market Structure/Swing ✅ |
| 4 Range/Deviation/EQ ✅ |
| 24 Öncelikli konseptler ✅ |
| 18 Order Block / EFLOUD OB ✅ |
| 22 Likidite ✅ |
| 28 Risk azaltma / ödül optimizasyonu ✅ |
| 10 Fibonacci retracement / OTE / clustering ✅ |
| 13 Imbalance / FVG / gap ✅ |
| 26 SFP / Failure Swing ✅ |
| 30 Karşı-trend risk, kısmi kâr, BE ✅ |
| 25 Zaman dilimi ve trader modeli ✅ |
| 23 Confluence (altın 1s örneği) ✅ |
| 17 Supply/Demand temelleri ✅ |
|  22 Likidite, 26 SFP, 3 Range, 17–18 S&D/OB, 10–11 Fib, 13 FVG, 25–32 Risk/Yönetim, 37–43 Vakalar | ⏳ |

---

## Ders 19 — Market Structure Break (MSB) / Breaker

**K19.1 · 00:01:00–00:01:22 · M** — Fiyat LL/LH ile düşerken **son lower high'ı yukarı kırarsa** MSB oluşur; HH/HL ile yükselirken **son higher low'u aşağı kırarsa** MSB oluşur. Kırılan bölge "breaker" sayılır.

**K19.2 · 00:01:38–00:01:45 · Y** — Önce piyasanın **range mi trend mi** olduğuna bak. Kırılımdan sonra **retest'i bekle**, hedef bir sonraki likidite bölgeleridir.

**K19.3 · 00:01:45–00:01:53 · F** — Trend içindeki bir kırılım çoğu zaman %100 dönüş değildir; **kısa bir geri çekilme** olup trend devam edebilir.

**K19.4 · 00:01:56–00:02:16 · M/Y** — Yüksek/düşük likiditesi (stop avı) temizlendikten sonra o noktanın kırılması da breaker sayılır; bu **Swing Failure Pattern (SFP)** kavramıdır.

**K19.5 · 00:02:18–00:02:28 · F** — Trend piyasada kırılım sonrası geri çekilme **sığ** kalır; **range/yatay** piyasada fiyat daha **derine** geri çekilir.

**K19.6 · 00:03:06–00:03:40 · M** — Kırılımdan sonra son LL ile kırılım sonrası oluşan son swing high arasına **Fibonacci** uygula; fiyatın **ucuz bölgeye (%50 altı)** ve **OTE 0,618–0,786 (orta ≈0,705)** bölgesine geri çekilmesi avantajlıdır.

**K19.7 · 00:03:44–00:04:00 · Y** — Aynı yerde **imbalance + order block + SFP + ucuz bölge + OTE** üst üste biniyorsa işlem lehine koşul çoktur; yine de %100 yok, koşul sayısı arttıkça olasılık artar.

**K19.8 · 00:04:31–00:04:55 · M** — Eğitmenin kullanımı: LL yapısından sonra **fitil bırakan mumun üstünde mum kapanışı** gelirse, **o mumun gövdesi** fiyatın geri çekilebileceği bölge olarak kullanılır. Fitil de kullanılabilir (tercih); **gövde** ona göre daha etkili. *(Bu, "kırılan seviyeye limit" kuralımdan farklı.)*

**K19.9 · 00:06:59–00:07:21 · F** — **Sadece breaker kırıldı diye işlem alınmaz**; yanında başka koşul (imbalance, konsolidasyon 0,5, OTE, HTF bölge) gerekir.

**K19.10 · 00:09:53–00:10:13 · M** — Girişi kaçırdıysan range high retest'inden gir; **stop**: range'in kırıldığı ve deviation beklemediğin yerde **en yakın imbalance'ın hemen altındaki swing low'un altı**.

**K19.11 · 00:10:35–00:10:50 · F** — "Trend ve HTF büyüktür." Breaker **doğru bölgelerde** aranmalı; her kırılımı breaker sayma.

**K19.12 · 00:11:14–00:11:41 · F** — En iyi çalıştığı yer: **HTF'de kurumsal bölgeden tepki** → ardından **LTF'de (15m/30m) breaker/MSB** oluşması. LTF'deki pozitif emare **ek onay**dır.

**K19.13 · 00:11:49–00:12:00 · Y** — Farklı zaman dilimi, market ve dönemde **geriye dönük test** yap; her koşulda **stop loss** zorunlu.

**K19.14 · 00:10:20–00:10:35 · M** — Aynı yapıda stop kullanılarak yakalanamayan ideal giriş yerine daha geç girişle RR düşer (örnekte ~0,6R fark); yani **geç girişin RR bedeli bilinir**.

---

## Ders 44 — EUR/USD + DXY (Euro-USD analizi)

**K44.1 · 00:00:56–00:01:21 · F/Y** — ~1,159 bölgesinde **alarm** kurulur; 1,163 (**flip bölgesi**) geri kazanılmadıkça düşüş bakışı korunur. Alarm = işlem açma emri değil.

**K44.2 · 00:01:46–00:02:37 · F** — DXY'deki **open/closed actual gap** bölgeleri destek/direnç olarak izlenir; **kapanmış gap'ler** de destek/direnç olabilir. Bitcoin'de CME hafta sonu gap'leri benzer şekilde kullanılır.

**K44.3 · 00:02:54–00:03:08 · F** — EUR/USD seviyesi ile **DXY'deki imbalance/destek bölgesinin çakışması**, işleme **daha emin** girmeyi sağlar (confluence).

**K44.4 · 00:03:18–00:03:22 · Y** — **Konfirmasyon beklemekten zarar gelmez**; daha güvenli, daha etkili işlem sağlar.

**K44.5 · 00:03:33–00:03:57 · Y** — Hedef seçimi: **likiditesi temizlenmemiş** bölge hedef olarak kullanılır; bearish piyasada üstteki likidite yerine **imbalance bölgeleri** da hedef olabilir. *(ASR belirsiz; kareden doğrulanmalı.)*

**K44.6 · 00:04:10–00:04:28 · M/Y** — Alarm bölgesine ilk gelen **istekli mumda** direkt işlem açma; bölge 1,163 civarında **imbalance + supply** olduğu için **ekstra konfirmasyon** ara.

**K44.7 · 00:04:30–00:04:45 · M** — Konfirmasyon: fiyat bir **high yapıp lower high** oluşturur ve **altında kapanış** gelirse bu bölge **mitigation/breaker** olur; fiyat buraya **retest** verir (minimal imbalance bölgesine).

**K44.8 · 00:04:51–00:05:00 · M** — **Stop**: 1,163 flip bölgesinin **üstü** (flip geri kazanılmadıkça fikir geçerli; geri kazanılırsa fikir bozulur).

**K44.9 · 00:05:08–00:05:27 · M/Y** — **Hedef**: yakın likidite seviyeleri. "Her şey kitabına uygun": **konfirmasyon yapısı + HTF imbalance dolumu + temizlenmemiş likidite hedefi** birlikte.

**K44.10 · 00:05:40–00:06:31 · F** — EUR/USD–DXY korelasyonu eğitmene göre yaklaşık **%60–85**, USD/JPY ile pozitif. **SMT divergence**: GBP/USD low yapmazken EUR/USD low yaparsa DXY zayıflığı → long düşünülebilir. *(Rakamlar ASR'den; doğrulanmadan sabit katsayı kullanma.)*

---

## Bu iki dersten çıkan ve botumu doğrudan etkileyen düzeltmeler

1. **Giriş bölgesi**: eğitmen "kırılan seviyenin tam fiyatına limit" demiyor; **kırılımı yapan mumun gövdesi/imbalance/breaker bölgesi** diyor (K19.8, K44.7). Botum seviyeyi tek fiyat olarak alıyor → **düzeltilmeli**.
2. **Stop**: ATR tamponu eğitmenin değil. Eğitmen **yapısal flip bölgesinin / imbalance altındaki swing'in ötesine** koyuyor (K44.8, K19.10) → **düzeltilmeli**.
3. **Hedef**: "en yakın pivot" benim kararım. Eğitmen **temizlenmemiş likidite** ve **imbalance** diyor (K44.5, K44.9).
4. **Giriş koşulu tek başına yetmez**: K19.9 ve K19.12 → **çoklu koşul (confluence)** gerekiyor: HTF bölge tepkisi + LTF MSB + OTE/imbalance.
5. **Fibonacci/OTE (0,618–0,786, orta 0,705)** eğitmenin kuralı ve botta yok (K19.6).
6. **Range mi trend mi** ayrımı (K19.2, K19.5) eğitmende giriş derinliğini belirliyor; botta yok.
7. Eğitmenin kuralları büyük ölçüde **yargı + confluence**; tamamı tek bir mekanik formüle inmiyor. Bunu bot tasarımında açıkça ayırmak gerekiyor.


---

## Ders 14 — Market Structure, swing tespiti, MSB, geri çekilme, zaman dilimi

**K14.1 · 00:04:37–00:04:50 · M** — Swing gürültüsünü azaltmak için eğitmenin **3 kuralı** var; **ikisini açıkladı**, üçüncüsünü "sır, kendiniz bulun" diyerek vermedi. Yani swing tanımı eğitmende tam açıklanmış değil.

**K14.2 · 00:05:10–00:05:33 · M (belirsiz)** — **Dördüncü mum kuralı (swing high)**: tepe mumundan sonra fiyat, tepeyi yapan mumun **bir altındaki/öncesindeki mumun** altında (fitil ya da gövde fark etmez) işlem görürse o tepe **geçerli swing high** olur. **Swing low** için ayna: fiyat, ilgili mumun **kapanışından daha yüksekte** işlem görürse geçerli swing low. *(ASR bozuk: "hangi mumun altı/kapanışı" kare ile doğrulanmalı. 4. dersin kitap metni de bu kuralı "kesin kod ilan etme" diye uyarıyor.)*

**K14.3 · 00:05:47–00:06:08 · M** — **Breakout candle kuralı**: bir high/low bölgesi **tek, istekli bir mumla terk edilmişse** (yukarı ya da aşağı fark etmez) o nokta, 4. mum kuralı sağlanmasa bile **geçerli swing** sayılır.

**K14.4 · 00:06:08–00:06:27 · F** — Aynı swing **hem 4. mum hem breakout** kuralını sağlıyorsa **daha önemli** sayılır ("daha dikkatli almam gereken swing low"). İki kural yeterli; üçüncü "o kadar elzem değil".

**K14.5 · 00:07:00–00:07:29 · M** — **Swing hareketi = impulsive hareket** (dalga 1–2–3–4 mantığı); swing high/low bu hareketlerin uçlarıdır.

**K14.6 · 00:07:47–00:08:06 · M** — **Bearish yapı**: LH ve LL. **Yapı bozulması (MSB)**: LL/LH yapıdan sonra **son lower high'ın kırılması**. Tersi bullish. (K19.1 ile aynı.)

**K14.7 · 00:08:06–00:08:26 · M/Y** — Kırılımdan sonra **3 senaryo** aklında olmalı: **(1)** hiç geri çekilmeden devam, **(2)** eski high/LH bölgesine **normal geri çekilme**, **(3)** **derinlemesine** geri çekilme.

**K14.8 · 00:11:48–00:12:04 · F** — Daha önce **test edilmemiş swing high/low** noktaları, fiyat döndüğünde **tepki alma ihtimali yüksek** bölgelerdir ("untested").

**K14.9 · 00:13:33–00:14:14 · M** — **Derin geri çekilmede** iki araç: **Fibonacci retracement** ve **hareketli ortalamalar (EMA)**. Geri çekilme **0,618–0,786 (OTE, 0,5'in altı)** bölgesine gider. *(EMA'yı kendisi az kullanıyor; "indikatörler fiyatın yansıması" diyor.)*

**K14.10 · 00:17:09–00:17:26 · F** — Bearish dönüş şüphesinde **LH + OTE + imbalance** üst üste biniyorsa bearish evrilmenin **göstergesidir**. LH kaybı (kırılması) olursa yapı bearish'e evrilir.

**K14.11 · 00:18:26–00:19:04 · F** — **Yükseliş yorgunluğu emareleri**: **(1)** eskiden hiç geri çekilmeden yükselen fiyat swing high'lara **geri çekilme vermeye başlar**, **(2)** platformdaki **swing low kaybedilir**.

**K14.12 · 00:19:29–00:19:47 · M** — **Erken sinyal**: swing low'un **altına fitil sarkması** (yeni low) = **erken sinyal**; **gövde kapanışı** = **daha yüksek konfirmasyon** (eğitmen için kapanış daha iyi). *(Bu, botumdaki "yalnız kapanış" kuralıyla uyumlu; fitil erken sinyal ayrı bir kademe.)*

**K14.13 · 00:20:58–00:21:14 · M** — **Stop her zaman kullanılır**; market uç/pandemi gibi garip olaylar yapabilir; "hepimiz stop olacağız, stop bunun için var".

**K14.14 · 00:21:53–00:22:00 · Y** — Kurallara bağlı kalarak **bir iki kez stop olsan da** "robot gibi" devam etmek uzun vadede çalışır. Kırılım sonrası **yapı başarısız olursa** (fake) tekrar karşı yöne dönülür (market structure reversal).

**K14.15 · 00:25:17, 00:29:35 · F** — **HTF, LTF'den büyüktür.** HTF = günlük/haftalık/aylık; **4 saat ve altı = LTF**. **Trend her şeyden büyüktür.**

**K14.16 · 00:25:31–00:25:47 · Y** — **Tümden gelim**: aylık → haftalık → günlük → 4s → 1s; her dilimde önemli seviyeleri not et.

**K14.17 · 00:26:06–00:26:40 · F** — **LTF'deki yapı değişimi HTF'yi tetikleyebilir** (domino mantığı).

**K14.18 · 00:28:15–00:29:02 · F** — Trader tipine göre zaman dilimi: **position** (haftalık/aylık), **swing** (haftalık/günlük, 1–3 ay), **short-term** (**günlük + 4 saat**, **3–5 gün, en fazla 7 gün**), **intraday/scalp** (1s + 15dk). *(Botun 4s + 1d seçimi "short-term trader" tipine denk geliyor.)*

**K14.19 · 00:30:33–00:30:58 · F** — Konsolidasyonda **likidite bölgelerine** odaklan; sert haber ralisinde **derin geri çekilme bekleme**. Altcoin'ler BTC'den **daha derin düzeltir**; dominans etkisi.

**K14.20 · 00:31:10–00:31:19 · F** — **Hiçbir price action kavramı tek başına anlam ifade etmez; confluence** (kesişim) + doğru market yapısı okuması gerekir.

### Ders 14'ten botuma düşen sonuç
- **Pivot k=3 uydurmaydı.** Eğitmenin swing'i "4. mum kuralı + breakout mum kuralı"; ikisi de **fiyat hareketine bağlı**, sabit mum sayısına değil. 4. mum kuralının tam koşulu **kare ile doğrulanmadan** koda dökülmemeli.
- **Erken sinyal (fitil) ve konfirmasyon (kapanış)** ayrımı eğitmende var; botta yalnız kapanış var.
- Short-term trader tipi için **günlük + 4 saat** önerisi, bot için **doğru zaman dilimi seçimini** destekliyor.


---

## Ders 4 — Range, deviation (sapma), EQ, likidite temizliği

**K4.1 · 00:00:15–00:00:41 · M** — **Likidite temizliği (range'de)**: fiyat, belirlediğin **range low'un hemen altına bir fitil atıp** yukarı dönerse likidite temizlenmiştir (SFP de denir). Ya da range low'un altına girip bir süre sonra **range low'u tekrar destek olarak kazanır**.

**K4.2 · 00:02:51–00:03:23 · F** — Range aramadan önce **konsolidasyon** ara: fiyat belli bir aralıkta yavaşça süzülüyor ve yönünü belli etmiyor. Akümülasyon mu dağıtım mı olduğu, fiyatın **terk ettiği yöne** göre netleşir.

**K4.3 · 00:03:27–00:03:44 · M** — Range için **iki nokta**: **range high** ve **range low**; **olabildiğince çok temas** olan noktalar seçilir. Üstte ve altta çok temas istenir, ama **deviation (sapma) olabileceği unutulmaz**.

**K4.4 · 00:06:47–00:07:19 · Y** — RH/RL'de **fitil mi gövde mi**: hangisinde **daha çok temas ve daha az sapma** varsa onu kullan; bu bir tercih meselesi.

**K4.5 · 00:07:35–00:08:39 · M** — **EQ (equilibrium) = range high ile range low arasındaki Fibonacci 0,5.** Gerekirse range low'u **hafifçe oynatarak** EQ'nun mumların gövdeleriyle uyumlu çalışmasını sağla ("ufak ayar").

**K4.6 · 00:10:09–00:11:19 · M** — **Deviation kuralı (1)**: Range high ya da low'da **deviation** olduktan sonra fiyat **istekli bir mumla range içine geri girerse**, önce **EQ'yu**, sonra **karşı range noktasını** test etmeye meyillidir. (Gerekçe: dışarıda likidite bulup alıcı/satıcı toplamış.)

**K4.7 · 00:11:38–00:12:01 · Y** — Eylem: ya **range low/high'a retest beklenir** (eğitmenin tercihi), ya da geriye dönük testlerinde çoğunlukla **retest vermeden gittiğini** görmüşsen **market giriş** yapılır.

**K4.8 · 00:12:28–00:12:57 · M** — **EQ kırıldıktan sonra** EQ'ya retest ve satış gelirse, fiyatın **range low'a gitme ihtimali artar**; sert ve istekli bir mumla EQ'nun terk edilişi bu işaretin parçasıdır.

**K4.9 · 00:13:21 · F** — Range low'un altına bir kez gidilip likidite temizlendiyse "**deviation'ın deviation'ı**" çok olmamalı (aynı yerde tekrar tekrar sapma beklenmez).

**K4.10 · 00:14:03–00:14:19 · M** — **Stop**: giriş bölgesinin üstündeki **indecision candle'ın üstü** ya da daha güvenlisi onun da üstü; (indecision candle ayrı dersin konusu).

**K4.11 · 00:22:26–00:22:57 · F** — **İkinci deviation**'dan sonra fiyat genelde **tekrar içeri girmek yerine kapanışla dışarıya gitmeyi** tercih eder. Bu bir **altcoin karakteristiği**; **BTC için farklı olabilir, 4 saatlik/15 dakikalıkta farklı olabilir** — kendi testinle keşfedilmeli.

**K4.12 · 00:23:44–00:24:39 · M** — **Low-risk short**: kurumsal seviye/range low **kırılır**, **breaker oluşur**, **retest** gelir → buradan **short**, **stop retest bölgesinin üstü**; hedef **sonraki low'lar**. (Örnekte hedef sonucu ~2,24R.)

**K4.13 · 00:26:30–00:27:47 · M/Y** — **Hedefler**: önce **EQ**, sonra **karşı range ucu**; kırılan kurumsal seviye **hedef**dir; fiyat range'e tekrar girince **konsolidasyon → EQ** beklenir.

**K4.14 · 00:30:41, 00:31:22 · F** — **Bitcoin gibi FOMO yüksek paritelerde** fiyat çoğu zaman **retest vermeden** gider; **retest bekleyen** kurgular orada çalışmayabilir.

**K4.15 · 00:36:22–00:37:26 · F** — **Sapma payı zamanla artar** (vade uzadıkça, ve seviye 1–2 kez test edildikçe); bu yüzden range low/high bir **nokta** değil **alan** haline gelir. **Test edilmemiş** seviye ilk gelişte **güzel tepki** verir; tekrar tekrar test edilince sapma payı büyür.

**K4.16 · 00:37:57 · M** — **Çoklu hedef**: 1., 2., 3. hedef işaretlenir; **pozisyonun çoğu bir hedefte kapatılır** (eğitmen örneği).

**K4.17 · 00:38:02 · F** — **Range içinde range** kullanılabilir; HTF/LTF'ye inilebilir (ör. günlükten 4 saatliğe).

**K4.18 · 00:39:26–00:39:54 · F** — Retest'in durduğu yer çoğu zaman **imbalance noktası**; reaksiyon oradan gelir.

**K4.19 · 00:41:10–00:41:56 · Y** — **Double top / baş-omuz** gibi formasyonlara **güvenme**; fiyatı oku, formasyonları **yan veri** olarak kullan.

**K4.20 · 00:13:46–00:13:58 · F** — **Tek bir grafik/parite**'ye bakarak işlem alınmaz; korelasyonlar ve farklı gözlemler olmalı.

### Ders 4'ten botuma düşen sonuç
- Benim **sweep stratejisi** buradan türüyordu; kurallar **kısmen doğru**: sweep + içeri dönüş + hedef EQ (K4.6, K4.13). Ama:
  - Eğitmen **"istekli mumla dönüş"** diyor; **3 mum** sınırı benim uydurmam.
  - **Giriş**: tercih **retest** (K4.7); benim **sonraki mum açılışı (market)** girişim eğitmenin tercihi değil, ancak onun kabul ettiği alternatif.
  - **Range genişliği ≥ 3 ATR** benim uydurmam; eğitmen "çok temaslı" RH/RL diyor.
  - **Range alan olarak** (sapma payı) ele alınmalı, tek fiyat olarak değil (K4.15).
  - **EQ** eğitmende 0,5 Fibonacci ve **ayarlanabilir**; hedef olarak EQ → karşı uç **iki kademeli** (K4.13, K4.16).
- **BTC'de retest bekleyen setup'lar çalışmayabilir** (K4.14) → bot BTC ve altcoin'i ayrı değerlendirmeli.


---

## Ders 24 — Eğitmenin en çok kullandığı konseptler (öncelik sırası)

**K24.1 · 00:00:12–00:00:49 · F** — **#1 Range** (RH, EQ, RL). Range'i **kişiye özel/subjektif** buluyor; herkes farklı range çizebilir. Bir tepe **1–2 temas sonrası bile** range high/low olarak kullanılabilir. **EQ = 0,5**, "Fibonacci sayısı değil ama çok önemli denge noktası".

**K24.2 · 00:01:00–00:01:12 · F** — Range low **iki kez deviation'a uğramış** olsa bile hâlâ kullanılabilir; deviation sonrası **düşüş/dönüş tekrar tekrar bu bölgeden** çalışabilir.

**K24.3 · 00:01:18–00:01:44 · M (belirsiz)** — **#2 Order block**: klasik OB (kırmızı çizgi) ile **EFLOUD order block** (mavi çizgi) farklı; kısa vadede mavi OB, klasik OB stop olurken **çalışmaya devam ediyor**; **fiyat önce EFLOUD OB'ye** sonra klasik OB'ye gidebilir. *(EFLOUD OB'nin tam tanımı 18. derste; burada yok.)*

**K24.4 · 00:01:53–00:02:26 · F** — **#3 Imbalance**: fiyatın **hızlı aksiyon aldığı** noktaları ve kurumsal seviyeleri gösterir; "hızlı para kazanmak" için kullanıyor.

**K24.5 · 00:02:26–00:02:52 · F** — **#4 Likidite**: swing high/low, **relative equal highs/lows**, equal highs, clean highs/lows, old high/low. **Önemli olan likidite ve arz-talep**; "geri kalanlar noise (gürültü)". *(Eğitmen bunun "benim takdirim, %100 değil" olduğunu belirtiyor.)*

**K24.6 · 00:02:55–00:03:15 · Y** — Her konsept değerli ama **kişiye özel**; bir piyasada breaker, başka piyasada mitigation daha iyi çalışabilir → **kendi piyasanda hangisi çalışıyorsa onu kullan**.

**K24.7 · 00:03:31–00:03:45 · Y** — Keşfettiğin özelliği **istatistiğini tutarak** doğrula (hangi parite/zaman diliminde çalışıyor).

**K24.8 · 00:04:41–00:04:46 · Y** — **Backtest bedava**; sürekli yap.

**K24.9 · 00:05:16–00:05:27 · F** — Price action **tek başına çözüm değil**; **risk ve psikoloji** konuları (25 sonrası dersler) en az onun kadar önemli.

### Ders 24'ten çıkan sonuç
Botun önceliği eğitmenin sırasıyla **Range+EQ → Order Block → Imbalance → Likidite** olmalı; **breaker/MSB** ve **swing** bunları besleyen yapı. Benim iki stratejim bu sıralamayı yansıtmıyordu.


---

## Ders 18 — Order Block (klasik) ve EFLOUD Order Block

**K18.1 · 00:01:57–00:02:20 · M** — **Bearish OB**: bir **yükseliş (bull) mumu**, ardından gelen **istekli (sert) bearish breakout mumu**. OB noktası = o bull mumun **en alt seviyesi veya gövdesi**. **Bullish OB**: bir **bearish mum**, ardından **istekli bullish breakout mumu**; OB noktası = o bearish mumun **en üst seviyesi veya gövdesi**.

**K18.2 · 00:02:18–00:02:29 · F** — OB'yi **swing high/low** bölgelerinde ara, **farazi bölgelerde değil**. **Bearish yapıda bearish OB, bullish yapıda bullish OB** ara; işlemin gerçekleşme ihtimali artar.

**K18.3 · 00:01:16–00:01:30 · M** — **Fitil mi gövde mi**: eğitmen genelde mumun **high/low seviyesini** alıyor; ancak **kriptoda gövde**, **EUR/USD'de fitil** daha çok çalışıyor ("defalarca backtest ile gördüm").

**K18.4 · 00:03:34–00:03:51 · M** — **EFLOUD Order Block**: pump/dump öncesindeki **tek küçük mumu değil**, onun öncesinde gelen **art arda aynı renkli mumları da** kapsayan bölge. (Örnekte art arda **5 mum**'a kadar çıkıyor.)

**K18.5 · 00:03:54–00:04:16 · F** — Klasik tek mumlu OB **bazen stop eder**; EFLOUD OB (art arda mum bloğu) aynı yerde **çalışır**. Fiyat çoğu zaman önce EFLOUD OB'ye (mavi), sonra klasik OB'ye (kırmızı) gider; **klasik OB'ye hiç dokunmadan EFLOUD OB'den dönebilir**.

**K18.6 · 00:05:21–00:05:29 · M/Y** — **Kademeli giriş**: OB bölgesine tek noktadan değil **parça parça** emir koyabilirsin (örn. **%30 / %50 / %20**), **stop bölgenin ötesinde**.

**K18.7 · 00:06:05–00:06:26 · M** — **İşlem planı örneği**: OB bölgesinden gir, **stop OB'nin altına/ötesine**, **ilk hedef** altta/üstteki **likidite veya imbalance**. **Spot'ta** o mumun altında zaman diliminde **kapanış** gelirse pozisyonu **kapat**.

**K18.8 · 00:07:28–00:07:37 · F** — **Trend ve HTF büyüktür.** OB, **swing high/low bölgelerinde** daha yüksek yüzdeyle çalışıyor (eğitmenin bireysel testleri).

**K18.9 · 00:07:39–00:08:16 · Y** — **OB kendi içinde bir range gibi** kullanılır. **Çalışmayan ("textbook" olup tek seferde parçalanan) OB'leri** grafikte tut ve sonradan nasıl çalıştığını gözlemle (araştırma ödevi).

**K18.10 · 00:08:23–00:08:36 · M** — **Hiçbir konsept %100 değildir; stop zorunlu.**

### Ders 18'den çıkan sonuç
- **Order block mekanik olarak tanımlanabiliyor** (K18.1, K18.4): *karşı renkli mum + istekli breakout mumu*; EFLOUD OB = **aynı renkli mum dizisi**. "İstekli" mumun sayısal tanımı yok → botta **gövde/ATR oranı gibi bir eşik gerekir ve bu benim varsayımım olur**; açıkça etiketlenmeli.
- Botta **OB hiç yok**; eğitmenin 2. önceliği.
- Giriş **tek fiyat değil bölge ve kademeli** (%30/50/20).


---

## Ders 22 — Likidite koşulları: equal high/low, sweep, hedef

**K22.1 · 00:00:37–00:00:55 · F** — Likidite kullanımı piyasaya göre değişir. **Kriptoda yatay/range** iken LTF'de SFP benzeri yapılar çok görülür; **trend halindeyken** swing uçlarında likidite temizliğinden çok **"top SFP / mitigation"** tarzı hareketler görülür.

**K22.2 · 00:01:23–00:01:52 · M** — **Likidite alanları**: **old high / old low**, **clean (equal) high/low** (neredeyse aynı seviyede), **relative equal high/low** (yakın ama birebir olmayan). Buralarda **likidite birikir**; bu seviyelerin **üstünde/altında kapanış** olursa fiyat **trend yönünde devam** edebilir.

**K22.3 · 00:03:44–00:03:52 · M/Y** — Kullanım: **old high/low'u almadan işlem açma**; likidite alındıktan sonra **düşüşü gözle ve konfirmasyon ara**, "tek seferde işlem almak yerine".

**K22.4 · 00:03:53–00:04:14 · M** — **Equal high/low** (neredeyse milimetrik): bu seviyeler temizlenince sert hareket gelebilir; **kapanış** bu seviyelerin üstünde mi altında mı ona bakıp yön öngörülür.

**K22.5 · 00:04:16–00:04:27 · F** — **Likiditesi alınmış** bir OB/imbalance bölgesi tekrar tekrar çalışmaz; artık **hedef** haline gelir.

**K22.6 · 00:05:16–00:06:17 · M/Y** — **Risk boyutu yöne göre**: trende karşı (counter-trend) short arıyorsan **yarım risk**; **trend devamında** (ör. relative equal high'ların üstünde istekli kırılım) **tam risk long**. Kırılım istekliyse **konfirmasyon beklemeden** long açıp **stop'u relative equal high'ların altına** koyabilirsin.

**K22.7 · 00:06:45–00:07:36 · F** — **Yükselen dipler = düşük önemli destek/likidite bölgeleri**; **yüksek önemli destek**, fiyatın güçlü tepki aldığı yerdir. Düşüşte **hedef**, bu düşük önemli bölgelerin likiditesidir.

**K22.8 · 00:07:55–00:08:20 · Y** — Likidite temizlenip **birikim bölgesinin altında kapanış** gelirse fiyatın hangi imbalance'a/likiditeye gitmeye meyilli olduğuna dair fikir edinilir; **%100 bilinemez**, ama **take profit'ler** buna göre mantıklı yerlere konur.

**K22.9 · 00:08:35–00:08:56 · F** — **Büyük rallinin ardındaki derin düzeltmelerde** swing noktaları **likidite temizliği için değil, imbalance'ın dolması için** kullanılır.

**K22.10 · 00:09:45–00:09:53 · F** — **Test edilmemiş (untested) swing high**, fiyatı çeken bir hedeftir; imbalance'ı doldurmak yerine oraya gidip güç alıp **boşluğa/satış bölgesine** gidebilir.

**K22.11 · 00:10:01–00:10:38 · F/Y** — **Trend her şeyden büyük, HTF LTF'den büyük.** Eğitmene göre **market maker'lar ağırlıklı olarak supply, demand ve likidite**ye bakar (HTF). **Her paritenin kendi karakteri** var: biri likiditeyi 2 kez alıp devam eder, EUR/USD çok temiz çalışır → **her parite için ayrı backtest**. Stop zorunlu.

### Ders 22'den çıkan sonuç
- **Hedef = likidite** (old high/low, equal high/low, relative equal high/low) — botumdaki "en yakın pivot" kuralı kabaca doğru ama **eşit tepe/dipleri ve "test edilmemiş" seviyeleri** ayrı tanımlamak gerek.
- **Risk boyutu trend yönüne göre değişiyor** (counter-trend = yarım risk, trend yönünde = tam risk). Botta tek tip risk var.
- **Sweep sonrası konfirmasyon** isteniyor; "istekli kırılım" varsa konfirmasyonsuz giriş de var → iki kademeli giriş modeli.


---

## Ders 28 — Riski azaltmak, ödülü optimize etmek

**K28.1 · 00:01:20–00:01:45 · F** — **HTF önemli bölgeler yön göstericidir**; haftalık/aylık atlanmaz. İşlem LTF'de yapılır, HTF'ten **fiyatın nereye gitmeye meyilli olduğu** bulunur.

**K28.2 · 00:01:58–00:02:23 · Y** — Yeni başlayan: **günlükte setup kur, en fazla 4 saatliğe in**; ilk başlarda 5dk/15dk/1s'te setup kurma.

**K28.3 · 00:02:37–00:02:59 · F** — **Tümden gelim** zorunlu: aylık → haftalık → günlük → 4s. **LTF'de işlem alırken bile HTF'deki major direnç / order block / imbalance dikkate alınır.**

**K28.4 · 00:03:26–00:03:47 · M** — **Riski minimize etmek**: HTF'deki önemli bölgeyi **LTF'de rafine et**; stop'u HTF OB'nin altına değil, **LTF OB'nin altına** koy → **risk küçülür, RR büyür**.

**K28.5 · 00:04:07–00:04:17 · M** — **Alarm** HTF bölgesine kurulur (emir değil). Alarm çalınca **1s/15dk grafikte** **mitigation / breaker** gibi yapı oluşuyor mu diye bakılır.

**K28.6 · 00:04:30–00:04:46 · F** — **"Low-risk setup" = kayıp tutarı küçük değil; stop'a gelme ihtimali düşük setup.** Bunun için konfirmasyon alınır.

**K28.7 · 00:06:08–00:06:20 · Y** — "Hiçbir şey bilmiyorsak" **sabit 20 pip stop, 1:1** kuralı kullanılırdı. Price action bilen kişi **stop ve TP'yi yapıya göre** koyar.

**K28.8 · 00:06:36–00:15:40 · M** — **Aynı setup, farklı zaman dilimi, aynı hedef**: günlükte 20 pip stop → **stop oldu**; yapısal stop ile günlükte **RR ≈ 1**; **4 saatlikte** (breakout mumu retesti) stop ~35 pip → **RR ≈ 2,08**; **1 saatlikte** stop ~17 pip → **RR ≈ 4,84**. Hedef = kısa vadeli **old high / equal high / relative equal high** likiditesi.

**K28.9 · 00:15:03–00:15:11 · M** — **Emir yerleştirme**: EFLOUD OB ve normal OB bölgelerine **iki ayrı emir**; en az biri dolar; **stop OB'nin hemen altı**.

**K28.10 · 00:08:20–00:08:33 · M/Y** — Stop olup **yapı bozulmadıysa** (fake / stop avı) **makine gibi yeniden gir**: içeri **istekli breakout mumu → retest → yükseliş** kurgusu.

**K28.11 · 00:16:02–00:16:17 · F** — **Optimal setup = birleşim**: HTF breakout + HTF EQ kırılımı + HTF dip likiditesinin alınmamış olması + üst likidite hedefi + HTF alt-trendin yukarı olması → LTF'de **optimal giriş**.

### Ders 28'den çıkan sonuç
- **Kritik bulgu**: eğitmenin RR avantajı **giriş zamanlamasından (LTF rafinesi)** geliyor, sabit RR eşiğinden değil. Botumdaki **"min RR = 2"** eşiği eğitmenin kuralı değil; eşik yerine **rafine edilmiş giriş + yapısal stop + likidite hedefi** sonucu doğan RR'yi ölçmek gerekir.
- **Çok zaman dilimli** mimari gerekiyor: HTF'de bölge/alarm, LTF'de MSB/breaker/mitigation ile giriş.
- Stop olduktan sonra **yapı bozulmadıysa yeniden giriş** kuralı var (botumda yok).


---

## Ders 10 — Fibonacci retracement, OTE, clustering  *(eğitmen konuşmada "11. konu" diyor; kitapta Bölüm 10)*

**K10.1 · 00:03:33–00:03:49 · M** — Kullandığı oranlar: **0,38 · 0,5 · 0,618 · 0,705 (0,707) · 0,786 · 1,127 · 1,618**; bazen **0,236 · 2,618 · 4,23** (geniş salınımlarda). **0,5 Fibonacci sayısı değil, denge noktası** olduğu için kullanılıyor.

**K10.2 · 00:04:30–00:04:58 · M** — Yalnız **Fibonacci retracement ve extension** kullanır. **Retracement**: range içinde fiyatın nereye çekilebileceği; **extension**: fiyatın nereye gidebileceği (hedef).

**K10.3 · 00:05:04–00:05:33 · M** — Retracement seviyeleri: **0,38 · 0,5 · 0,618 · 0,705 · 0,79**; salınım uzunsa **0,236**. **Destek için low→high**, **direnç için high→low** çizilir (ilk tık 0 noktası).

**K10.4 · 00:06:36–00:07:12 · F** — Bir Fibonacci seviyesinin **hâlâ geçerli** olup olmadığına, **diğer swing noktalarında aşırı ihlal/sapma olup olmadığına** bakarak karar ver; çok sapma yoksa eski seviyeyi kullanmaya devam et.

**K10.5 · 00:07:14–00:08:11 · F** — **Doğru retracement doğru range'e çekilir**: alakasız low/high arasına çekmek yanıltır; **geçerli swing noktaları** arasında çok sayıda Fibonacci çekip **kesişimlerine** bakmak doğru yolu gösterir.

**K10.6 · 00:08:50–00:09:16 · M** — **Ucuz/pahalı**: range'in **0,5'inin altı ucuzluk (discount)**, **üstü pahalılık (premium)** bölgesidir. Long için fiyatın 0,5'in altına inmesi "ucuzluğa girdi" demektir.

**K10.7 · 00:09:16–00:10:12 · M** — **OTE = 0,618–0,786 aralığı** (orta nokta **0,705**). **Emir dizilimi**: 0,618'den 0,786'ya doğru **artan miktarda emir** (az → çok); OTE aralığı **kendi içinde bir range**; orta nokta 0,705 **çoğu pozisyonda en kullanışlı nokta**.

**K10.8 · 00:10:12–00:11:14 · F** — Gerekçe: **algoritmik botlar** büyük ölçüde göstergelere (RSI'ın türevleri) dayanıyor; OTE bölgesi çoğu zaman **RSI oversold** (30 altı) / overbought (70 üstü) bölgesine denk gelir. RSI'a bakmak **zorunlu değil**; fiyatın kendisi zaten söylüyor.

**K10.9 · 00:12:12–00:12:38 · M** — Yapı **HH/HL** ile giderken **önemli HL'nin kaybı** → yapı bearish olmaya başlar; artık **pahalılık bölgesinden (0,5 üstü) satış** aranır, ucuzluktan alış aranmaz.

**K10.10 · 00:13:12–00:14:25 · M** — **Clustering (kümeleşme)**: **geçerli swing high/low noktaları** arasında çekilen birden çok Fibonacci'nin **seviyeleri aynı bölgede kesişirse** (ör. biri 0,5, diğeri 0,618/0,705) o bölge **güçlüdür**.

**K10.11 · 00:14:50 · M** — **Önemli swing low kaybedildikten sonra** (breaker oluşmuşken) o bölgenin **üzerinde kapanış gelmedikçe long açmaya gerek yok**.

**K10.12 · 00:15:36–00:15:45 · F** — **Swing içinde swing**: büyük swing ve küçük swing'in 0,705 seviyeleri çakışırsa çok güçlü destek/direnç.

**K10.13 · 00:16:00–00:16:13 · Y** — "Bir zarar edersin, iki zarar edersin, ama 5-10 kez kazanırsın"; **zarar edince pes etme**; kuralları **farklı zaman dilimi, market ve paritelerde** geçmişe dönük incele.

### Ders 10'dan çıkan sonuç
- **OTE ve ucuz/pahalı bölge mekanik olarak tanımlı** (0,618–0,786, orta 0,705; 0,5 üstü/altı) — botta **hiç yok**; giriş bölgesi için doğrudan kullanılabilir.
- **Emir dizilimi artan miktarda** (az → çok, 0,618'den 0,786'ya) — benim tek emirli girişimden farklı.
- "Doğru range / geçerli swing" şartı yine **swing tanımına** bağlı (Ders 14); orası belirsiz olduğu sürece Fibonacci'nin mekanik kalitesi de belirsiz.


---

## Ders 13 — Imbalance, FVG, liquidity void, gap türleri  *(eğitmen konuşmada "14. konu" diyor; kitapta Bölüm 13)*

**K13.1 · 00:01:40–00:02:33 · F** — **Imbalance**: fiyatın test etmeden hızlı geçtiği boşluk. Piyasa bu alanları **tekrar ziyaret edip denge sağlamak ister**; fiyat imbalance bölgelerine **mıknatıs etkisiyle** gider, **tepki alıp yoluna devam eder**.

**K13.2 · 00:02:37–00:03:13 · M/Y** — Denge sağlanan alana fiyat **tekrar tekrar dönmez**: ya konsolidasyon yapar, ya da trendde ilk gidişte **o ziyaretin likiditesini temizleyerek** devam eder. Imbalance'ı doldurduğu yerdeki **son fitilin altı/üstü önemli bir likidite bölgesidir**; fiyat oranın likiditesini alıp **sağlamlaştırırsa** reaksiyon güçlüdür; **tekrar tekrar likidite almaya** başlarsa imbalance'tan gelen **reaksiyon yetersizdir**.

**K13.3 · 00:03:16–00:03:54 · F** — **İsimlerin önemi yok**: inefficiency, FVG, liquidity void, rebalancing, actual price gap = **hepsi imbalance**. "Bu alanda dengesizlik var" demek yeterli.

**K13.4 · 00:04:04–00:04:29 · M** — **Liquidity void**: tek yönlü **sert, büyük gövdeli mumlar**ın bıraktığı boşluk; fiyat bunu doldurmaya meyilli.

**K13.5 · 00:04:32–00:05:28 · M** — **Actual (price) gap**: kapanış ve açılış arasındaki fiyat farkı (forex'te hafta sonu/gün sonu; **kriptoda 7/24 olduğu için gap yok, yalnız CME vb.**). Bu gap'in **%99 dolacağını** düşünüyor (eğitmenin gözlemi).

**K13.6 · 00:06:12–00:07:10 · M** — **Open gap → closed gap**: gap **dolduktan sonra** "closed gap" olur ve **ileride destek/direnç** olarak çalışma eğilimindedir. Çıkışlarını/pozisyon kapatmayı bu bölgelerde yapar.

**K13.7 · 00:08:26–00:09:27 · Y** — **Her imbalance eşit değil**: sert bir hareket içinde kendi kendini onarmış (ufak sert geri dönüşle dolmuş) imbalance'lar **önemsizdir**; **en belirgin ve etkili olanlara** odaklan.

**K13.8 · 00:11:04–00:12:14 · F** — **HTF imbalance**: aylıkta boşluk olmayan yer günlük/haftalıkta boşluk olarak görünebilir. **Günlükte imbalance varsa dolmaya meyillidir.**

**K13.9 · 00:12:14–00:13:00 · F** — **Sığ/range piyasada** LTF (4s, 1s, 15dk) imbalance'lar daha çok doldurulur; **imbalance yerine likidite bölgeleri ve SFP tarzı modeller** daha iyi çalışır.

**K13.10 · 00:13:08–00:13:40 · F** — Her piyasanın tepkisi farklı; BTC'de 20K sonrası "geri çekilme vermeden" uçtu → **imbalance'ı doldurmayabilir**; geçmişteki benzer kırılım davranışları **gelecekte de tekrar edebilir**.

**K13.11 · 00:10:19–00:10:42 · M** — Textbook bir **OB çalışmayıp stop ettirebilir**; stop olduktan sonra **OB üzerinde kapanış gelirse tekrar long**, gelmezse **bearish arayış**; bölge kırılınca (breaker) **short**, "yanıldığın yerde stop olup **tekrar girmek**".

**K13.12 · 00:16:56–00:17:30 · F** — **Confluence örneği**: Fibonacci + weekly OB + weekly imbalance + pahalılık bölgesi + OTE + RSI overbought → "5–6 veri" bir arada.

**K13.13 · 00:17:33–00:18:06 · F** — **Trend**: imbalance'lar **açık bırakılmaya meyilli**, dolmama ihtimali yüksek; **HTF (günlük ve üstü) imbalance, 4s ve altından daha önemli**; trendde **günlük/haftalık imbalance**'ı kovala.

**K13.14 · 00:18:44–00:18:51 · F** — **BTC range'de** sürekli imbalance doldurmaya meyilli; **EUR/USD range'de bile** imbalance'ı **açık bırakmaya** meyilli.

**K13.15 · 00:19:29–00:20:30 · M** — **Eğitmenin özel nüansı**: **trend halinde** → geri çekilmede **imbalance bölgesinden giriş**, **hedef = likidite bölgeleri** (eski swing high/low). Downtrend'de short'u **imbalance'tan** aç, **hedef aşağıdaki likidite**; uptrend'de long'u **imbalance'tan** aç, hedef yukarıdaki likidite. **Trend yokken/range'de**: fiyat imbalance'tan çok **likidite bölgelerine** odaklanır → **hangisine tepki verdiğine bak** (pullback imbalance'ta mı duruyor, yoksa likiditeyi alıp mı dönüyor?).

**K13.16 · 00:15:10–00:15:22 · Y** — **İndikatör kullanmak serbest**; kararsız kaldığında ara sıra RSI vb. kullanıyor; **asıl dayanak fiyat**.

**K13.17 · 00:01:29–00:01:38 · Y** — Konseptin **doğru kullanım alanı ve zamanı istatistikle** bulunur; "her gördüğün boşluğa atlayıp" işlem açma.

### Ders 13'ten çıkan sonuç
- **Hedef/giriş rolü trend durumuna göre değişiyor** (K13.15): trendde **giriş = imbalance, hedef = likidite**; range'de **likidite öncelikli**. Bu, botta **"rejim (trend/range) bilgisini strateji seçimine bağlamayı"** gerektiriyor.
- **Imbalance sayısal olarak tanımlanabilir** (3 mumluk boşluk), ama "önemli imbalance" ayrımı (K13.7) **göz kararı**.
- **Kriptoda actual gap yok** (K13.5) → botun gap kuralı kripto için gereksiz.


---

## Ders 26 — Swing Failure Pattern (SFP) ve Failure Swing Top (FST)

**K26.1 · 00:00:56–00:01:12 · M** — **Failure Swing Top**: A–B–C dalgası: A tepe, B dip, **C, A'yı geçemeyen lower high**; **B'nin kırılmasıyla** "fail" gerçekleşir ve fiyat aşağı kanar. **Mitigation** ile aynı mantık.

**K26.2 · 00:01:57–00:02:07 · M** — **B kırılmadan** yapı yalnız "possible top"tur; hazırlan ama **konfirmasyon yok**. B'nin altında **kapanış** gelince onaylanır.

**K26.3 · 00:04:22–00:04:38 · M** — **SFP**: önemli bir noktanın üstünde (**relative equal high / birikim likiditesi**) fiyat **likiditeyi temizleyip** geri döner. **Kurulum**: likidite temizlendikten sonra **onay mumu** beklenir; "lap diye short açmam".

**K26.4 · 00:04:38–00:04:40, 00:11:17–00:11:40 · M** — **Onay mumu** = **fitil/likidite alan mumdan hemen sonraki mum**; rengi **dönüş yönüne** göre: tepede **kırmızı/siyah**, dipte **yeşil/beyaz**. Onay mumu beklenirse **işlem kalitesi artar**.

**K26.5 · 00:05:13–00:05:16, 00:10:32–00:10:44 · F** — SFP **kurumsal bölgede / HTF destek-direnç** üzerinde oluşmalı; "farazi yerlerde" değil. **HTF bölgede** olması işlemin gücünü artırır.

**K26.6 · 00:05:37–00:05:52, 00:10:02–00:10:31 · F** — **Likiditeyi temizleyen mumun yönü**: dipte temizlerken **yükseliş şeklinde**, tepede **düşüş şeklinde kapanması**, SFP olasılığını artırır. %100 şart değil ama **veri sayısını artırır**.

**K26.7 · 00:05:12 · M** — **Stop**: SFP'nin yaptığı **dibin/tepenin ötesi**.

**K26.8 · 00:09:56–00:10:04 · F** — SFP **trend devamında da** çalışır (likidite temizleyip devam).

**K26.9 · 00:09:46–00:09:53 · F** — Trend dönüşü için en etkili kalıplardan biri; **forex'te** çok iyi çalıştığını söylüyor; **EUR/USD için DXY ile birlikte** bakmayı öneriyor.

**K26.10 · 00:07:15–00:07:45, 00:11:52–00:11:57 · M** — **Başarısız SFP (stop)**: pes etme. **Seviyenin kaybedilmesi** trendin sandığı gibi olmadığı anlamına gelir; ama fiyat **tekrar istekli bir mumla** o noktanın üstüne çıkıp **retest** verirse yeniden gir ("hop retest, bam yükseliş"). *(Örnekte 36.246 altında kapanış = fikir bozulur.)*

**K26.11 · 00:08:32–00:08:55, 00:12:12–00:12:27 · M/Y** — **Başarısızlık sonrası yeniden giriş**: **yarım risk** ile gir; "normalde beklenen hareketin **iki katını** beklersin"; toplam kayıp **en fazla ≈1,5R**.

**K26.12 · 00:09:28–00:09:41 · M** — Yapı çalışmayıp fiyat geri gelir, **retest'te reaksiyon** varsa onu kaçırma: **stop çok yakın → low-risk setup**.

**K26.13 · 00:10:46–00:11:13 · F** — **Breaker/MSB konfirmasyonu zorunlu değil**: HTF bölgede SFP + onay mumu ile de pozisyon alınabilir (kısa vadeli, ilk kazançlar). Breaker beklemek **daha güvenli ikinci yol**.

**K26.14 · 00:12:03–00:12:13 · Y** — Önemli olan: trende hâkim misin, doğru trendde mi kullanıyorsun, stop'u salınımın ötesine koyuyor musun → **"robot gibi" trade et, duygu karıştırma**.

**K26.15 · 00:13:15–00:13:35 · F** — **Mitigation'dan önce çoğu zaman bir Failure Swing Top** vardır; isim önemsiz, **tanıdığın olay ve tepkisi** önemli.

### Ders 26'dan çıkan sonuç
- **SFP/sweep girişi eğitmende "konfirmasyon mumu"na bağlı** ve **HTF kurumsal bölge** şartı var; botumdaki sweep stratejisinde ikisi de yoktu (yalnız "3 mum içinde kapanış" vardı).
- **Başarısız setup sonrası yeniden giriş (yarım risk, 2× beklenti)** açık bir kural; botta yok.
- **Onay mumu rengi** mekanik kontrol edilebilir.


---

## Ders 30 — Karşı-trend risk, kısmi kâr ve başabaş stop (HYPE/USDT vakası)

**K30.1 · 00:03:30–00:03:45 · M (ASR belirsiz)** — **Karşı-trend (veya konfirmasyonsuz) işlemde risk yarıya iner**: normalde pozisyon başına bakiyenin ≈**%2**'sini riske ediyorsa, trend tersi/konfirmasyonsuz işlemde ≈**%1 (yani 0,5 ağırlık)** risk eder. *(Tam yüzdeler dökümde bozuk; "normalin yarısı" ilkesi net.)*

**K30.2 · 00:00:48–00:00:56 · M** — **Kısmi kâr + başabaş**: eğitmen, kısa vadeli işlemde **kârın bir kısmını realize edip stop'u girişe (BE) taşır**; bu yüzden **win-rate yüksek, R-oranı düşük** olur ve "fazla stop olmaz".

**K30.3 · 00:05:37–00:05:41, 00:06:21–00:06:24 · M** — **Ters yönde bir deviation/reclaim oluşursa** (ör. range'e güçlü geri dönüş) → **mevcut işlemi kapat, yön değiştir, EQ'ya ve range high'a kadar taşı** ("robot gibi"); eğitmen bu kuralı duygusal davrandığı için uygulayamadığını itiraf ediyor.

**K30.4 · 00:08:06–00:08:44 · M/Y** — Kritik bölge kaybedilince **hemen karşı pozisyon açma**; **retest'i bekle**, stop'u o bölgenin ötesine koy, hedef ~**3,6R**.

**K30.5 · 00:08:56–00:09:07 · M** — Stop olduktan sonra **range yeniden kazanılırsa** (deviation) tekrar long: **1R kayıp + 2,74R yeniden giriş = net ≈ +1,74R** örneği.

**K30.6 · 00:09:34–00:10:17 · F** — **Haber ve fon akışı** (ETF girişleri, kurumsal ilgi, düzenleyici uyarılar) **görmezden gelinmez**; **trend piyasada haber etkisi 2–3 kat büyür** (yankılanır). *(Bot dışı bir filtre; otomatikleştirmek ayrı veri kaynağı ister.)*

**K30.7 · 00:10:34–00:10:49 · F** — **Gerçek vs yarım deviation**: gerçek deviation **fiyatsal olarak önemli, alıcı kitlesinin toplandığı** yerlerde olur; **önemli destek bölgelerinden** gelen deviation daha değerlidir.

**K30.8 · 00:12:32–00:13:03 · F** — **Hacimsizlik/yaz sezonu**: yıl sonu (Q4) trendinden önce hacim düşüktür; **büyük long/uzun pozisyon yerine kâr realize et, kenara çekil**, bu dönemi **gözlem ve backtest** için kullan. Küçük gövdeli mumlar = hacimsiz/zayıf yükseliş işareti.

**K30.9 · 00:04:40–00:04:50 · F** — Yükselişin **mum gövdelerinin küçülmesi** (hacim kaybı) yükselişin zayıfladığını gösterir.

### Ders 30'dan çıkan sonuç
- **Risk boyutu**: karşı-trend/konfirmasyonsuz işlemde **yarım risk** (22. Ders ile tutarlı); botta uygulanmalı.
- **Kısmi kâr + BE** eğitmenin gerçek uygulaması; yüzdelik/R seviyesi **verilmemiş** → benim 1,5R / %50 değerim kuralın kendisi değil, **varsayım**.
- **Hacim/mum gövdesi küçülmesi** ve **haber** gibi filtreler bot dışı veya ayrı veri gerektiriyor.


---

## Ders 25 — Zaman dilimi seçimi ve trade modeli

**K25.1 · 00:01:05–00:02:34 · F** — Büyük kurumlar **aylık/haftalık** grafiğe bakarak yön belirler; **aradaki salınımlar** onlar için ara hareketlerdir. Aylık grafik → **position trading** (1–2 yıl veya daha uzun).

**K25.2 · 00:02:52–00:03:43, 00:05:06–00:05:11 · F** — **Swing trading**: **haftalık + günlük** grafik; **2–3 (4) ay**; ana yön içindeki ara hareketlerden yapılır.

**K25.3 · 00:02:56–00:03:03, 00:05:52–00:06:05 · F** — **Short-term trading**: **günlük (veya 4 saat)**; **1–7 gün, en fazla 9–10 gün**. Model: **haftalık grafikte range belirle**, **günlük ve 4 saatlikte** işlem ara.

**K25.4 · 00:03:05–00:03:26, 00:06:06–00:06:20 · F** — **Day trading**: **4 saat ve altı** (1s, 15dk, 5dk). Forex'te **London/New York açılışı** saatleri. Eğitmen için ideal: **en fazla 3–4 parite, her birinde en fazla 3–4 setup**; 1s/15dk tercih ediyor.
**K25.5 · 00:04:03–00:04:37 · Y** — **Zaman dilimi ile trader modeli uyuşmazsa** psikolojik sorun çıkar (erken çıkış, stop'u gevşetme). Önce **kendi modelini belirle**, ona uygun zaman dilimini kullan.

**K25.6 · 00:04:50–00:04:57 · M** — **Trend trading**: HTF'in belirlediği yönde işlem; "trend her şeydir"; **karşı yönde pozisyon açma**.

**K25.7 · 00:05:11–00:05:49 · Y** — **Reversal (tepe/dip yakalama)** eğitmenin modeli değil: tepeyi/dibi bilmek **gerekmiyor**; **LTF'de konfirmasyon** alınca işleme girer; hedef, bulunan setup'ta **maksimum kâr** elde etmek.

**K25.8 · 00:00:41–00:00:49 · F** — Perpetual futures'ta **8 saatte bir funding** kesilir (eğitmenin aktardığı bilgi; maliyet hesabına girer).

### Ders 25'ten çıkan sonuç
- Botun **4s + 1d** seçimi **short-term trader** modeliyle örtüşüyor (günlük/4s, 1–7 gün). Haftalık range'i HTF bağlamı olarak almak eğitmenin önerisi.
- **Tepe/dip yakalamaya çalışan** (reversal) kural yok: giriş **LTF konfirmasyonu sonrası**. Botta konfirmasyonsuz giriş varsa bu eğitmenin modeline aykırı.


---

## Ders 23 — Confluence (kesişim) bölgesi: adım adım kurulum örneği (XAU/USD 1s)

**K23.1 · 00:01:20–00:02:10 · M** — **Sıra (adım 1–2)**: **relative equal lows** (görece eşit dipler) var → bunların **likiditesi alınıyor** → fiyat **imbalance'ı onarıp** ilk kez dokunduğu noktaya geliyor. **Burada direkt long açmıyoruz; gözlem süresi başlar.**

**K23.2 · 00:02:16–00:02:39 · M** — **Adım 3**: bu likidite bölgelerinin temizlenmesi → **konsolidasyon** → **breakout candle** ile alanın terk edilmesi → fiyat **"return to origin"** yapıp **order block**'a (akümülasyon/demand alanı) geri döner → **pozisyon burada inşa edilir**.

**K23.3 · 00:03:33 · M** — Kurulumun omurgası: **Breakout mumu → Order Block → Retracement → Confirmation**.

**K23.4 · 00:02:43–00:02:55 · M** — **Stop**: likidite temizlenmiş ve imbalance dolmuş olduğu için **likidite bölgesinin altına** koyulur ("tekrar oraya gitmesine gerek yok"). Gerekçe zinciri: **likidite temizlendi → imbalance doldu → breakout mumuyla terk → retracement → setup tamam**.

**K23.5 · 00:06:41–00:07:09 · M** — **Hedef/çıkış**: **yüksek önemli direnç** ve **4 saatlik imbalance** (ilk karşılaşılacak alan); orada pozisyon kapatılır; örnekte **8,2R**. "Sadece 3 şey var: **giriş, stop, çıkış**."

**K23.6 · 00:07:19–00:07:54 · F** — **Low-risk setup** = **az para kaybetmek değil**, **stop'a gelme ihtimali minimum** olan setup. Her işlemde **riske edilen tutar sabit** ve **baştan belli** olmalı; başlangıçta **düşük miktarlarla** çalış.

**K23.7 · 00:09:14–00:10:33 · M** — **Konfirmasyonlu vs konfirmasyonsuz**: konfirmasyonlu giriş **5 veri** (likidite + imbalance + breaker + OB + onay mumu) ve **RR ≈ 8,2**; konfirmasyonsuz (yalnızca imbalance/likidite) **2 veri** ve **RR ≈ 8,93** ama **olasılık düşük**. Eğitmen **her zaman konfirmasyonu öne alır**; "bazen setup kaçırırsın ama" risk azalır, RR çoğu zaman da iyileşir.

**K23.8 · 00:10:36–00:10:55 · M/Y** — HTF'de (günlük) setup oluştuktan sonra **1s/4s'e inip** aynı emareyi bulursan giriş **riski küçülür**; veri sayısı artar, RR biraz azalabilir ama **özgüven artar**.

**K23.9 · 00:05:54–00:06:20 · F** — **İmbalance her zaman dolmaz**: sert çıkıp **önemli bir noktanın üstünde kapanırsa** fiyat tekrar o boşluğa dönmeyebilir.

**K23.10 · 00:11:15–00:11:30 · F** — **HTF'de önemli bir alanın yeniden kazanılması** + imbalance'ın hızlı alınması → **up-trend yönlü pozisyon** kurmak için tetikleyici.

**K23.11 · 00:11:02–00:11:57 · F** — Bu örnekte **kullanılan konseptler listesi**: HTF/LTF dengesi, relative equal low, likidite, breaker, akümülasyon/dağıtım, trend yönü, range, imbalance, OB, LTF supply/demand, SFP/breaker, risk-reward, **konfirmasyon**.

**K23.12 · 00:12:38–00:13:10 · Y** — Başlangıçta **paper trade / minimal miktarlar**; **win-rate ≥ %50–60** hedefi (kârlı olsa bile **%30 win-rate özgüveni kırar**); **işlem sayısı azalır, kalitesi artar**; "günde 50 işlem yerine günde bir işlem".

### Ders 23'ten çıkan sonuç — bot için en önemli bulgu
- **Eğitmenin setup'ı sırayla doğrulanan bir kontrol listesi**: *likidite temizliği → imbalance → breakout mumu → OB'ye dönüş (retracement) → onay mumu → giriş; stop likiditenin ötesi; hedef önemli direnç/HTF-LTF imbalance*.
- Bu, **tek bir sinyal** değil **çok adımlı durum makinesi**. Botta "puanlama" yerine **adım adım teyitli aşama geçişi** (state machine) mantıklı: her aşama kaydedilir; onay mumu gelmeden emir yok (K23.1, K23.7).
- **Konfirmasyon her zaman öne alınıyor** (K23.7, K26.4, K25.7) → konfirmasyonsuz giriş stratejileri (benim `sweep` market girişim) eğitmenin ana modeli değil.


---

## Ders 17 — Supply / Demand (arz–talep) temelleri

**K17.1 · 00:01:28–00:01:47 · F** — Arz/talep bölgesi, **fiyat o bölgeden güçle uzaklaştıktan sonra** belirlenebilir; hareketin kaynağında profesyonel alım/satım vardır. Strateji, **fiyatın bu bölgeye geri dönmesini beklemek** üzerine kurulu (yükselirken kovalamamak).

**K17.2 · 00:01:56–00:02:01, 00:03:41–00:03:49, 00:05:27–00:05:41 · M** — **Talep (demand) kalıbı**: **düşüş → base (konsolidasyon) → hızlı/istekli yükseliş**; **arz (supply)**: tersi. **Devam kalıpları**: rally–base–rally (up), drop–base–drop (down). Base mumlarının "bıraktığı sağlamlık" bölgeyi oluşturur.

**K17.3 · 00:03:57–00:04:02, 00:08:36–00:08:41 · M** — **Giriş**: tepede veya base içinde değil; fiyat **yükseldikten sonra talep bölgesine geri çekilince** al (arz için tersi).

**K17.4 · 00:05:52–00:07:07 · Y** — **Bölge sınırı piyasaya göre değişir**: **BTC'de trend halinde** mumların **fitil kısmından** bölge çizimi daha çok çalıştı; **EUR/USD, GBP/USD'de** **mum gövdesi** daha etkili. "Herkesin price action'ı kendine"; kendi piyasanda **test et**.

**K17.5 · 00:07:08–00:07:13 · M** — **Bölge**: fiyatın **terk ettiği mumdan önceki, art arda dizilmiş base mumlarının** oluşturduğu alan (tek mum değil). *(18. Ders'teki EFLOUD OB ile uyumlu.)*

**K17.6 · 00:07:13–00:07:22, 00:08:44–00:08:46 · M** — **Stop**: arz için bölgenin **üstüne**, talep için bölgenin **altına** (talepte **alt fitilin altı**).

**K17.7 · 00:07:30–00:07:50 · M** — **Risk tutarı pozisyondan önce sabit**; **stop nereye konursa konsun kaybedilecek para aynı** olmalı → **kontrat miktarı, stop mesafesine göre ayarlanır**. *(Botumdaki "sabit riskle lot hesabı" ile aynı mantık.)*

**K17.8 · 00:08:49–00:09:08 · F** — Bölgenin **gücü**: fiyat bölgeyi **test edince altına inmiyor / milimetrik test bırakmıyorsa** gerçek bir talep bölgesidir; trend devam eder.

**K17.9 · 00:09:49–00:10:29 · F** — **Kalıp kuralları sağlansa bile çalışmayabilir**: **düşüş trendinde** talep bölgesi zayıftır; düşüşte **yukarı çekilmeler short fırsatıdır**. Hangi trendin içinde olduğuna bak.

**K17.10 · 00:10:38–00:11:16 · F** — Stop olunan/kaybedilen talep bölgesi sonrasında fiyat **test edilmemiş (untested) swing low**'a gidebilir; **arz bölgesi retest + sert düşüş** örneği (≈1200 pips). Düşük dereceli likidite bölgeleri hedeftir.

**K17.11 · 00:12:00–00:13:34 · M/Y** — Fiyat **kutunun içine değil çoğu zaman kutunun altındaki fitil bölgesine** kadar iner; eğitmen kutunun içinden alım yapıp **kutunun dibinde alımı bitirir** (kademeli giriş).

**K17.12 · 00:14:16–00:14:25 · M** — Talep bölgesinden alıcıyı bulan fiyatın **hedefi bir arz bölgesi/likidite** bölgesidir.

**K17.13 · 00:14:59–00:15:05 · F** — **HTF'de, önemli yerlerde** oluşan arz/talep bölgeleri daha değerlidir; "rastgele yerde oluşan" bölgeyi kullanma.

**K17.14 · 00:15:15–00:15:27 · F** — **Tek pariteye bakarak işlem alma**: ilişkili göstergelere (tahvil faizi, DXY, vb.) bak.

**K17.15 · 00:14:30–00:14:37 · F** — **Küçük zaman dilimlerinde** (scalp) bu yapılar **düşük risk, hızlı kazanç** potansiyeli sunar; **trend her şeyden büyüktür**; **stop zorunlu**.

### Ders 17'den çıkan sonuç
- Botum zaten **"risk tutarı sabit, lot stop mesafesine göre"** hesaplıyor (K17.7) → bu kısım eğitmenle uyumlu.
- **Bölge = base mumları dizisi** (K17.5) → OB/EFLOUD OB tanımıyla birleştirilebilir.
- Bölge sınırı (fitil mi gövde mi) **piyasaya özel** (K17.4) → bot **ayarlanabilir parametre** olarak tutmalı, **BTC için ve EUR/USD için ayrı backtest**.


---

## Ders 3 — Range, RH/RL/EQ, deviasyona giriş  *(eğitmen "5. konu" diyor; Drive dökümü 08:26'da kesiliyor — devamı eksik)*

**K3.1 · 00:05:52–00:06:12 · M** — **Range 3 elemandır**: **Range High (RH), Range Low (RL), Equilibrium (EQ, orta nokta)**.

**K3.2 · 00:06:19–00:06:55 · M** — **Temas sayısı doğrulamayı artırır**: RL/EQ/RH'ye **birden çok temas** range'in **validasyonunu** güçlendirir. **Tek temasla belirlenmiş** RH/RL ile **başlamak** da olur ("ilk başlarda öyle belirleyin, EQ'yu ona göre oluşturun"); sapmalar ve çoklu temaslar sonradan doğruluğu artırır.

**K3.3 · 00:07:00–00:07:49 · F/M** — **Kırılım yönünde pozisyon düşünülür, ama kırılımın fake olma ihtimali unutulmaz**: RH üstünde **kapanış + retest** veya **breakout mumu** var diye **direkt long açma**; RL kaybedildi diye direkt short açma. **Diğer price action unsurları** ve **grafiğin sol tarafındaki geçmiş** birlikte değerlendirilmeli.

**K3.4 · 00:07:55–00:08:14 · M** — Long girdikten sonra fiyat **range'in içine geri girerse** (= **deviation**) **stop ol**; **"marketle inatlaşma"**.

**K3.5 · 00:08:19–00:08:25 · M** — **EQ yön belirleyici noktadır.**

**K3.6 · 00:03:32–00:04:45 · F** — Range **tek bir mumun high–low'u** ya da **günlük/haftalık high-low** da olabilir; gün içi trader'lar **günün high/low arası** için kendi range'ini kullanabilir. Range'in **düzgün bir kutu olması şart değil** (bayrak formasyonuna benzer küçük konsolidasyon).

**K3.7 · 00:01:53–00:02:19 · Y** — **Range subjektiftir**; kendi price action'ını keşfet.

> Not: Bu dersin Drive dökümü 08:26'da bitiyor; EQ kullanımı, RH/RL tepkileri ve deviation örnekleri **kayıp**. Eksik kısım için dökümün tam hâli gerekiyor. (Deviation/EQ içeriğinin büyük kısmı 4. Ders'te zaten var.)


---

## Ders 27 — Risk yönetimi: küçük hesaplar, büyük kazançlar  *(eğitmen konuşmada "47. konu" diyor; kitapta Bölüm 27)*

**K27.1 · 00:06:43–00:07:33 · M** — **Önce kaybedeceğin parayı hesapla**: işleme girmeden **risk tutarı sabit** belirlenir; **stop mesafesi ne olursa olsun** (%50 de olsa %1 de) **kaybedilecek tutar aynı** kalır; **kontrat miktarı** buna göre ayarlanır. "Kazanç umurumda değil, ilk başlarda kaybım umurumda."

**K27.2 · 00:04:26–00:05:00 · M** — **Saçma stop/hedef yok**: %50 stop – %5 hedef gibi kurgular kullanılmaz. **Düşük risk, yüksek ödül** setup'ları aranır, **price action'ın verdiği yapıya göre** stop/hedef konur.

**K27.3 · 00:07:35–00:07:54 · Y** — **Başlangıçta 1:20, 1:30, 1:50 gibi "jackpot" RR kurma**; gerçekleşmesi çok zor.

**K27.4 · 00:08:16–00:10:03 · M** — **Amaç win-rate değil R toplamak.** **Başabaş win-rate = 1 / (1 + RR)**: **1:1 → %50**, **1,5:1 → %40**, **2:1 → %33**, **3:1 → %25**; **0,3:1 → %75**. (Komisyon/spread dahil edilmemiş.) *(Botumdaki "breakeven_win_rate" hesabıyla aynı mantık.)*

**K27.5 · 00:09:22–00:10:15 · Y** — **1:1 RR yalnızca başlangıçta** (öğrenirken); sonra **1,5–3:1**'e geçilir; "ileride 1:1 kullanmamayı tercih ederim".

**K27.6 · 00:11:23–00:12:11 · M (rakamlar ASR)** — **Örnek**: 1000 USD hesapta **işlem başına ≈%1,5 risk (≈15 USD)**, RR 1:1 → haftada 1 işlem → **aylık ≈%6**. **Aylık hedef ≈%6** (zorunlu değil; bazı aylar +%20, bazı aylar −%3/−%5 olabilir), **yıllık hedef ≈2×**.

**K27.7 · 00:05:08–00:05:37 · M** — **Her koşulda stop**; FOMO (kaçırma korkusu) ve FOOT (korku/panik) kararları etkilemesin; "yatırımcı değilsen, stop zorunlu".

**K27.8 · 00:05:42–00:06:20 · Y** — **Başkasının kazancıyla kıyaslama yok**; yüzde değil **işleme giren bakiye/kontrat miktarı** önemlidir.

**K27.9 · 00:08:34–00:08:42 · Y** — **Stop olunca** dünyanın sonu değil; **ders çıkar**, aynı hatayı yeni setup'ta yapma.

**K27.10 · 00:18:29–00:22:13 · M** — **Aynı setup, hedef seçimine göre RR**: stop **55 pip**; hedef birinci likiditeye → **≈1,32R**, bir sonrakine → **≈2,73R**, daha öteye → **≈4,78R**. Eğitmen likidite sırasına göre hedef kademeleri sayıyor; **"kural olarak sabit 20 pip stop + 1:1"** yalnızca **acemi** için (22:08–22:43).

**K27.11 · 00:21:36–00:21:50 · F** — **Fiyat low'larını açık bırakıp high'larını temizliyorsa** yukarı eğilimlidir → **hedef üstteki old high/likidite bölgeleri**.

**K27.12 · 00:15:15–00:17:44 · M** — **Örnek akış (GBP/USD günlük)**: likidite alımı → **market structure break → breaker** → breaker retest → yükseliş → **imbalance doldurma + rejection (pahalılık bölgesi)** → **kısa range inşa** → **range low'a fake (deviation)** → **EQ'ya dönüş** → **breakout mumu** → giriş; **hedef**: EQ ve sonra range high/likidite.

**K27.13 · 00:17:20–00:17:27 · M** — **"Dördüncü mum kuralı gerekli mi?"** — **hayır**: **breakout candle kuralı** o dibi/tepeyi **geçerli swing** yapar. *(14. Ders'teki iki kural arasında "veya" ilişkisini doğruluyor.)*

**K27.14 · 00:19:37–00:21:08 · F/M** — **Fiyat ucuzluk bölgesinde (0,5 altı)** ve **OTE'de** tutunup önemli destek altına inmiyorsa **yukarı eğilimli**; **fake + imbalance onarımı + istekli breakout mumu + retest** sonrası **long**.

### Ders 27'den çıkan sonuç
- **Botumdaki risk hesabı (sabit risk, stop mesafesine göre lot) eğitmenle birebir uyumlu** (K27.1). **%1 risk varsayılanım** eğitmenin örneğindeki **≈%1,5**'e yakın ama **kesin sayı değil** (ASR belirsiz); bu parametre **kullanıcı kararı** olmalı.
- **Min RR = 2** eşiğim yine **eğitmenin kuralı değil**: başlangıçta 1:1'e izin veriyor, deneyimle 1,5–3'e çıkıyor; **hedef yapıdan gelen likiditeyle belirleniyor**.
- **Başabaş win-rate formülü** (K27.4) botun raporunda zaten var; doğru.
- **Swing = 4. mum VEYA breakout mumu** (K27.13).


---

## Ders 31 — Canlı işlem takibi (AVAX vakası): konfirmasyon, yarım risk, kısmi kâr

**K31.1 · 00:01:57–00:02:23 · M** — **Akışın (flow) tersine** veya **sığ/yatay** piyasada işlem: **yarım risk (0,5R)** kullan (örn. normalde %2 risk ediyorsan **%1**) **ya da spot**. **Konfirmasyon gelince tam riske çık.** Konfirmasyon %100 değil; **stop şart**.

**K31.2 · 00:02:26–00:03:09 · M** — **LTF konfirmasyon (4s/1s, sığ piyasada mikro LTF)**: HTF bölgesine (yeşil kutu) gelindikten sonra: **(1)** bir swing low oluşur, **(2)** fiyat önceki high'ı **kıramaz**, **(3)** lower low'lar devam eder, **(4)** ilk kez **istekli bir mumla** yapı **kırılır (breaker/MSB)**. Bu **dört unsur** dikkat çekici sinyaldir.

**K31.3 · 00:03:12–00:03:35 · M** — **Giriş uygulaması**: kırılımdan sonra **geri çekilmeyi başında beklemek şart değil**; **imbalance boşluğuna limit emir** ya da **dağıtık emirler**; **stop breaker'ın altı**; **take profit parça parça** birkaç seviyeden.

**K31.4 · 00:03:37–00:04:18, 00:08:35–00:08:48 · M (oranlar ASR)** — **Kısmi çıkış örneği**: **%50'yi ilk hedefte (≈1,4R)** realize et; **%25'i daha ileri hedefte (≈3,4R)**; **kalan %25'te stop girişe çekilir** (BE) ve orada stop olur. Toplam ≈**4,8R**'lik sonuç. Eğitmen kısmi çıkışı "market güvenmediğim için" yapıyor.

**K31.5 · 00:08:12–00:08:21, 00:08:56–00:09:02 · M** — **HTF'de önemli bölgede LTF konfirmasyonu yoksa**, **trendin tersindeysen** veya **sığ piyasadaysan işlem alma** (özellikle kırılgan alt coin'lerde).

**K31.6 · 00:05:30–00:05:37 · M** — **Retest konfirmasyonu**: fiyat bölgeye çarpıp **hemen geri kazanırsa** konfirmasyondur; **stop bölgenin altı**.

**K31.7 · 00:06:50–00:07:24 · M** — **Kritik destek kaybedilince short**: hedef alttaki imbalance; **stop, o talep bölgesinin / imbalance bitiş mumunun üstü** (daha güvenli).

**K31.8 · 00:09:00–00:10:12 · M** — **Konfirmasyonsuz alternatif (OTE)**: konfirmasyon görüp geri çekilmeyi yakalayamadıysan veya emin değilsen: **kısa vadeli low–high arasına Fibonacci**, **OTE 0,618–0,79** bölgesine **parçalı emir** (örn. 100 USD için **33/33/33**); hedef bir önceki high veya yüksek dereceli direnç; **breaker yapısı mitigation'dan daha iyi**.

**K31.9 · 00:08:23–00:08:32, 00:11:20–00:11:27 · F** — **Alt coin'ler BTC'ye bağımlı** (BTC'den ≈%1–2 daha fazla ayrışabilir); **zayıf yapılı alt coin'ler genelde imbalance'a kadar iner**. Konfirmasyon bunun için şart.

**K31.10 · 00:00:42–00:01:00 · Y** — Stop olduktan sonra **kısa vadede telafi edecek işlem** kurgulanabilir; ama **flow tersiyken** direkt alım önerilmez (K31.1).

### Ders 31'den çıkan sonuç
- **Kısmi çıkış (%50 → %25 → kalan BE)** eğitmenin gerçek uygulaması; oranlar ASR bozuk olsa da **yapı: parçalı hedefler + son parçada BE**. Botumun tek kademeli kısmi çıkışı **sade bir yaklaşım**; ama **çok kademeli** olmalı.
- **0,5R** kuralı (22. Ders, 30. Ders, bu ders) üç derste tekrar ediyor → **botun karşı-trend riskini yarıya indirmesi kesin bir kural adayı**.
- **LTF konfirmasyonun 4 unsuru** (K31.2) mekanik olarak formüle edilebilir (swing low, eski high kırılamaz, lower low, istekli kırılım mumu), ama "istekli mum" sayısal tanımsız.


---

## Ders 32 — Konfirmasyon sonrası aksiyon ve zayıflayan destek/direnç tespiti (MON/USDT vakası)

**K32.1 · 00:02:23–00:03:03 · M** — **Direnç noktasında trend tersi short**: direkt short açma; **konfirmasyon** ara. Örnek konfirmasyon: **lower high** + **yapı dibinin kaybı** = **mitigation yapısı** onayı.

**K32.2 · 00:03:20–00:03:55 · M/Y** — **Konfirmasyon yapısı seni stop ettiyse**: hangi swing high/low'un "çalışmadığını" gör; **iki bölge arasındaki yeni swing'i** yeniden işaretle. **Breaker, mitigation'a göre daha fazla çalışma olasılığına** sahip; yeni önemli high/low kırılırsa **breaker** oluşur.

**K32.3 · 00:04:32–00:04:44 · F** — Üç yapının (iki breaker + bir mitigation) **birlikte kırılması** gibi **eşzamanlı kırılımlar** daha güçlü sinyaldir.

**K32.4 · 00:05:03–00:05:44 · M** — **Giriş**: onay mumundan sonra **iki giriş noktası** (imbalance ve OB bölgeleri) için **parçalı limit emir**; **stop en yüksek noktanın biraz üstü**; ≈**2R** hedefle; eğitmen stop olduktan sonra yarım riske geçtiğini anlatıyor.

**K32.5 · 00:06:34–00:06:58 · M** — **LTF seçimi**: HTF'de (günlük) çizilen bölgede konfirmasyon ararken **en azından 1 saatin altına inmemeye çalış**; emin olamazsan **15 dakikaya** inilebilir; **günlük bölgede 5 dakikalık konfirmasyon** "şansa bırakmak" olur.

**K32.6 · 00:07:34–00:07:56 · M** — **Long örneği**: dip–tepe–dip yapısı, tepenin kırılımı, **imbalance'a geri çekilme** ve devam; **≈3,4R** kazanç.

**K32.7 · 00:09:25–00:09:38, 00:11:30–00:11:36 · F** — **Zayıflayan destek/direnç**: bir bölgeden alınan **tepkiler giderek azalıyorsa** (1. güçlü, 2. orta, 3. sürünüyor) bölgenin **kırılma ihtimali artar**.

**K32.8 · 00:11:38–00:11:56 · F** — **V-shape tersi**: bir seviyeye çıkıp **hemen başladığı yerin altına dönmek** → o seviye **direnç** olur, tepe aşılamaz, düşüş gelir (kaybedilmiş seviyenin üstünde tutunamamak).

**K32.9 · 00:10:23–00:10:50 · M** — **Alarm** HTF destek bölgesine; bölgeye gelince **direkt işlem yerine** konfirmasyon: ilk dip → tepe → likidite → istekli kırılım; **iki emir** ve **stop** ile işlem; hedef **supply** (yaklaşık **2,2R**).

**K32.10 · 00:13:00–00:14:05 · Y** — **Seyahatte/dikkat dağınıkken swing pozisyon kurma**; işlem açacaksan **küçük (çıtır çerez) boyutta** ve kısa vadeli (scalp); **stres + zarar çifte kayıptır**.

### Ders 32'den çıkan sonuç
- **Konfirmasyon önceliği** bir kez daha doğrulandı (K32.1, K32.9) ve **LTF alt sınırı**: HTF 1g bölge → **min 1s**, gerekirse 15dk (K32.5). Botum 4s/1d ile bu aralığın üstünde; **1s konfirmasyon katmanı** eklenmesi eğitmenle uyumlu olur.
- **Zayıflayan tepki** (K32.7) ve **"kaybedilen seviye direnç olur"** (K32.8) mekanik olarak ölçülebilir ek filtreler.


---

## Ders 33 — Doğru setup ile aylık getiri modeli: LTF rafinesi, ekleme, stop taşıma  *(eğitmen "29. konu" diyor; kitapta Bölüm 33)*

**K33.1 · 00:04:00–00:05:08 · M** — **Aynı setup, farklı giriş zamanlaması (GBP/USD)**: **günlük seviyeden** doğrudan giriş → **stop ≈81 pip, RR ≈1:1**; **retest + LTF konfirmasyon** beklenirse stop **≈33 pip → RR ≈2,2**; **1 saatlikte** stop **≈18 pip → RR ≈4,7**. Hedef aynı: **relative equal high / likidite**.

**K33.2 · 00:04:20–00:04:39 · M** — **LTF tetik**: fiyat **range low'un altına hızlıca sarkıp** (likidite alımı) **istekli mumla geri içeri girer**; retest'te long; **stop süpürülen dibin altı** ("artık altına gitmez").

**K33.3 · 00:05:07–00:05:48 · M** — **Trend yönünde ekleme (pyramiding)**: higher low'lar (love–high–lover love) ve **yeni breaker temasında yeni pozisyon ekle** (≈+2,3R ekstra); **stop'ları yükselen dip'lerin altına taşı** (trail); likidite alınmadan trend devam ederse **stop olana kadar tut**; örnekte toplam **≈6,9–11,6R** *(rakamlar ASR)*; erken stop olmak da normal.

**K33.4 · 00:06:39–00:07:18 · F** — **Matematik**: sabit riskle RR 2,5:1 kullanınca haftalık kazanç büyür (örnekte **haftalık ≈%2,5, aylık ≈%10**, yıllık ≈3×); sebep **doğru giriş ile stop'u küçültüp RR'yi yükseltmek**. Aylık %2 bile bankaların faizinden büyüktür.

**K33.5 · 00:03:04–00:03:31 · F** — **Çoklu perspektif**: **DXY korelasyonu** (forex), hisse piyasası, kripto için **market cap/dominans**, **ETH/BTC**, altın-gümüş, **COT raporu**, **faiz oranı** verileri; bunlar bakış açısını güçlendirir.

**K33.6 · 00:03:12–00:03:20 · F** — **Altcoin işlemi**: yalnızca **USD paritesine değil BTC paritesine de** bak; **ETH** altcoin ralisinin ana göstergesi.

**K33.7 · 00:01:34–00:01:47 · M/Y** — Pozisyona girmeden **kaybedeceğin tutar belli** olmalı; **stop olunca nedenini not et**, aynı hatayı tekrarlama.

**K33.8 · 00:00:33–00:01:14 · Y** — **Av metaforu**: fiyatı **kendi belirlediğin bölgede (supply/demand) beklemek**; tanımadığın yerde avlanma.

### Ders 33'ten çıkan sonuç
- **Eğitmenin RR'si sabit eşikten değil giriş rafinesinden geliyor** (28. Ders ile aynı mesaj, 33. dersle üçüncü kez doğrulandı): **stop küçülünce RR 1 → 2,2 → 4,7**. Botta **"önce HTF bölge, sonra LTF konfirmasyonlu giriş"** iki katmanlı yapı **temel tasarım ilkesi** olmalı.
- **Ekleme (pyramiding) + stop taşıma** eğitmende var; botum **tek giriş** yapıyor. İlk sürüm için opsiyonel bir modül olarak kalabilir (ASR rakamları güvenilmez).
- **BTC paritesi/dominans/ETH-BTC** gibi altcoin bağlam verileri bot dışı filtre veya ayrı veri gerektirir.


---

## Ders 11 — Fibonacci extension (uzantı)  *(eğitmen "12. konu" diyor; kitapta Bölüm 11)*

**K11.1 · 00:00:50–00:01:29 · M** — **Extension = 3 noktalı** (trend-based extension aracı); **retracement %100'den az** (önceki salınımın içinde geri çekilme), **extension %100'den fazla** (önceki salınımın **ötesi**: daha aşağı/daha yukarı hedefler).

**K11.2 · 00:01:34–00:01:48 · M** — **Kullandığı uzantılar**: potansiyel destek/hedef için **1,272 ve 1,618**; **hype'lı piyasada (altcoin)** hareket daha büyükse **2,618 ve 4,236**. Ayrıca **0,618 (retracement), 1,216(?)**; "backtest sonucu en optimum değerler" *(1,216 ASR belirsiz)*.

**K11.3 · 00:03:44–00:04:55 · M** — **3 nokta**: **bir high, bir low, bir lower high** (eski high'ı geçemeyen nokta) → **fiyat low'u kırınca market structure break**; bu üç noktaya extension uygulanır; **1,272 bölge olarak defalarca çalışır, 1,618 daha önemli**.

**K11.4 · 00:05:56–00:06:20, 00:07:11–00:07:30 · M** — **Nokta seçimi**: düşüş trendinden sonra **ilk ciddi impulsive dalgayı** bul (ilk kez bir high yapıp **daha düşüğe gidememe** noktası); **low – high – higher low** üçlüsüne trend-based extension uygula.

**K11.5 · 00:07:22–00:07:51 · M/Y** — **Giriş**: **1,272'de işlem açamadıysa**, trend devam edince **1,618'e temas**ını bekle (eğitmen için **daha önemli**); temasın ardından **likidite alımı + onay mumu (SFP)** gelince pozisyon; örnek sonuç **≈5,6R**.

**K11.6 · 00:08:03–00:08:53 · M** — **Clustering**: farklı swing setlerine extension çekilince **seviyeler yakın bölgede üst üste biniyorsa** (örn. iki 0,618 + bir 1,272) bölge **önemli** olur; örnekte **5 kez çalıştı**.

**K11.7 · 00:09:17–00:09:26 · F** — **Confluence** = farklı price action konseptlerinin **aynı bölgede** buluşması; bu bölgelerde **işlemin gerçekleşme ihtimali yüksek**.

**K11.8 · 00:06:30–00:07:07 · Y** — **Trend çizgisi/diyagonal**: gelişi güzel kullanılmaz; "kullanım yeri, zamanı, metodolojisi" vardır. **İkinci temastan sonra** kanal oluşma ihtimaline bakıp çizer.

**K11.9 · 00:00:50 · F** — **Extension'ın amacı**: fiyat/destek yöntemlerinin belirgin olmadığı bir alana giderken **hedef** belirlemek.

### Ders 11'den çıkan sonuç
- **Hedef seviyeleri için Fibonacci uzantıları (1,272 / 1,618; altcoin'de 2,618 / 4,236) eğitmenin gerçek aracı** (K11.2). Botta hedef yalnız "en yakın likidite" idi; **uzantı seviyeleri ikinci hedef katmanı** olabilir (parametre: 1,272, 1,618 varsayılan; altcoin için 2,618, 4,236).
- **Seviyeler "backtest sonucu en optimum"** deniyor; yani **sabit mutlak kural değil**, bu parametreler bizim tarafımızdan da test edilmeli.


---

## Ders 12 — Range içinde pahalı (premium) ve ucuz (discount) bölge  *(eğitmen "13. konu" diyor; kitapta Bölüm 12)*

**K12.1 · 00:00:28–01:10 · F** — **Range konsepti işlemlerinin ≈%30–40'ını** oluşturuyor; pahalı/ucuz bölge kullanımında **≈%70–80 olumlu yansıma** gördüğünü söylüyor ("10 pozisyondan 7'si"). *(Eğitmenin kendi beyanı; kanıt değil.)*

**K12.2 · 00:02:01–00:02:48 · M** — **Tanım**: mantıklı **RL, RH ve geçerli swing low/high** belirlendikten sonra **Fibonacci 0–1** çekilir; **0,5'in üstü = pahalılık (premium)**, **0,5'in altı = ucuzluk (discount)**. Grafikte **0,5 altına yeşil, üstüne kırmızı kutu** konabilir.

**K12.3 · 00:04:35–00:06:58 · M** — **Kullanım kriterleri (bu sırayla)**: **(1)** mantıklı range; **(2)** **impulsive swing hareketleri** ara; **(3)** **1 ve 0 noktalarıyla** 0,5 altı/üstü belirle, fiyatın **equilibrium (EQ) veya OTE** noktalarında tepki vermesi beklenir; **(4)** **LTF (4s, 1s, 30dk, 15dk, 5dk)'de uygun bölgelerden** gir; günlükte bölge belirleyip **4s/1s/30dk** price action ile **riski minimize, ödülü maksimize** et; **(5)** ana zaman diliminin **1–2 kademe altını** her zaman onay için kullan; **(6)** **price action konseptleri + trend + piyasa okuması** ile destekle.

**K12.4 · 00:08:26–00:08:44 · M** — **Old low / old high likidite temizliği olursa SFP ara** ve **yeniden pozisyon inşa et**.

**K12.5 · 00:13:41–00:14:19 · M** — **Geniş range'de EQ "noktası" yerine EQ "alanı"** ara: RL ile **deviation yapılan** yüksek bölge arasına da Fibonacci çek; ikinci 0,5 çizgisi **EQ alanını** oluşturur ("benim literatürümde kullanım").

**K12.6 · 00:16:29–00:18:06 · M/F** — **Deviation + range'e dönüş** sonrası fiyatın ilk gideceği yer **EQ'dur**; bu bölge **ucuzluk** olur. O bölge **kaybedilince** pahalılık bölgesinden **short** aramalısın. **Trendin ayı olduğu durumda pahalılık bölgesinde satmak, ucuzluk bölgesinde almaktan daha yüksek kâr marjı ve gerçekleşme ihtimali** verir.

**K12.7 · 00:18:29–00:21:41 · M** — **İç içe range'ler**: ana range, ara range, küçük range. **Üç range'in de pahalılık bölgesinde** ve **OTE'de** olan fiyat = **"low-risk short"**; "yalnızca bu konsept üzerinden **3 konfirmasyon**" (RH pahalı + ara range pahalı + küçük range OTE). 

**K12.8 · 00:21:44–00:22:35, 00:25:37–00:25:49 · M** — **Çıkış/hedef**: **actual price gap / reaksiyon noktası**, **old low/old high**, **imbalance**; pahalılıktan ucuzluk bölgesine inen fiyat **0,705'te** (0,618–0,786'nın ortası) ilk reaksiyonu veriyor.

**K12.9 · 00:24:11–00:25:26 · M** — **Stop sonrası yeniden giriş**: OTE'den açılan short, fiyat **SFP yapıp yapıyı kaybedince stop** oldu; **breaker kırılımı/retest**'ten yeniden short, hedef **ucuzluk bölgesindeki OB**; **≈3R kazanç, toplamda +2R**. "Stop oldun mu? Korkma, mantıklıysan yeni low-risk setup'a gir."

**K12.10 · 00:28:36–00:30:45 · F** — **RSI**: **aşırı alım/satım** bilgisi **3.–5. veri** olarak kullanılır, **ilk veri değil**. **Pahalı bölgede RSI aşırı alım** + EQ ile çakışıyorsa **güçlü işaret**; **ucuz bölge gelmeden "RSI oversold" diye long almak** defalarca stop ettirir. **Divergence** beklerken fiyat yükselebilir.

**K12.11 · 00:30:01–00:30:21 · M** — **Trend yönünde hareket et**: ayı trendinde pahalı bölgede **short**; "şurada short açmak daha mantıklı".

**K12.12 · 00:31:13–00:32:01 · Y** — **Önce sonucu bilinen grafiklerde** öğren; **haftalık, günlük, 4s, 1s, 15dk**'da test et; **kaç kez stop oldun, nedenini not et**; "doğru renge bakmak" = fiyata ve price action'a bak, tek başına indikatöre değil.

### Ders 12'den çıkan sonuç
- **Premium/discount** (0,5 üstü/altı) + **OTE (0,618–0,786, orta 0,705)** mekanik olarak tanımlı; bot, giriş bölgesini **trend yönündeki tarafla** sınırlamalı: **ayı trendinde yalnız premium'dan short, boğada yalnız discount'tan long** (K12.6, K12.11). Karşı yön **yarım risk** (22/30/31/32. dersler).
- **İç içe range'ler çakışması** (K12.7) puanlanabilir bir confluence kriteri.
- **RSI yardımcı veri**; tek başına sinyal değil → botta kullanılacaksa yalnız **ek puan** olarak.
- **Stop sonrası yeniden giriş** bir kez daha tekrar etti (K12.9; 26/28/30/31).


---

## Ders 15 — Destek/Direnç ve likidite: düşük/yüksek önem dereceli bölgeler

**K15.1 · 00:02:52–00:03:04, 00:22:51 · M** — **Destek/direnç bir çizgi değil bir BÖLGEDİR** (fiyatın kümeleştiği alan). Tek nokta olarak yalnızca price action konseptlerini **kümeleyerek** kullanıyorsan ve wick'leri yakalıyorsan çalışır.

**K15.2 · 00:03:04–00:03:27 · M** — **Kademeli emir**: tek emir yerine bölgeye **piramit** şeklinde: örn. **%10 / %20 / %30 / %40** (aşağı doğru artan ağırlık); fiyat en derine gelirse ağırlıklı ortalama iyileşir.

**K15.3 · 00:03:30–00:03:49, 00:23:15–00:23:49 · F** — **Mit**: "çok test edilen destek zayıflar" — eğitmen **buna katılmıyor**: **önemli olan bölgenin altında kapanış** olup olmadığı ve **hangi trendde** test edildiği. Trend içinde tekrar test, yapıyı bozmuyorsa bölgeyi zayıflatmaz.

**K15.4 · 00:03:56–00:04:17 · M** — **S/R flip %100 değil**: önemli desteği **altından kapanışla** kaybedince **stop ol, short'a dön**; sonra fiyat **istekli mumla** üstüne geri çıkarsa (**deviation**) tekrar **EQ'ya/range'e doğru long**. "Robot gibi adapte ol."

**K15.5 · 00:04:19–00:04:48, 00:23:05–00:23:09 · Y** — **Yalnız S/R ile kazanılmaz** (forex/emtia daveti); price action'ı bütün olarak öğren, **her konsepti tek tek, sonra ikili/üçlü kombinasyonlarla backtest et**; en uygun kombinasyonu en uygun piyasada bul. **HTF S/R, LTF'den önemli**; **trendin gücü unutulmaz**.

**K15.6 · 00:04:50–00:06:21, 00:09:40–00:09:52 · F** — **Kompleks/dengeli yapılardan kaçın**: yukarı-aşağı sürekli gidip gelen, iki tarafın likiditesi karışık yapılar (forex'te çok) **kesilip biçilme (chop)** riski taşır; **intraday (1s/15dk) trader için ölümcül alanlar**. Bunlar ancak o pariteye **çok aşina** olunca işlenebilir.

**K15.7 · 00:06:31–00:07:45 · M** — **Basit yapı ("easy money")**: fiyat **hep yükselip altında likiditeyi açık bırakmış**, sonra **istekli bir kırılım (MSB)** gelirse → fiyatın **imbalance'a / düşük önemli likidite bölgesine** gitmesi **kolaydır**. Bu bölgeler **düşük önemlidir, kolay temizlenir**.

**K15.8 · 00:07:55–00:08:49 · F** — **Likidite** = piyasa fiyatını fazla etkilemeden alınıp satılabilme; **stop'ların bulunduğu bölge**; stop'lar karşı tarafın **pozisyona giriş yeri** olur.

**K15.9 · 00:10:31–00:15:11, 00:23:49–00:24:07 · M** — **ÖNEM DERECESİ**:
- **Düşük önemli destek/direnç (likidite) bölgesi**: swing noktaları (yükselen dipler / alçalan tepeler) **birbirlerinin likiditesini almamış**; "tık tık tık" gidilmiş, **kolay temizlenir**, fiyatı **çeker**.
- **Yüksek önemli bölge**: **likiditesi alınmış** ve **oradan güçle dönülmüş** nokta (önemli bir noktanın altına sarkıp geri dönmüş); **tekrar tekrar likiditesi alınmaya meyilli olmaz**, **stop'lar bu bölgenin altına/üstüne** konur. "Kurumsal bölge" sayılır.
- Yükselen diplerde fiyat **altındaki likiditeyi aramaya meyilli**; **market yapısı önemli bir noktanın altına geçince** o nokta kurumsal olabilir.

**K15.10 · 00:17:43–00:18:40 · M** — **TP**: yüksek önemli direnç **öncesindeki en yakın price action** noktasında (imbalance / order block / EFLOUD OB) al, **bölgenin kendisine beklenmez**; "çünkü o önemli bölgeye çarpma ihtimali yüksek".

**K15.11 · 00:19:11–00:19:17 · F** — **EFLOUD OB kısa vadede**, **orijinal OB uzun vadede** daha iyi çalışır.

**K15.12 · 00:20:03–00:21:50 · M/Y** — Düşük önemli desteklerin üzerine kurulu yükselişte hedef: önce **düşük önemli desteklerin likiditesi**; stop'u **yapının üstüne**; **stop olursan tekrar short açma**: bir **MSB** ve **kırılım + retest** görmeden yeniden girme.

**K15.13 · 00:21:54–00:22:00 · M** — **Emin değilsen yarım risk**: "normalde kaybedeceğin tutarın yarısını" riske at.

**K15.14 · 00:16:52–00:17:04 · Y** — **Fitil/gövde**: **forex'te gövde**, **BTC/ETH gibi volatil piyasada fitil** kullanımı; bölgeyi buna göre çiz.

**K15.15 · 00:16:18–00:17:20, 00:25:28–00:25:37 · F** — **Kurumsal ayak izi** (örn. MicroStrategy'nin alım yaptığı seviyeler) bölgeyi **yüksek önemli** yapar; market yapısının bölgelerde **kurumsal ipuçları vermesi** gerekir.

**K15.16 · 00:22:36–00:22:46, 00:25:52–00:26:09 · Y** — **2–3 pariteyle** çalış; kriptoda **hacim sorunu nedeniyle alt coin'lere çok girme, BTC yeter**; **önce geçmişte çok backtest, sonra güncel grafik**.

**K15.17 · 00:24:12–00:24:19 · M** — **Stop**: yüksek önemli bölgenin **altına/üstüne**; "en kötü ihtimalle **imbalance sonunun biraz üstü**".

### Ders 15'ten çıkan sonuç
- **Likidite "önem derecesi"** botun omurgalarından biri: **hedef seçimi = düşük önemli (temizlenmemiş) likidite**, **stop/giriş bölgesi = yüksek önemli (likiditesi alınıp tepki alınmış) bölge**. Benim "en yakın pivot" hedefim bunu ayırt etmiyordu.
- **Kompleks/dengeli yapılarda işlem yapma** (K15.6) → bot, belirsiz yapıda **NO TRADE** diyebilmeli; ölçüt "iki yönlü likidite karışıklığı" göz kararı ama **sayılabilir yaklaşımlar** (örn. swing sayısı/yön değişimi) denenebilir.
- **Kademeli emir (%10/20/30/40, aşağı doğru artan)** botta tek emirli girişin yerini almalı.


---

## Ders 16 — Yatay destek/direnç ve trend çizgileri (kısa ders)

> **Dikkat:** Bu dökümde anlatıcı kendini farklı tanıtıyor (ASR bozuk: "Fibonacci 2000'den …") ve üslup diğer derslerden farklı; **konuşmacının eğitmenle aynı kişi olup olmadığı belirsiz**. Aşağıdaki kurallar bu yüzden **düşük güvenle** katalogda; 3. ve 24. dersle **çelişen** madde var.

**K16.1 · 00:00:19–00:00:57 · M** — **Yatay seviyeler**: grafiğin **üstünden aşağı** doğru tara; **fiyatın defalarca dokunup tepki verdiği** yerleri çiz. Çizgiler "sihirli çizgi değil, **belli bir alan**"dır.

**K16.2 · 00:01:00–00:01:15 · F** — **Tüm zamanların zirvesi (ATH)** gelecekte direnç olarak beklenebilir; **büyük zaman dilimlerinde log scale** kullanmak daha anlamlı.

**K16.3 · 00:03:34–00:03:43 · F** — Çizgi **belirli bir noktadan başlamak zorunda değil**; **çarpıp geri dönen** çizgi bir **direnç** olarak düşünülebilir.

**K16.4 · 00:05:05–00:05:19 · M (ÇELİŞKİLİ)** — **Geçerli S/R için çizgi en az 3 noktaya temas etmeli**; **2 temas varsayımdır**, "saygı görüyor" demek için yetmez; tercih **≥3 temas**. *(3. Ders ve 24. Ders'te eğitmen "1–2 temaslı tepeyi bile range high/low olarak kullanabilirsin" diyor → **çelişki**; botta eşik "temas sayısı" parametre olarak tutulmalı, her iki değer test edilmeli.)*

**K16.5 · 00:04:16–00:04:51 · F** — Trend çizgileri **kanal/rising wedge/falling wedge** gibi pattern'ler üretir (örnekler). Kural yok, gözlem.

**K16.6 · 00:05:20–00:06:00 · Y** — Elliott dalga, harmonik, RSI divergence gibi konular **ayrı derslerin konusu**; Elliott "1–5 çizen herkes çizdiğini sanıyor, öyle basit değil".

### Ders 16'dan çıkan sonuç
- Bota **doğrudan katkısı yok**; yalnız **"S/R zone olarak ele alınır"** ve **"temas sayısı eşiği"** parametresi için not.


---

## Ders 20 — Indecision Candle (IC) aka Breaker Block (BB)

**K20.1 · 00:01:04–00:02:02 · M** — **Tanım**: **aynı yöndeki iki hacimli (güçlü) mum arasında** yer alan, **görece daha ufak ters renkli mum**. **Bullish IC**: iki güçlü yeşil mum arasında küçük kırmızı mum. **Bearish IC**: iki güçlü kırmızı mum arasında küçük yeşil mum. Ara mum **tek olmak zorunda değil**: **iki mum** (aynı veya farklı renk) de olabilir; sonrasında gelen bir mum yapıyı bozmaz. *(Bu tanım eğitmenin bir arkadaşının sözlük tanımından uyarlanmış.)* "Hacimli" = **gövdesi büyük/sert mum** (sayısal eşik verilmemiş).

**K20.2 · 00:02:15–00:02:26 · F** — IC, **OB'ye benzer** ama **EFLOUD OB'den tamamen farklı**. **OB swing high/low bölgelerinde** oluşur; **IC her yerde oluşabilir** → **istatistiksel olarak OB'den daha düşük çalışma oranı**.

**K20.3 · 00:02:28–00:02:34 · F** — **Trendle birlikte kullanılmalı**; trend yönünde **çalışma oranı yüksek**.

**K20.4 · 00:02:34–00:02:39, 00:03:22–00:03:58 · M** — **Beklendiği gibi çalışmazsa ters yönde çalışma potansiyeli vardır**: bearish IC'den red beklenirken **hacimli mumla kırılırsa** o bölge **destek olarak** çalışır (S/R flip). **Çalışmayan IC'leri de grafikte tut**.

**K20.5 · 00:02:46–00:03:02, 00:06:26–00:06:32 · F** — **Her zaman dilimi ve piyasada** oluşur/çalışır; **çalışma oranı** piyasadan piyasaya değişir. Eğitmenin gözlemi: **4 saat ve altında, gün içi/kısa vadede** daha etkili; **hızlı 0,5R, 1R, 1,5R** alabiliyor.

**K20.6 · 00:02:54–00:02:57 · Y** — **Mum gövdesi mi fitil mi** piyasaya göre değişir (kimisinde gövde, kimisinde fitil).

**K20.7 · 00:03:11–00:03:18, 00:04:49–00:04:53, 00:05:52–00:05:58 · F** — **Imbalance ile çakışan IC** daha anlamlı; **IC'nin orta noktası EQ** ile çakışabilir. IC tek başına karmaşık bir bölgede anlamsız görünebilir, **çakışma** yön gösterir.

**K20.8 · 00:05:44–00:06:23 · M** — **Örnek (forex 4s)**: sert yükseliş → IC → düzeltme **IC + imbalance** bölgesinde duruyor → bölge **12 kez** çalıştı; sonra **altına kırıp deviation** yaptı, likidite temizledi; **destek dirence döndü**.

**K20.9 · 00:06:46–00:07:10 · F** — **Mitigation** sonraki dersin konusu (eğitmen çok kullanmıyor; "Bitcoin düşüş dirençlerinde mitigation yapısı" gözlemi).

### Ders 20'den çıkan sonuç
- **IC mekanik olarak tanımlanabilir** (iki güçlü mum + aralarında küçük ters mum) ama "hacimli/küçük" için **sayısal eşik yok**; botta **gövde/ATR oranı** gibi bir eşik **bizim varsayımımız olacak**.
- **IC OB'den daha düşük doğruluklu**, tek başına giriş değil **confluence verisi**; **çalışmayan IC S/R flip** olarak değerlendirilebilir.


---

## Ders 21 — Mitigation (bearish örnek; bullish aynası)

**K21.1 · 00:01:08–00:02:12 · M** — **Mitigation koşulları (bearish)**: **(1)** fiyat dirence çarpıp **red** yer, **bir yukarı hamle daha dener ama eski high'ın likiditesini ALAMAZ** (lower high), sonra aşağı kırılır; **(2)** bu nokta **LTF'de/işlem yaptığın zaman diliminin bir üstünde zaten önemli bir seviye olmamalı** ("fiyatı tekrar tekrar likidite almaya çağıran" bir seviye olmasın); **(3)** **market yapısı kayar (shift)**.

**K21.2 · 00:02:17–00:03:21, 00:04:00–00:04:10 · M** — **3 nokta (A, B, C)**: **A = lower high bölgesi** (mitigation block, **satış girişi**), **B = stop seviyesi** (A'nın üstü / lower high'ın üstü), **C = kırılan low sonrası oluşan yeni swing low** (**çıkış/hedef**). Eğitmen: "A işleme gelecek yer, C çıkış, B stop." **Giriş = geri çekilmeyle lower high bölgesine dönüş**; **hedef = altındaki yeni low (C) veya daha aşağısı**.

**K21.3 · 00:02:54–00:03:56 · F** — **Gerekçe**: A→B arası long açan kurumlar **zararda kalır**; fiyat A'ya geri dönünce **zararı kesme/hafifletme (mitigation)** fırsatı bulurlar → **satış baskısı**. "Kurumlar hiç zarar etmez diye bir şey yok."

**K21.4 · 00:04:13–00:04:33 · M/Y** — **Güçlendiriciler**: Fibonacci ile **OTE / pahalılık bölgesi**, **A ve B arası EQ**; **geçerliliği backtest ile bulunur**.

**K21.5 · 00:00:21–00:00:30, 00:09:41–00:09:48 · F** — Eğitmen mitigation'ı **çok kullanmıyor**: **HTF'de ve dönüş sinyali aradığı yerlerde** (kripto) kullanıyor; kendi istatistiğinde **breaker'dan daha az verimli**; **HTF kurumsal bölgelerde alınan tepkilerde** ara bölgelere göre daha verimli.

**K21.6 · 00:06:03–00:06:20 · M** — **Zayıflık işareti**: fiyat **ilk kez önemli likidite bölgesinin/yapının (high–low–lower high) altında kapanış** yapıyorsa "çanlar çalmalı": **mitigation aktive olmuş olabilir**; sonra **isteksiz bir yukarı hareket** ve ardından düşüş gelirse mitigation çalışıyor.

**K21.7 · 00:09:10–00:09:24 · F** — Fiyatın **güçlü bir bölgenin altına sarkıp altında kapatması** "işlerin kötüleştiğinin" göstergesi; **breaker'ın çalışması için** bölgenin üzerinde kalması gerekirdi.

**K21.8 · 00:07:13–00:07:41 · F** — **İmbalance kalitesi**: **hızlı doldurulup hızlı düşülen** (2–3 günde kendini onarmış) imbalance'a **güvenme**; **içinde boşluk kalmış** imbalance daha güvenilir.

**K21.9 · 00:04:43–00:05:06 · Y** — **Piyasaya özel**: EUR/USD'de iyi kullanamıyor ama GBP/JPY'de çalışabilir; bir alt coin'de breaker çalışmıyorsa mitigation çalışıyor olabilir → **her konsepti her piyasada test et**.

**K21.10 · 00:09:35–00:10:00 · F** — **Trend ve HTF büyüktür**; **mitigation doğru (HTF kurumsal) bölgelerde aranmalı**; **stop şart**; **market yapısı dersi önce anlaşılmalı**.

### Ders 21'den çıkan sonuç — **botun retest kuralı için kritik**
- Eğitmenin **iki ayrı model**i var ve ayrım **"eski high'ın likiditesi alındı mı?"**:
  - **Breaker**: eski high/low'un **likiditesi alınır (SFP)**, ardından yapı kırılır; giriş kırılan bölgenin retesti (20/26/19. dersler).
  - **Mitigation**: **likidite alınamaz (lower high)**, yapı kırılır; giriş **lower high bölgesine geri çekilmede**, stop **lower high'ın üstü**, hedef **yeni low (C)** (bu ders).
- **Benim `retest` stratejim ikisinin karışımıydı**: LH + kırılım + **kırılan dibe** limit = ne mitigation (giriş LH bölgesinde olmalıydı) ne de breaker (likidite alımı koşulu yok). **Düzeltilmeli.**
- **Ek koşul**: A bölgesi HTF'de zaten önemli bir seviye olmamalı (K21.1-(2)).


---

## Ders 29 — Trend karşıtı işlemler ve işlemlerde kayıp (döküm 04:05'te kesik)  *(HYPE/… vakası)*

> Drive dökümü yaklaşık **4 dakikada bitiyor**; dersin kalanı **eksik**.

**K29.1 · 00:00:57–00:01:07 · F** — Eğitmen yaz aylarında **kısa vadeli işlem** tercih edip **kârı kısmi realize ederek stop'u girişe taşır**; bu yüzden **win-rate yüksek, R-oranı düşük** olur. *(30. Ders'in K30.2'siyle aynı.)*

**K29.2 · 00:03:36–00:03:55 · M** — **Trend tersi/konfirmasyonsuz işlemde yarım risk**: normalde bir işlemde bakiyenin **%2**'sini riske ediyorsa, trend tersi ve konfirmasyonsuz işlemde **%1** risk eder ("normal riskin yarısı"). *(Bu ders **%2 normal / %1 karşı-trend** örneğini açıkça veriyor; 27. dersteki ≈%1,5 ile **tutarsız** — rakamlar eğitmenin "mesela"sı, **kesin kural değil**.)*

**K29.3 · 00:03:08–00:03:29 · F** — **Önemli kırmızı kutu (destek bölgesi) kaybedilince** spot alım **tuttu**; kutunun altında kapanış gelince **konfirmasyonsuz karşı yönlü işlem** riskli; eğitmen burada **spot pozisyonu tutup short'la dengelemeyi** denedi (hedge). *(Botun kapsamı dışı: spot+short hedge.)*

**K29.4 · 00:02:46–00:02:52 · F** — **Front-run**: emirler seviyeye **tam değmeden** fiyat dönebilir ("emrim vardı, fiyat gelmeden ilerledi"). *(Limit emrin dolmama riskinin eğitmen tarafından da yaşandığı bir not; botun `NO_FILL` takibini destekler.)*

### Ders 29'dan çıkan sonuç
- **Karşı-trend yarım risk** kuralı (22/29/30/31/32) **beş derste** tekrarlandı; sayısal örnek **%2 → %1**. Bot, **normal riskin %50'si** olarak uygulamalı.
- Dersin devamı (stop sonrası ne yapılır, haber, psikoloji) **eksik dökümden okunamadı**.


---

## Ders 34 — Kaybetmek, stop olmak, beklenen değer ve zararı toparlama taktiği  *(eğitmen "30. konu" diyor; kitapta Bölüm 34)*

**K34.1 · 00:06:18–00:08:11 · M** — **Beklenen değer matematiği** (1000 USD hesap, 10 işlem): **%30 kazanç, 3:1 RR, %1 risk** → ort. kazanç 30, ort. kayıp 10; 3 kazanç 7 kayıp → 90 − 70 = **+20 (≈%2)**. **%30, 5:1, %1 risk** → **≈%8**. **%30, 5:1, %2 risk** → **≈%16**. **%40, 5:1, %2 risk** → **≈%28**. **%50, 3:1, %1 risk** → **≈%10**. *(Eğitmenin gösterdiği örnekler; **R cinsinden beklenti = kazanma oranı × RR − kayıp oranı × 1**; örn. %30 × 3 − %70 = **+0,2R**.)*

**K34.2 · 00:04:42–00:05:28 · M/Y** — **Sabit RR yok**: "mutlaka 1:3 kullanacağım diye kayıt yok". **Excel'e dök**: aynı işlemlerde **1:1, 1:2, 1:3** uygulasaydın ne olurdu; **≈500 işlemlik istatistik** ile **erken kâr alma sorunun var mı** gör. **İstatistiğe dökmeden kendini eğitemezsin.**

**K34.3 · 00:05:30–00:06:03 · F** — **Swing mentalitesi**: **haftalık/günlük** grafik, **trend yönünde**, **yılda ≈10 düzgün setup** ve düzgün RR ile hesabı **iki katına** çıkarabileceğini söylüyor.

**K34.4 · 00:04:19–00:04:29 · Y** — Hedef aylık %6 (veya %10) ise **fazlasını çek**, bakiyeyi sürekli büyütmek zorunda değilsin.

**K34.5 · 00:09:21–00:11:50 · M** — **Zarar toparlama taktiği (eğitmenin kendi taktiği; "acemi taktiği değil, akıllı taktik")**: işlem **stop olduysa ve fikre güveniyorsan** (yapı bozulmadıysa): **4 saatlik/LTF'ye inip** yeni bir setup ara; **ikinci pozisyonun riski ilkinin YARISI** (örn. 100 → 50); setup'ı **en az 2R kazanç** verecek kuracaksın ki **ilk zarar sıfırlansın**. **Üçüncü pozisyon** gerekirse **ikincinin yarısı** (ilkinin çeyreği). **Martingale (ikiye katlama) DEĞİL, yarıya indirme.**
  - Örnek hesap: 1. işlem **−1R**, 2. işlem **−0,5R** (toplam **−1,5R**); 3. işlem çeyrek riskle **≈+2,1R** → net **≈+0,6R**.
  - **Sadece aynı fikir/aynı varlık** için; "BTC'de patladıysam ETH'de bunu yapmam".
  - "İlk başlarda uygula"; bir stop sonrası **yaraya indirmek zorunda değilsin**, normal 1R'den devam edebilirsin.

**K34.6 · 00:01:38–00:01:56 · Y** — **Zarardan korkma**: zarar **işin doğasında**; **kaybedeceğin tutarı baştan bil**, setup'ı "zararı karşılayabilecek şekilde" kur; korkuyla girmemek/analiz edip girmemek **sistemi bozar**.

**K34.7 · 00:08:15–00:08:26 · Y** — Backtest yap, **analiz ettiğin pariteyi "çocuğun" gibi** yakından takip et (parite karakterini öğren).

**K34.8 · 00:08:40–00:08:53 · F** — **Bileşik büyüme örneği**: aylık %10 → yıl sonunda ×3; 4 yılda 1000 → 81.000 USD. *(Yalnızca matematik gösterimi; **gerçek getiri vaadi değil**, botun raporunda böyle bir projeksiyon **yok**.)*

### Ders 34'ten çıkan sonuç
- **Zarar toparlama taktiği bir kural**: **stop sonrası yeniden giriş = yarım risk, ≥2R hedef, yalnız aynı fikir/yapı bozulmadıysa, azami 3 deneme (1R → 0,5R → 0,25R)**. 12/26/28/30/31. derslerle tutarlı. Botta **opsiyonel modül** olarak kodlanabilir ve **toplam risk tavanı (≈1,75R)** ile sınırlanmalı (1 + 0,5 + 0,25).
- **Beklenti formülü** (K34.1) botun `avg_net_R` ve `breakeven_win_rate` raporuyla **uyumlu**.
- **Sabit RR yok, istatistikle seç** (K34.2) → botta RR eşiği yerine **RR dağılımı raporu** (1:1, 1:2, 1:3 senaryoları) olmalı.


---

## Ders 37 — Swing trading backtest: GBP/JPY (TradingView bar replay, 2016–2018)

> Uzun (≈50 dk) canlı replay; eğitmen işlem aldıkça düşünce sürecini anlatıyor. Aşağıda **tekrarlanabilir kurallar ve kendi itirafları** var; tek tek işlemler değil.

**K37.1 · 00:00:00–00:01:37 · Y** — **Backtest yöntemi**: **TradingView bar replay**; ağırlıklı **order block, fair value gap (FVG), breaker, likidite** (4 konsept); **yakın geçmişe** (≈2016–2019) bak, 2002'ye kadar gitme; **4 saat ağırlıklı**, önce **aylık→haftalık→günlük** önemli alanları işaretle. **Amaç**: kaç pozisyon başarılı/başarısız; "gerekiyorsa 10 kez stop olalım, 3–4 tanesi tutsun, **overall karlıysak başarılı**"; **başarısızları nedenleriyle not et**.

**K37.2 · 00:04:40–00:05:11, 00:08:11–00:08:26, 00:47:12 · Y** — **Sezon (mevsimsellik) bakışı**: eğitmen yılı **4 aylık sezonlara** bölüyor (örn. **Eylül'de yeni sezon başlıyor; Ocak–Nisan, Mayıs–Ağustos…**), grafikte **dikey çizgilerle** işaretliyor; **yeni sezonda yön değişebileceğini** hesaba katıyor. *(Mekanik kural değil; botta zaman filtresi olarak denenebilir ama **eğitmenin kanıtı yok**, kendi gözlemi.)*
**K37.3 · 00:12:18–00:12:22 · M** — **Swing trade mentalitesi**: **konsolidasyonda trade'ten kaçın**; **trend görülen yerlerde** pozisyon ara.

**K37.4 · 00:13:29–00:14:41, 00:27:38–00:27:50, 00:45:19 · M** — **İlk take profit sonrası stop'u girişe (BE) çek**; "pozisyonunu erken kapatmaya güvenmiyorsan **stop'u entry'ye al**". **OTE'den girilen işlemde FVG dolup fiyat hızla geri dönüyorsa "çanlar çalmalı"** (zayıflık) → fikri gözden geçir.

**K37.5 · 00:26:18–00:26:24, 00:31:26–00:31:29 · M** — **Order block %50 kuralı**: OB'nin **%50'sinin üstünde kapanış** (bullish OB'de) **pozitif emare**; fiyat **OB'nin %50'sinden rejection** yiyorsa OB çalışıyor demektir.

**K37.6 · 00:20:44–00:21:21, 00:41:35–00:41:55 · M** — **Stop yeri**: işlem stop olunca "**stop yerim yanlıştı**" — bearish bakış sürüyorsa **stop'u biraz daha geniş**/yapının ötesine koyup **aynı yerden yeniden gir**.

**K37.7 · 00:21:21–00:21:28, 00:24:12–00:24:18 · M** — **Stop sonrası hemen aynı yönde tekrar girme**: önce **kapanışın bölgenin üstünde/altında olup olmadığına** bak, **HTF'ye** (günlük) bak, **pullback bekle**; turtle soup (likidite alıp dönüş) sonrası **stop olduktan sonra pullback'e bak**.

**K37.8 · 00:37:16–00:37:29, 00:44:07 · M** — **Trend yönü**: **trendi pozitif okuyorsan buy-side likidite hedeflerine odaklan; trende karşı işlem yaparsan** FVG/likidite boşluklarını hedef al **ama trend seni cezalandırır**: "trendin tersine işlem yapmayın."

**K37.9 · 00:37:56–00:38:05 · M** — **Onay mumu**: likiditeyi alan mumdan **sonraki mum**; **kırmızı (ters) mum gelirse "yavaş yavaş problem var"**.

**K37.10 · 00:45:09–00:45:35 · F** — **Eğitmenin kendi post-mortem'i** (5 üst üste stop, ≈**−5R**): **(1)** trende karşı pozisyon, **(2)** ilk hedefte kâr alıp **stop'u girişe çekmemek**, **(3)** **konfirmasyon eksikliği**. "Günlük confluence'ı hiç aramadım; hep 4 saate baktım."

**K37.11 · 00:45:35–00:46:53, 00:47:46–00:48:42 · M** — **Konfirmasyonlu kurulum**: **(1) breaker, (2) turtle soup (likidite alımı), (3) pullback** üçü bir arada → **iki pozisyon** (aynı yerden, iki stop seviyesi); **R hesabı**: "5 kez stop = −5R; doğru yerde **3R pozisyon** bunu toplar"; **sistematik R takibi**.

**K37.12 · 00:31:09–00:31:17 · M** — **Zayıflık → ters pozisyon**: önemli bölgenin **altında kapanış (weakness)** görünce **hemen ters yönde pozisyon**; üstünde kapanış → long. (Stop-and-reverse mantığı; K30.3 ile uyumlu.)

**K37.13 · 00:43:07–00:43:28 · F** — **Parite karakteri**: eğitmen GBP/JPY'de "**2R'ye gidip dönüp stop eden**" davranışı sevmediğini söylüyor (4R yerine 1,17R). **Her paritenin karakteri farklı.**

**K37.14 · 00:05:53–00:05:57 · Y** — **GBP paritelerinde işlem açarken futures/DXY'ye de bak** (SMT vb.); bu videoda DXY olmadığı için kullanılmadı.

### Ders 37'den çıkan sonuç
- Eğitmenin **kendi backtest'i**: "çok stop, az ama büyük kazanç" yaklaşımı; kayıp nedenleri **trend karşıtı giriş + BE'ye çekmeme + konfirmasyon eksikliği** — botun **kurallarını doğrudan doğruluyor**: konfirmasyon zorunlu, karşı-trend yarım risk/yasak, ilk hedefte BE.
- **Sezonluk bakış** botta **opsiyonel zaman filtresi** olabilir ama dayanağı eğitmenin gözlemi; **kanıt değil**.
- **OB %50 kuralı** mekanik: giriş/geçerlilik kriteri olarak eklenebilir.


---

## Ders 38 — Kaybeden işlem vakası: LINK/USDT (intraday long, stop)

**K38.1 · 00:01:05–00:01:15 · M** — **Önce market yapısı (bias)**: bir parite/ürüne bakarken **ilk keşfedilecek şey trenddir (bias)**, "marketin trendi nereye gidiyor".

**K38.2 · 00:09:00–00:09:40 · M** — **HTF'de (günlük) ayı akışı sürerken ve destek kaybedilmişken long'u zorlama**. Alım yaptığı yer: V-shape recovery + minimal imbalance + HTF desteğin **retesti** (V-test); sonuç **stop**. Ders: **büyük zaman dilimi bias'ı her zaman önemlidir**; LTF'de pozitif emare olsa da **HTF desteğin altında** long açma.

**K38.3 · 00:09:57–00:10:09 · M** — **LTF'de ayı MS'leri görmeye başlarsan ve ana trend ayıysa**: "pozitif MS'ler var ama **ayı MS'leri de var, tekrar kaybettirebilir**"; **en yakın zamanda (giriş civarında) çık**, doğru yerden yeniden pozisyon bekle. **Giriş yakınında çıkma** kuralı.

**K38.4 · 00:07:36–00:07:56 · M** — **İşlem planı**: **imbalance bölgesinden giriş (11,96)**, **stop = V-shape toparlanma sürecindeki ilk swing low'un altı (≈11,66)**, **hedef = üstteki likidite bölgesi ve imbalance**.

**K38.5 · 00:08:00–00:08:24 · F** — **Erken uyarı**: fiyat üstteki likiditeyi temizledikten sonra **HTF direnç bölgesinde sert bir satış mumu** (ters mum) → **"bunun bir ayı tesadüfü/retest olabileceğinin ilk sinyali"**.

**K38.6 · 00:02:37–00:02:47, 00:03:15–00:03:21 · Y** — **Hiçbir konsept %100 değil**; "**umut bağlamak**" yerine **istatistiğe bağlı kal**; gerçekçi ol. (Eğitmen: "umut ettim, realistik davranmayı bıraktım, piyasa cezalandırdı.")

**K38.7 · 00:06:35–00:06:54 · M** — **Futures'ta stop statik**: intraday işlemde **stop önceden konur, dinamik olarak pek müdahale edilmez**; **kaldıraç ≈3x ve düşük miktar**; "spotta daha esnek davranılabilir, vadelide stop'suz **kesinlikle önermem**".

**K38.8 · 00:09:26–00:09:36 · F** — **Küçük zaman dilimindeki dönüş emareleri HTF'yi tetikleyebilir, ama her zaman HTF'ye odaklan.**

**K38.9 · 00:10:36–00:11:12 · Y** — **Ekran süresini azalt**; stop sayısı artıyorsa **paper trade'e geç**; **işlem günlüğüne hataları yaz** (aylar sonra hatırlanmaz).

**K38.10 · 00:05:53–00:06:21 · F** — **Intraday işlemlerin win-rate'i uzun vadeliden düşük**; gürültü fazla; eğitmen intraday'i yılda birkaç kez paylaşıyor.

**K38.11 · 00:04:11–00:04:20 · F** — **Return of Origin**: sert bir hareketin **başlangıç noktasına dönüş** eğilimi (ayrı bir videoda anlatılmış).

### Ders 38'den çıkan sonuç
- Bu vaka botun **HTF bias zorunluluğunu** ve **kaldıraç ≈3x, statik stop** varsayımlarını doğruluyor (3x, benim default'umla aynı çıkıyor — tesadüf değil; ama bunu **eğitmen "kendim 3x kullanıyorum" diye söylüyor**, kural değil).
- **"Giriş civarında çıkma" kuralı** (K38.3): botta **erken çıkış** (zayıflık sinyalinde BE/küçük zarar) modülü gerekebilir.


---

## Ders 39 — BTC/USDT range analizi (25 Şubat–Mart): haftalık açılış, EQ ve OTE

**K39.1 · 00:01:06–00:01:55 · M** — **Range = 3 parça (RL, EQ, RH)**. **EQ = RH ile RL'nin tam ortası (denge noktası)**. **EQ kırılımı** sonrası fiyat **PWO** (**previous weekly open**, geçen haftanın açılışı) ve **WO** (**weekly open**, bu haftanın açılışı) bölgelerine gidebilir. Bu seviyeler **kurumsal seviyedir**; fiyatın **sıkıştığı aralıklarda** bunları kullanmak önemli.

**K39.2 · 00:02:00–00:02:09 · F** — **Monday High / Monday Low** (pazartesinin en yüksek/en düşük seviyesi) gün içi işlem yapanlar için **etkili aralık**tır.

**K39.3 · 00:02:23–00:02:50, 00:05:28–00:05:47 · M** — **OTE (0,618–0,79) range içinde** de kullanılır: iki swing arasına Fibonacci çek; fiyat OTE'den dönüyorsa "**afakî bir yerden dönmüyor**", price action konseptlerinin çakıştığı yerden dönüyor. OTE + **imbalance** + **EQ/haftalık açılış** üst üste biniyorsa bölge güçlü.

**K39.4 · 00:03:00–00:03:30, 00:04:08–00:04:20 · M** — **Pozisyon yönetimi (short örneği)**: **EQ'ya dönüş + imbalance** gelince **%50 kâr realize et**, **stop'u girişe (BE) taşı**; **mikro LTF'de (1s altı) konfirmasyon** görürsen **64,6K civarında pozisyonu tamamen kapat, ters yöne (long) dön (reverse)**.

**K39.5 · 00:06:54–00:07:03 · F** — **Haftalık açılış her hafta değişir**: yeni hafta başlayınca **WO yeni, PWO = geçen haftanın WO'su**. (Bot için zaman bazlı seviye: haftalık mumun açılış fiyatı.)

**K39.6 · 00:08:19–00:08:37 · M** — **Kısmi çıkış örneği**: **%66'sını 69.550'de** realize et, **%33'ünü açık bırak**, **stop'u girişe çek**; "**kurumsal seviyeler** (özellikle **Monday ve haftalık açılış**) önemli"; **haftalık açılış civarında konfirmasyon** görürsem **yeni giriş** yapabilirim. *(Oranlar eğitmenin o işlemine özgü.)*

**K39.7 · 00:09:26–00:09:34 · F** — **Range/sığ yapıda kurumsal seviyeler** (WO gibi) **konfirmasyonla** birlikte kullanılır; **HTF'deki kırmızı bölge dirençtir**, **önceki ATH bölgesi destek** olarak çalışabilir.

**K39.8 · 00:10:20–00:10:35 · M** — **Ekleme sadece konfirmasyonla**: fiyat kesikli çizgi (S/R flip + imbalance) bölgesine gelse de **konfirmasyon yoksa alım yapmaz**; **range high'a deviation tatsız görünüm** (kısa vadeli) yaratır.

**K39.9 · 00:06:06–00:06:19, 00:13:02–00:13:12 · F** — **Mum formasyonları**: **eski ATH bölgesinde pin bar + ardından istekli mum** → **mitigation/OB** olarak değerlendirilebilir; **HTF'de doğru yerde bulunan mum formasyonları** çok değerli. **Steve Nison – Japanese Candlestick** kitabını öneriyor.

**K39.10 · 00:10:57–00:11:09 · M** — **0,705** (0,618 ve 0,79'un orta noktası) **EQ ile kesiştiğinde** güzel tepki.

**K39.11 · 00:13:25–00:13:49 · Y** — **LTF'de kaybolma, HTF seviyelerini kontrol et**: LTF + HTF kesişimini birlikte düşün; **HTF her zaman LTF'den büyük**.

**K39.12 · 00:04:42–00:05:02 · Y** — **Trading journal**: işlemden **önce nedenlerini yaz**; hatalarını/duygularını not et; aylar sonra hatırlanmaz.

### Ders 39'dan çıkan sonuç — botun yeni **zaman bazlı seviyeleri**
- **Haftalık açılış (WO), önceki haftalık açılış (PWO), Pazartesi High/Low (MH/ML)** eğitmenin **kurumsal seviye** saydığı **mekanik hesaplanabilir seviyeler** (kolayca koda dökülür); botta **hedef/giriş bölgesi çakışma (confluence) puanı** olarak kullanılabilir.
- **EQ kırılımı → PWO/WO hedefi** bir **kural adayı**.
- **%50 / %66 kısmi çıkış + BE** her işlemde farklı oran; sabit oran değil.


---

## Ders 40 — Scalping vakası: NEAR/USDT (gün içi hızlı al-sat)

**K40.1 · 00:00:54–00:01:11 · F** — **Narrative (haber akışı/tema) etrafındaki varlıkları** tercih et (örnekte **AI temalı** coin'ler); trend yukarı veya aşağı olsun, **daha çok ilgi çeken** paritelerde **kâr daha hızlı, işlemin gerçekleşme ihtimali daha yüksek**.

**K40.2 · 00:01:17–00:01:43 · M** — **S/R flip + bölge hafızası**: breakout mumlarıyla **terk edilen** seviye **tekrar destek olur**, yükseliş; **eskiden birçok kez destek olup sonra kaybedilen ve yeni low başlatan** kırmızı kutu, **tekrar ziyaret edilince direnç** olarak çalışır.

**K40.3 · 00:01:46–00:01:59 · M** — **Kısa vadeli short**: **supply (imbalance/likidite) bölgesi**, **swing high likiditesi alındıktan sonra bölgenin kaybı** görülürse **kısa düşüş**; **stop bölgenin üstü**, **hedef en yakın swing low'lar**.

**K40.4 · 00:02:17–00:03:06 · M** — **Long kurulum**: düzeltme dibi → **seri yükseliş (origin noktası)** → **dibin likiditesi temizlenir**; giriş buradan, **stop = likiditesi alınan swing low'un altı** ("imbalance'ın tekrar tekrar doğmayacağını umarak"); **narrative ve BTC yukarı** olması ek veri.

**K40.5 · 00:03:06–00:03:32 · Y** — **Alışılmadık zaman dilimi**: **34 dakika** (30 yerine) kullanıyor; "**herkesin kullandığı zaman dilimi olmaması**" nedeniyle OB/supply yapıları farklı çıkabilir; **hedef = 15 dakikadaki supply gövdesinin tepesi**. *(Kişisel keşif; kural değil.)*

**K40.6 · 00:04:25–00:04:34 · M** — **Hedefte erken çık**: bölgenin **tamamını beklemek yerine** **minimal imbalance bölgesinde** pozisyonu finalize et ("buraya uğramama ihtimali" için).

**K40.7 · 00:04:10–00:04:25 · F** — **4 saatlik kırmızı kutu (önemli supply/S-R)**: **likiditesini temizleyip düşünce** direnç olur; küçük zaman dilimi işlemlerini **4s bölgeleri** belirler.

**K40.8 · 00:04:48–00:05:00 · M** — **Yeni short düşüncesi**: **yeni high yapıp üstüne çıkamayan** yapı, **bölgenin kaybı** → short; **güvenli stop = üstü**, **RR artırmak için daha sıkı stop** da seçilebilir (riskli).

### Ders 40'tan çıkan sonuç
- Yeni mekanik kural yok; **zaten bilinen** kuralların (S/R flip, likidite hedefi, imbalance girişi, yapısal stop) **scalp uygulaması**. **Hedefe tam varmadan çıkma** (K40.6) bir **yönetim** kuralı adayı.


---

## Ders 41 — COMP/USDT: hafta sonu manipülasyonu sonrası gün içi işlem + "Winning Trade Mentality"

**K41.1 · 00:01:15–00:01:23 · M** — **"Tepeyi aşmak" tanımı (eğitmenin kendi tanımı)**: fiyatın eski high'ın **üzerine fitil bırakıp düşmesi değil**, **eski high'ın üzerinde mum KAPANIŞI** gerçekleştirmesidir. ("Böylece daha yüksek yüzdeyle çalıştığını düşünüyorum.") *(Botun "kırılım = kapanış" kuralını doğrudan destekler.)*

**K41.2 · 00:09:11–00:09:37 · F** — **Hafta sonu manipülasyonu**: likidite temizlikleri **Cuma günü sonu/Cumartesi/Pazar** denk geliyorsa genellikle **manipülasyon** olarak sonuçlanır; sonra **fiyat hızla istediği hedefe** gider. Örnek: Pazar günü oluşan yapı, **Pazartesi sabahı** (07–09 civarı) emir doldu, **aynı gün birkaç saat içinde** kapandı.

**K41.3 · 00:06:22–00:06:38 · M** — **İki range türü**: **(1)** çok temaslı klasik range; **(2)** **geçerli swing low ile swing high arasına Fibonacci** çekilerek oluşan range. Gün içi işlemlerde **geçici swing low/high arasına Fibonacci** çek; **0,5 ve altı ucuzluk**, tersi çizimde **0,5 üstü pahalılık**.

**K41.4 · 00:05:20–00:05:32 · M** — **Range davranışı**: RL ve EQ **destek**, EQ ve RH **direnç** olarak çalışması beklenir (**deviation görülmediği sürece**).

**K41.5 · 00:06:40–00:07:50, 00:08:12–00:09:09 · M** — **Kurulum zinciri**: **(a)** LTF'de range, **(b)** **deviation + likidite temizliği**, **(c)** önemli bölgenin **kırılımı** (range pozitifleşir), **(d)** mikro LTF'deki açık likiditeler temizlenir, **(e)** **breaker** (hızlı kırılım mumuyla terk edilen konsolidasyon), **(f)** içte küçük range → fiyat **0,5'in altına (ucuzluk)** iner, **büyük range EQ'su ile kesişir**, **(g)** giriş; **stop = likiditesi alınan dibin altı**, **hedef = range high'ın likiditesi**.

**K41.6 · 00:07:20–00:07:28 · F** — **LTF'de belirlenen seviyelerde küçük sapmalar olacaktır**; "mükemmel çalışması beklenmez".

**K41.7 · 00:12:49–00:12:58, 00:11:04–00:11:22 · M** — **Sonuç**: ≈**1,41R** kâr, **birkaç saatte** kapandı. "Kısa vadeli işlem diyorsan **kurallarına hâkim ol ve bitir**." Komisyon dahil net ≈ biraz daha düşük (eğitmen: "komisyon yüzünden ~1,36R").

**K41.8 · 00:13:14–00:14:33 · M/F** — **"Winning Trade Mentality" (eğitmenin kısmi çıkış + birikim yöntemi)**: **pozisyonun %80–90'ında hedefte kâr al, %10–20'sini açık bırak** (stop'u girişe taşırsan stop olabilirsin, taşımazsan **%10 uzun vadeli koşar**); örnekte **%90'dan ≈1,41R + %10'dan ≈14R'ye varan koşu** ile toplam kâr ≈2 katı; ayrıca **kazancın %10'unu spot (uzun vade) olarak aynı varlığa yatır**. *(Sayısal örnekler ASR'de bozuk; **yapı**: büyük kısım hedefte, küçük kısım (runner) + spot birikim.)*

**K41.9 · 00:10:38–00:11:02 · Y** — **%100 çalışan setup yok**; "setup %70–80 çalışıyorsa ateş edebilirsin"; **10 denemede 3 çalışsa bile RR iyiyse** kârlı olabilir; "istatistik bilimine dayanarak" işlem.

**K41.10 · 00:12:49–00:12:56 · Y** — Gün içi işlemi **birkaç saat** tut; "arkasında yılların deneyimi var".

### Ders 41'den çıkan sonuç
- **Kırılım = mum kapanışı** (K41.1): eğitmenin **açık tanımı**; botun `retest` ve `sweep` stratejilerinde zaten kapanış kullanıyorum → **doğrulandı**.
- **Hafta sonu manipülasyonu** (K41.2) bota **zaman bazlı filtre/etiket** olarak eklenebilir (Cumartesi/Pazar sweep'leri) — **eğitmenin gözlemi**, test edilmeli.
- **Runner (%10–20) + spot birikim** botun işlem yönetimine **opsiyonel** eklenebilir; spot birikim bot dışı.


---

## Ders 42 — ZEC/USDT: short'tan long'a dönüş, kısmi kâr, trailing stop, mum yapısı (gövde/fitil)

**K42.1 · 00:03:44–00:04:50 · M** — **HTF destek bölgesinde short'u TAMAMEN kapatma**: önce **%50 kâr al**; **konfirmasyon (breaker / mitigation)** görmeden pozisyonu **komple kapatıp long'a dönme**. Gerekçe: **piyasa trendi ayı**; "destekler kırılmak için vardır"; "tek seferde kapatmam".

**K42.2 · 00:17:19–00:17:23, 00:18:25 · M** — **Kapat ve dön = konfirmasyon sonrası**: "konfirmasyon gördükten sonra pozisyonu tamamen kapattım ve long'a döndüm."

**K42.3 · 00:06:27–00:08:18 · M** — **Gövde (body) vs fitil (wick)**: **gövde** = o periyodun **karar anı özeti**, kimin kontrol aldığı (büyük bull gövde = alıcılar baskın; **giderek küçülen gövdeler = momentum kaybı**); **fitil** = **reddedilen fiyat seviyeleri** (uzun alt fitil = alıcılar güçlü reaksiyon; uzun üst fitil = satıcı baskısı). **Kullanım**: **trend yönü ve momentum için gövde**; **seviye geçerliliği, stop hesabı, likidite analizi için fitil**; **önemli seviyede oluşan fitil gövdeden daha fazla bilgi** taşır; **dönüş (reversal) sinyallerinde ikisi de** değerli.

**K42.4 · 00:10:24–00:10:33 · M** — **Breaker long kurulumu**: **stop = likiditeyi temizleyen fitilin altı**; **giriş = breaker tepesi veya imbalance noktası** (veya **ikisine birden emir**); hedef daha yüksek yerler.

**K42.5 · 00:10:33–00:10:52, 00:15:44–00:15:58 · M** — **Trailing stop yöntemi**: hedef seviyelerinde **%25 kâr al**, **stop'u güncel swing low bölgesinin altına çek**; sonraki seviyede **tekrar %25 al, stop'u yeni swing low'un altına çek**; **parça parça kâr + takip eden stop** ile trendi taşı.

**K42.6 · 00:11:40–00:12:05, 00:14:27–00:14:33 · M** — **Net trend yokken / emin değilsen**: **alarm + konfirmasyon**; direkt almak isteyen **yarım riskle (örn. 50 USD)** girer, **konfirmasyondan sonra tam riske (100 USD)** tamamlar (spot olarak da). *(22/30/31/32. derslerdeki "yarım risk" kuralı.)*

**K42.7 · 00:16:00–00:16:30 · Y** — **Stop = sermayeyi koruma, kâr alma = sermayeyi büyütme**; trend bozulmamışsa **mantıklı yerlerde stop taşıyarak ve parçalı kâr alarak** swing pozisyonu taşı. Eğitmen **pozisyon taşımanın kendisi için en zor kısım** olduğunu söylüyor.

**K42.8 · 00:17:00–00:17:08, 00:11:05–00:11:08 · F** — Örnek pozisyon **≈10R'lik** (kâr ≈%70–80'i büyük kısmıyla major bölgede kapatılır); eğitmen **kapatma bölgelerini önceden** ilan ediyor.

**K42.9 · 00:14:20–00:14:27 · M** — **Eski tepeyi kırmadıkça tekrar tekrar yeni long kurma**; kuracaksan **yapı oluştuktan sonra pullback bekle, stop'u onun altına koy** veya **yarım riskle spot** ilerle.

**K42.10 · 00:14:55–00:15:08 · M** — **Dönüş sonrası long'u kapatma**: **imbalance / S-R flip** bölgesinde finalize.

**K42.11 · 00:17:30–00:18:09 · F** — **1 saatlik konfirmasyon örneği**: **likidite temizlenir → altta güzel fitil → ardından istekli mumlar (sert alıcı kitlesi) → küçük geri çekilme → tekrar sert alıcılık**; "satış adam akıllı yok, neden girmiyorsun" → **price action kendini anlatır**; isim önemli değil.

**K42.12 · 00:09:10–00:09:14 · F** — **Ardışık büyük gövdeli mumlar** trendin devam ettiğini, **küçük/kararsız mumlar** duraklamayı gösterir.

### Ders 42'den çıkan sonuç
- **Kısmi çıkış + trailing stop yapısı**: hedefte **%25'lik dilimler**, **stop her dilimden sonra güncel swing low'un altına** → botta **"swing-bazlı trailing"** kuralı olarak kodlanabilir (swing tanımı 14. dersteki belirsizliğe bağlı).
- **Gövde/fitil kullanım ayrımı** (K42.3) bot parametresi için net bir yönerge: **trend/momentum = gövde**, **seviye/stop/likidite = fitil**.
- **Yön değiştirme (kapat-ve-dön) yalnız konfirmasyonla**: botun reversal'ı konfirmasyonsuz yapmaması gerekir.


---

## Ders 43 — Pozisyon yönetimi: zaman dilimine göre risk büyüklüğü (ZEC/USDT, "Mixed Price Action Art" 9. video)

**K43.1 · 00:03:36–00:03:53 · M** — **Short örneği**: giriş ≈24,96; **stop = 0,705 seviyesinin (OTE orta noktası) üstü**; LTF'de daha iyi swing bulunabilir ama swing pozisyon büyük miktarda olduğu için **daha geniş stop** seçmiş (RR etkilenir). **0,618'in kaybı + retest + düşüş** onay sayılıyor.

**K43.2 · 00:03:54–00:04:30 · M** — **Pozisyonun %90'ını origin bölgesinde kapat**, **%10'u açık bırak** ("Winning Trade Mentality"); kalan için **stop girişe**; eğitmen önceki işlemde **tamamını kapattığı için büyük kârdan feragat ettiğini** itiraf ediyor.

**K43.3 · 00:05:33–00:06:55 · M** — **Long girişinin 3 sebebi (üst üste binmeli)**: **(1)** **4 saatlik imbalance**, **(2)** **OTE (0,618–0,786) başlangıcına retest** (Fibonacci), **(3)** **15 dakikada breaker** (low–high–yeni low, kırılım, geri çekilme, breaker'a temas ve seri yükseliş). **Mum yapıları ancak HTF/önemli bölgelerde (supply/demand) anlamlıdır**, alakasız yerde değil. Alt fitilli mum **beyaz (yukarı) kapanırsa daha emin**.

**K43.4 · 00:07:19–00:07:42 · M** — **Kısmi kâr planı (long)**: **ilk imbalance'ta %25**, sonraki bölgede **toplam %50**, son bölgede **%25** alıp **komple kapat**; örnekte ≈**2,1R**.

**K43.5 · 00:07:53–00:10:49 · M/Y** — **Risk miktarı zaman dilimine/süresine göre ayarlanır**: **bir günlük pozisyon için alınan risk, bir aylık swing pozisyonla aynı olmamalı**. Örnek: **büyük zaman diliminde 10 USD risk, küçük zaman diliminde 2–3 USD**. Gerekçe: **küçük zaman diliminde ayda ≈30 işlem** yapılır; **hepsinde büyük risk** kullanılırsa **ardışık kayıp serisinde (losing streak) hesap ciddi zarar görür**; ayrıca **psikolojik/kimyasal** etkiler (sabırsızlık, kararların bozulması). *(Eğitmen: "deneyim kazanana kadar minimal risk".)*

**K43.6 · 00:10:30–00:10:45 · M** — **Küçük zaman diliminde açılan pozisyonu uzak HTF hedefe taşıma**: stop küçük, hedef büyükse "**mantıksız kurgu**"; **küçük pozisyonlarla küçük hedefleri, büyük pozisyonlarla büyük hedefleri** hedefle. "Küçük yerleri spot koyup büyük yerleri hedeflememiz gerekiyor." *(ASR belirsiz; yön: işlemin boyutu ve hedefi zaman dilimiyle uyumlu olmalı.)*

**K43.7 · 00:10:05–00:10:28 · Y** — **Oyun planı önceden belli**: stop, hedef, ne yapacağım belli olduğu için pozisyona **sağlıklı** kalınabiliyor; **plana sadık kalmak** psikolojiyi korur.

**K43.8 · 00:04:34–00:04:46 · F** — **Doğru swing'ler arasına çekilen Fibonacci (0,705 / 0,618 / 0,5 / 0,38) doğru bölgelerde çalışır**; "doğru Fibonacci kullanımı".

### Ders 43'ten çıkan sonuç — botun risk modülü için kritik
- **Risk büyüklüğü sabit %1 değil, işlem süresine/zaman dilimine bağlı olmalı** (K43.5): **uzun vadeli swing = daha büyük risk**, **kısa vadeli işlem = daha küçük risk** (örnekte 10 USD vs 2–3 USD, yani ≈1/3–1/5). Bu, **karşı-trend yarım risk** kuralına ek ikinci bir **risk ölçekleyici**; botun risk modülü **iki çarpana** sahip olmalı: **zaman dilimi çarpanı** ve **trend/konfirmasyon çarpanı**.
- **Kısmi çıkış planı** tutarlı: **%25–%50–%25** (43. Ders), **%90 + %10 runner** (41, 43), **%25 dilimli trailing** (42). Hepsi **işleme göre değişen oran**; botta **konfigüre edilebilir çıkış merdiveni** olmalı, sabit tek oran değil.


---

## Ders 1 — Zaman döngüsü (lookback) ve HTF–LTF farkı  *(eğitmen "3. konu" diyor; kitapta Bölüm 1)*

**K1.1 · 00:02:16–00:03:53 · M** — **Her zaman dilimi için bakış penceresi (seviye çizerken geriye gidilecek süre)**:
- **Aylık**: **10–12 yıl** (5 yıldan az olmasın)
- **Haftalık**: **4–5 yıl** (2,5 yıldan az olmasın)
- **Günlük**: **12–15 ay** (6 aydan az olmasın)
- **4 saatlik**: **3–4 ay**
- **1 saatlik**: **3–4 hafta**
- **15 dakikalık**: **3–5 gün**

Daha geriye gitmek **noise (kirlilik)** üretir ve yanıltıcı seviyeler çıkarır. *(Kesin kural değil, "optimal aralık"; eğitmen "bulduğun çok iyi çalışan noktayı kullan" diyor.)*

**K1.2 · 00:04:12–00:04:31, 00:13:21–00:13:34 · M** — **Tümden gelim**: **aylık → haftalık → günlük → 4s → 1s → 15dk** sırasıyla, **her zaman diliminde o dilimin penceresiyle** seviye işaretle ve **zaman dilimi etiketi** koy (M, W, D, 4H, 1H); kırmızı = direnç, yeşil = destek, mavi = EQ.

**K1.3 · 00:11:00–00:11:12, 00:22:47 · F** — **Farklı zaman dilimlerinden gelen seviyelerin üst üste binmesi** (aylık + haftalık fitil seviyesi) **kesinlikle güçlü bölge**. **Bir seviye hangi zaman diliminde çizildiyse o zaman diliminde çalışma ihtimali daha yüksektir.**

**K1.4 · 00:23:43–00:24:29 · M** — **Hedef, seviyenin çizildiği zaman diliminde belirlenir**: 15dk'da çizilen seviye için 15dk hedef; **4s'te çizilen seviyenin hedefi 4–6 saatlik bölgeler**. **15dk'da long kurup aylık dirençi hedeflersen yanılma ihtimali çok yüksek**; fiyat o bölgeye gitse bile **önce seni stop eder**. *(Risk yönetimi dersinde "farklı kullanım" var — 43. dersle tutarlı.)*

**K1.5 · 00:27:12–00:27:45, 00:31:12–00:31:21, 00:33:05–00:33:48 · M/F** — **HTF–LTF ilişkisi**: **küçük zaman dilimindeki aksiyonlar büyük zaman dilimini değiştirebilir, ama bir-iki emare yetmez; ardışık 1–5 emare gerekir**. **Günlükte kırılım + 15dk'da küçük deviation** büyük sorun değil; **ama 15dk → 1s → 4s hepsi aynı yönde evriliyorsa kırdığın direnç "yalancı" (fake) olabilir**, yani **LTF emareleri zamanla HTF kırılımının sahte olduğunu gösterir**. **HTF koşulları LTF koşullarından her zaman daha önemlidir; trendi HTF belirler.**

**K1.6 · 00:15:35–00:18:04 · M** — **EQ çizimi**: RH ile RL arasına **Fibonacci 0 ve 1, tam 0,5 = EQ**; EQ'ya **ince ayar** yapılabilir ("bu alan spesifik nokta değil **alan**"). **4s RH/EQ çok iyi çalışırken 1s'te daha az verimli** çalışabiliyor.

**K1.7 · 00:25:05–00:27:00 · F** — **Büyük kurumlar** (merkez bankaları, JP Morgan, fon yöneticileri) **aylık/haftalık (en düşük günlük)** grafikte pozisyon alır (positional); **hedge fon yöneticileri** onların bünyesinde **LTF salınımlarında** işlem yapar; **retail** LTF'e yönelir. **Fiyat X'ten 2X'e giderken lineer gitmez**: arada 1,5X–1,3X–1,6X–1,4X salınımları olur; kurumlar bu aradaki salınımları kaçırmamak için LTF trader'ları kullanır.

**K1.8 · 00:33:48–00:34:07 · F** — Sonraki konu: **haftalık açılış / haftalık high-low / önceki haftalık açılış / günlük açılış / günlük high-low / aylık açılış / yıllık açılış** seviyeleri (zaman bazlı seviyeler). *(39. dersteki WO/PWO'nun temeli.)*

### Ders 1'den çıkan sonuç — botun veri/penceresi için doğrudan kural
- **Pencere kuralları mekanik** (K1.1): bot, her zaman diliminde seviye (swing, range, OB) aramasını **o dilimin penceresiyle sınırlamalı** (4s için **≈3–4 ay ≈ 700–1000 mum**, 1s için 3–4 hafta ≈ 500–700 mum, 15dk için 3–5 gün ≈ 300–500 mum, günlük için 12–15 ay ≈ 360–450 mum). Benim botum **tüm geçmişi** kullanıyordu → **düzeltilmeli** (eski pivotları pencere dışına at).
- **Hedef = giriş zaman diliminin seviyeleri** (K1.4): botumda "en yakın likidite" zaman dilimi ayrımı yok.
- **Çoklu zaman dilimi seviye çakışması** puanlama kriteri (K1.3).


---

## Ders 2 — Günlük / haftalık / aylık açılışların (DO, WO, MO, PWO) ve Pazartesi High/Low'un önemi  *(eğitmen "4. konu" diyor; kitapta Bölüm 2)*

**K2.1 · 00:03:16–00:06:03 · M** — **Seviyeler**: **MO** (monthly open, aylık mumun açılış fiyatı), **WO** (weekly open), **PWO** (previous weekly open, geçen haftanın açılışı), **günlük açılış**, **günlük high/low**, **Monday High / Monday Low** (pazartesinin en yüksek/en düşük seviyesi). Hepsi **mum açılış/uç fiyatlarından mekanik** hesaplanır.

**K2.2 · 00:01:30–00:02:53 · F** — **Gerekçe**: fiyat **smart money** (kurumlar, fon yöneticileri) tarafından kontrol edilir; onların işlem yaptığı zaman dilimleri **M, W, D**. Bu seviyeler geçmişte bulundukları yerlerde önem kazanır; **price action konseptleriyle kesiştiğinde önemi artar**. **Günlük/haftalık high-low** seviyeleri, **gün içi ve 3–5 günlük kısa vadeli** trader'lar için önemli.

**K2.3 · 00:05:54–00:06:03 · M** — **Monday High/Low**: **hafta içi işlem atacaksan ve piyasa sığ/küçük aralıkta ilerliyorsa** işaretle.

**K2.4 · 00:07:53–00:10:14 · M** — **Davranış örüntüsü**: fiyat **MO/WO'ya bearish retest** yapıp **alıcı bulamazsa** daha aşağı gider; sonra **breakout mumuyla MO/WO'yu delerse** yön değişir; MO'dan başlayan hareketin **Fibonacci 0,5'i** çoğu zaman bir seviyeyle çakışır.

**K2.5 · 00:11:59–00:12:31 · M** — **Trende yönelik kullanım (en önemli ilke)**: **trend bearish ise bearish formasyonlara, bullish ise bullish formasyonlara bak**; "trend sana o formasyonu direkt elinle verir"; "her şeyi bir kenara bırak, **trend çok önemli**."

**K2.6 · 00:16:10–00:18:06 · M** — **Haftalık mum PWO'nun üstünde kapanırsa**: "**gelecek haftalarda bullish emare olması bearish emare olmasından daha büyük ihtimal**" (bir veri daha). Haftalık bias için kapanışa bak.

**K2.7 · 00:19:19–00:19:51 · M** — **Kısa vadeli long için anahtar seviye = WO**: "fiyat 61.500'ü kaybederse WO, kısa vadeli long inşa etmek için en optimal alan."

**K2.8 · 00:21:34–00:21:58 · M** — **Kâr alma**: arz bölgesine yükselince **en uygun yer PWO**; **pozisyonun bir kısmı PWO'da kapatılır**.

**K2.9 · 00:22:41–00:23:10 · F** — **PWO/WO geçmişte çalıştıysa** (sweep sonrası destek) tekrar kullanılabilir; "doğru belirlenmiş seviye, etkisini kaybetse bile **kendi price action'ını oluşturmanı sağlar**."

**K2.10 · 00:15:12–00:15:22 · M** — **Deviation tanımı**: fiyat range'in dışına düştüğünde **henüz "deviation yaptı" denmez**; **istekli bir breakout mumuyla range içine geri girdikten SONRA** deviation (fake) denir; fiyat oraya geri gelirse alım değerlendirilir. *(Botta deviation = sapma + güçlü geri dönüş mumu.)*

**K2.11 · 00:20:53–00:21:06 · M** — **Hedefin tam bölgesini beklememe**: "ufacık bir alan için eldeki kârı bırakmak istemedim" (40. Ders K40.6 ile tutarlı).

**K2.12 · 00:17:13–00:17:46 · F** — **EUR/USD ve DXY** en yüksek korelasyon; MS'leri birbirini etkiler; "sadece bu yetmez, ekstra veriler lazım".

### Ders 2'den çıkan sonuç
- **MO, WO, PWO, günlük açılış, Pazartesi H/L mekanik olarak hesaplanabilir** → botta **seviye + confluence puanı** olarak eklenmeli; **kripto için "haftanın başlangıcı" tanımı** (Pazartesi 00:00 UTC mı?) dersten **net değil**, parametre olarak bırakılmalı.
- **Trende yönelik kullanım** botun **tüm sinyallerinde HTF trend uyumu** gerektiren bir ilke olarak tekrar doğrulandı (K2.5).
- **Deviation tanımı** botun sweep stratejisinde "kapanışla geri dönüş" yerine **"istekli breakout mumuyla range içine giriş"** olarak revize edilmeli.


---

## Ders 5 — Konsolidasyon, akümülasyon ve distribüsyon  *(eğitmen "6. konu" diyor; kitapta Bölüm 5)*

**K5.1 · 00:01:21–00:02:21 · F** — **Konsolidasyon**: büyük trendi **ne sürdüren ne tersine çeviren** fiyat; **sınırlı range'de** işlem görür. Trend takipçileri bunu **kararsızlık** sayar ve **yeni emare görene kadar işlem almaz**. Fiyat alanı terk edince konsolidasyon biter; **ama deviation payı vardır**.

**K5.2 · 00:02:21–00:02:35 · F** — Konsolidasyon alanına **tekrar tekrar girilmesi**, **EQ ve diğer range bölgelerinin test edilme olasılığını** artırır.

**K5.3 · 00:03:54–00:04:55 · F** — **Akümülasyon**: **uzun düşüş trendinden sonra** fiyatın yataya bağlaması; smart money fiyatı çok yukarı çekmeden **pozisyon biriktirir**; fiyatı "top gibi oynatıp" **stop'ları patlatır, likidite yaratır**. **Distribüsyon**: **uzun yükselişten sonra** yatay; smart money **dağıtır/short açar**. **Zaman diliminden bağımsız**, her yerde işler (30dk'da da günlükte de).

**K5.4 · 00:05:59–00:06:14 · M** — **Deviation sonrası istekli mumla içeri girişte** fiyat **ilk olarak EQ'yu test eder**; **EQ (0,5) bölgesinden yeni pozisyon inşa** fikri her zaman akılda olmalı. Sonra **range high'ı test eder**.

**K5.5 · 00:07:24–00:07:45 · M/Y** — **Aynı deviation'ın 5–6 kez tekrarı eğitmene göre mantıklı değil**; deviation kırıldıktan sonra **pullback'te (0,5 civarı) optimal long** kurulur (akümülasyon fazı varsayımıyla); **imbalance'ın altına inmemesi** ve **breakout mumunun önceki high'ı retest etmesi** güçlü işaret.

**K5.6 · 00:09:36–00:10:28, 00:11:34–00:11:52 · M** — **Distribüsyon kurulumu**: **range low'u breakout mumuyla kaybeden yapı + retest** → düşüş (örnekte **1,5 saatte ≈%0,56 / 70 pip**). **Breakout mumu sonrası piyasa düşüş yönündeyse** önce **EQ'yu**, sonra **range high'ı** test etmesi beklenir; **breakout sonrası ≈%50 (0,5) testi** ve sonrasında düşüşler olabilir; o bölge **direnç olarak çalışma ihtimali yüksek**.

**K5.7 · 00:10:41–00:11:31 · F** — **Tek parametreye bakma**: kripto için **DXY, futures, BTC** korelasyonlarını da kontrol et; **confluence arttıkça gerçekleşme ihtimali yüzdesel olarak artar** ("elinizde ne kadar fazla veri varsa").

**K5.8 · 00:03:03–00:03:28 · F** — **Indecision candle** = konsolidasyonun **tek mumluk hali** (bir mum da bir range sayılabilir); 20. ders konusu.

**K5.9 · 00:11:59–00:15:16 · Y** — **Wyckoff/formasyon isimleri**: karşı değil, ama **önce fiyatın kendisini oku**; isim takıp kalıplara uydurmaya çalışmak kuralların içinde yorar; **bol bol backtest** (farklı market, zaman dilimi, parite).

### Ders 5'ten çıkan sonuç
- **Akümülasyon/distribüsyon** botun **rejim bilgisi** olarak kullanılabilir: **uzun düşüş sonrası range = akümülasyon (long bias)**, **uzun yükseliş sonrası range = distribüsyon (short bias)** (K5.3). "Uzun" için sayısal eşik **dersten yok**.
- **Deviation sonrası EQ → range high** sırası (K5.4, K5.6) botun hedef kademelendirmesinde (4. Ders K4.13 ile) tutarlı.


---

## Ders 6 — Breakout candle ve Return to Origin (RTO)  *(eğitmen "7. konu" diyor; kitapta Bölüm 6)*

**K6.1 · 00:01:18–00:02:08 · M** — **Breakout candle**: fiyatın **bir denge seviyesinden (EQ) veya range'in altından/üstünden (RL/RH) HIZLICA** ayrılmasıyla oluşan mum. **Önemi**: fiyat hızla bir seviyeden ayrılırsa smart money'nin **yeniden fiyatlama modeli** ortaya koymak istediğini, yani **yeni yapı / trend başlangıcı / trend değişimi** olabileceğini gösterir. **Yatay çizgi, supply/demand bölgesinin kırılması** da breakout sayılır (yalnız diagonal formasyon kırılımı değil).

**K6.2 · 00:02:09–00:02:21, 00:02:44–00:03:02 · M** — **Eylem**: breakout sonrası **Order Block veya EQ'ya geri çekilme** gözlemlenir; **fiyat kümesinin mantıklı bölgelerinden düşük riskle giriş** aranır. **Anahtar soru: "ne zaman ve nerede?"** — aynı yapı her yerde oluşur, **nerede/ne zaman oluştuğu** kaliteyi belirler.

**K6.3 · 00:04:22–00:07:06 · M** — **Örnek kurulum**: range low'un altına fitil (deviation) → **aynı gün sert mumla range içine geri giriş** (yerel dibin likiditesi temizlenir) → fiyat range low'u test eder → **bir breakout mumu daha** → breakout mumunun dibine geri çekilince **alım**: **range low + order block + breakout candle + likidite temizliği + imbalance** = çok veri.

**K6.4 · 00:09:52–00:13:26 · F** — **Retracement vermeyen breakout'lar**: **BTC gibi manipülatif ve hacmi global piyasalardan (S&P, forex) zayıf** marketlerde **akümülasyon sonrası breakout mumu retest vermeden gidebilir**; "flag" gibi chart pattern'leri beklemeden uçar. **Akümülasyon teşhisi**: **(1)** önemli tarihsel destek, **(2)** **lower high'lar** (ASR: "lower highlar belli ediyor"), **(3)** **On-Balance Volume (OBV) divergence** (fiyat dar range'de, OBV yükseliyor). **Geri çekilirse** EQ (%50) veya range high'tan alım; **ama geri çekilmeme ihtimali her zaman gözlenmeli.**

**K6.5 · 00:13:35–00:18:56 · M** — **RTO (Return to Origin) örneği (EUR/USD)**: **günlükte likidite temizliği** → **LTF'de range low'da deviation** → **breakout mumuyla range içine giriş** → fiyat **EQ'da bekler**, **2 geçerli breakout mumuyla EQ'yu kırar** → range high'ın likiditesini temizleyip kapatamaz, aşağı döner, **imbalance'ı kapatır** → **başlangıç noktasına (origin) döner = order block** → **long, order block'tan RTO ile**; **stop OB altı**, hedef **≈5–6R** ("6–7 kez stop olma imkânı verir").

**K6.6 · 00:16:44–00:17:00 · F** — **EUR/USD işleminde** ayrıca **EUR futures** ve **DXY** (dolardaki güçsüzlük emaresi) kontrol edilir; çok veri = "bedavadan para".

**K6.7 · 00:14:27–00:14:35, 00:17:35–00:17:49 · F** — **Range low'a çarptıkça yükselen dipler** (1., 2., 3. temas giderek yukarıda) ve likidite alındıktan sonra aşağı gidememe = yükseliş emaresi.

**K6.8 · 00:09:33–00:09:47 · M** — **Stop her zaman**: "market beni de yanıltıyor olabilir, haber gelebilir"; **marketle inatlaşma, zararı gereken yerde kes.**

**K6.9 · 00:07:36–00:08:06 · Y** — Konseptleri **chart pattern gibi kullanma**; önce **gerçek parayla işlem yapmadan** işleyişi keşfet, **kendi price action'ını** oluştur.

### Ders 6'dan çıkan sonuç
- **Breakout candle = "hızlı/istekli ayrılma"**, sayısal tanımı **yok**; botta **gövde/ATR eşiği** bizim varsayımımız olacak (20. dersteki "hacimli mum" sorunuyla aynı).
- **RTO = impulsive hareketin origin'ine (OB) geri dönüş**; **OB (18. Ders) + RTO** birleşik bir giriş modeli olarak botta **tek durum makinesi** halinde kodlanabilir: *range low deviation → breakout mumu → retracement → origin/OB girişi*.
- **BTC'de retest beklemeyen breakout'lar** (K6.4; 4. Ders K4.14 ile aynı) → **retest girişi için "NO_FILL" oranı BTC'de yüksek olacak**; bu **beklenen bir sonuç**, hata değil.


---

## Ders 7 — Retracement (düzeltme/pullback) ve "veri sayımı" (confluence)  *(eğitmen "8. konu"; kitapta Bölüm 7)*

**K7.1 · 00:00:00–00:01:10 · M** — **Retracement = trend dışı fiyat hareketi** (düzeltme): fiyatın **yakın zamanda oluşan range'e/fiyat kümesine geri dönmesi**; **reversal DEĞİLDİR**. Smart money, trend yönünde yeni seviyeler için yeni alıcı/satıcı bulmak üzere düzeltmelerden yararlanır. **Eylem**: **trend yönündeki en belirgin swing high/low'un İHLAL EDİLMEDİĞİNİ** gözle (trend değişmedi verisi); fiyat **price action metodolojisiyle belirlenmiş alanlara** geri çekilince alım/satım düşün.

**K7.2 · 00:02:09–00:04:30 · M** — **Düzeltme range'inde Fibonacci**: **0,5 altı ucuzluk**, **0,618** düzeltmenin temel noktası, **OTE = 0,618–0,786 (0,705 aslında 0,707)**; "range'in kuralı yoktur, subjektif; ama **doğru zamanda ve doğru yerde** bulunmalı".

**K7.3 · 00:05:27–00:07:29 · M (confluence sayımı — çok önemli)** — Örnek short, **"veri sayımı"** ile anlatılıyor:
- **Başlangıçta 2 veri** (tarihsel haftalık dirençten rejection + "range varsayımıyla pahalı bölgede") → **yetersiz**; "şortlamak yerine bekleyebilirim".
- **Swing low ihlal edilince 5 veriye çıkıyor**: **(1)** haftalık tarihsel dirençten rejection, **(2)** **lower high → lower low** (yapı bozulması), **(3)** yapı kırılımıyla oluşan **yeni range + pahalılık bölgesi**, **(4)** **OTE'ye giriş (0,618 retest)**, **(5)** **daha önce test edilmemiş order block'a geri dönüş**.
- **İç içe range** (range içinde range) ile **6. veri**: iç range'in OTE'si. "5 gerçek + 1 farazi veri" → **düşük riskli short**.

**K7.4 · 00:08:39–00:08:46 · Y** — "**Order block gördüm, short'luyorum**" diyen kaybeder; metodolojiyi **chart pattern/harmonik/Wyckoff/tek Fibonacci**'dan ayıran **çok veri** (confluence) olmasıdır.

**K7.5 · 00:04:44–00:05:20, 00:08:14–00:08:20 · M** — **Dönüş tetikleyicisi**: önemli **swing low'un ihlali** (yapı değişimi) sonrası **pullback**, **bearish piyasadaki en optimal short bölgesini** sunar.

### Ders 7'den çıkan sonuç — botun giriş izni için kritik
- **Eğitmen giriş için "veri sayısı" arıyor: 2 veri yetersiz, ≈5 veri (+1 farazi) = düşük risk.** Bu, botumun **"puanlama/confluence eşiği"** tasarımını destekler: **giriş izni = en az N bağımsız teyit** (N≈5; ders net sayı vermiyor, örnekte 5). **N eğitmenin kesin kuralı değil, örnekten çıkarılmış bir eşik** olarak etiketlenmeli ve backtest'le denenmeli.
- **Trend yönündeki en önemli swing'in ihlal edilmemesi** (K7.1) düzeltme girişinin **ön şartı**.


---

## Ders 8 — Reversal (marketin dönüş emareleri)  *(eğitmen "9. konu"; kitapta Bölüm 8)*

**K8.1 · 00:00:03–00:00:42 · F** — **Reversal** = fiyatın **ana yönünün tersine** hareket etmesi. Smart money fiyat yönünü çevirirken **stop'ların yoğun olduğu bölgeye** (old high'ın hemen üstü / old low'un hemen altı = **likidite**) hareket ettirir. İki temel soru: **emirler nereden dolar? Likidite (en çok işlem yapılabilecek yer) nerede?**

**K8.2 · 00:01:12–00:02:33 · M (veri sayımı — 7. dersle aynı mantık)** — **BTC 14K tepesi örneği**: tek bir emareyle (tarihsel dirençten rejection) **direkt short'lama**; **emare sayısı** önce **2** (1 gerçek: tarihsel seviye rejection; 1 farazi: varsayımsal range'de pahalılık + OTE), **yapı kırıldıktan sonra 7** (6 gerçek + 1 farazi):
1. Tarihsel seviyeden rejection
2. **Rejection sonrası oluşan son low'un ihlali**
3. Yeni range'de **0,5 üstü (pahalılık) bölgesine giriş**
4. **0,618'e (OTE başlangıcı) net temas**
5. **Alçalan tepeler** (önceki tepeyi geçememe)
6. **Order block**
7. Range içindeki range'de **OTE + pahalılık** (farazi)
"Elimizdeki veri arttıkça kurduğumuz setup'ın kazanç ihtimali de o oranda artar."

**K8.3 · 00:02:33–00:02:46 · Y** — **Amaç en tepeyi/dibi yakalamak değil**: **en doğru yerde giriş, en az risk, en yüksek ödül**. "Kimse sana tepeyi yakaladın diye kupa vermeyecek."

**K8.4 · 00:03:00–00:05:33 · F** — **Her market, parite ve zaman diliminin kendi karakteri vardır**: USD/JPY kısa zaman diliminde **insanları yormaya yönelik (manipülatif)** hareketler yapar; BTC **günlükte daha olgun/keskin**, kısa zaman diliminde daha manipülatif ve belirsiz. **Kripto ve forex, BTC ve ETH, EUR/USD farklı karakterde** → **her pariteyi ve zaman dilimini ayrı ayrı test et**; "price action'ı kendin yaratmalısın".

**K8.5 · 00:03:37–00:04:43 · M** — **Sürekli deviation (sapma) paterni**: likidite alındıktan sonra **fiyatın yeni likidite bölgelerine gitmesi** beklenirken **altına/üstüne kapatıp aniden range'e geri giriyorsa** bu **tuzak/dönüş emaresi**; fiyat **EQ'ya ve range'in karşı ucuna** gider. Aynı yapı sürekli tekrar eder ("iki tarafı kesip biçiyor").

**K8.6 · 00:04:45–00:05:04 · F** — **Lokal tepe**: 4 saatlikte görülen bir tepe, 15 dakikada **yüzlerce küçük dönüş** içerir; her zaman diliminin **kendi lokal tepe/dibi** vardır; "hangi zaman diliminde baktığını bil".

**K8.7 · 00:06:20–00:06:52 · M/Y** — **Tuzağa düşme ve yeniden giriş**: "range içine girdim" diye long açan, **likidite alımıyla stop olur**; **stop olup, fiyat tekrar kapanışla geri dönünce yeniden dahil ol**. Bu tür hareketler **haftada/ayda bir mutlaka çıkar**; **trading journal**'a not al; **3–4 stop'un acısını tek pozisyonla çıkarabilirsin** ("akıllı düş, akıllı kalk").

### Ders 8'den çıkan sonuç
- **Dönüş (reversal) girişi çok-teyitli**: eğitmen **6–7 emareyi** sayıyor; ancak **bunların çoğu "gerçek" yargı** (tarihsel seviye, OB, alçalan tepe) ve **sayısal eşik yok**. Botta **teyit puanı** (7. ders K7.3 ile birlikte) tasarlanırken **"N ≥ 5" varsayımı kullanıcı onaylı bir parametre** olmalı.
- **Stop → yeniden giriş** (8, 12, 26, 28, 30, 31, 34. dersler) kuralı **toplamda 8 derste** tekrarlandı.


---

## Ders 9 — Fiyat döngüsü mekanizmasının özeti (4 element)  *(eğitmen "10. konu"; kitapta Bölüm 9)*

**K9.1 · 00:01:42–00:03:35 · M (durum makinesi)** — **Fiyat döngüsü 4 elementten oluşur**: **(1) Konsolidasyon** (akümülasyon / distribüsyon, range dahil), **(2) Breakout**, **(3) Düzeltme (retracement)**, **(4) Reversal**. **Zincir**: *konsolidasyon, breakout mumuyla terk edilir* → *terk yönü ana yapıya göre ya devam ya reversal* → *reversal/breakout sonrası fiyat çoğu zaman **düzeltme** yapar (RTO: origin'e, swing high'a veya EQ'ya dönüş)* → *yeni konsolidasyon*. "Aslında her şey bir konsolidasyondan ibaret"; **tüm sonraki konseptler (OB, imbalance, breaker, mitigation, OTE, uzantı) bu 4 elementin üzerine oturur.**

**K9.2 · 00:04:24–00:05:31 · Y** — **Amaç sadece para kazanmak değil, konseptin felsefesini ve en yüksek olasılıkla çalıştığı koşulu keşfetmek**. "On işlemde altısını kazanıp dördünü kaybetmek" yerine **on işlemde sekiz–dokuzunu/mümkünse hepsini kazanma** hedefi; **stop olması sorun değil ama stop'ları minimize etmenin yolu temel konulardır**. **Risk (para) sabit**, **işlemin kazanma ihtimalini maksimize etmek** hedef.

**K9.3 · 00:05:35–00:06:11 · F** — **Önceki örneklerin hepsi dört elementi kapsıyor**: range (konsolidasyon) → **range low kaybı + deviation** (fake-out) → **istekli breakout mumuyla range'e geri giriş** → düzeltme (order block / range low'a dönüş) → hedef range high; "bir pozisyonda fiyatın dört temelini üstüne inşa ederek kurduk".

**K9.4 · 00:00:24–00:01:00 · F** — Eğitim yapısı: **ilk 12 konu temel/felsefe**, sonraki **≈17 konu konsept ve metodoloji**, **27.–32. konular psikoloji ve risk yönetimi**. Eğitmen, konuları **düşündürerek ve boşluk bırakarak** anlatıyor; bu yüzden tek bir ders **tam kural vermeyebilir**.

### Ders 9'dan çıkan sonuç — **bot mimarisinin iskeleti eğitmenin kendi modelinden gelmeli**
Botun çekirdeği **4 elementli bir faz makinesi** olmalı (**konsolidasyon → breakout → düzeltme/RTO → reversal**) ve tüm konseptler (**OB, imbalance, breaker/mitigation, OTE/ucuz-pahalı, likidite hedefi, PWO/WO, SFP**) bu fazlara **teyit verisi** olarak bağlanmalı (7. ve 8. ders "veri sayımı").

---

# GENEL SENTEZ (42 dersin ortak sonucu)

> **Okunan ders sayısı: 42 / 44.** Okunamayanlar: **Ders 35 ve 36** (DOCX'te döküm bağlantısı yok). **Kısmi (döküm kesik)**: Ders 3 (~08:26'da biter) ve Ders 29 (~04:05'te biter). Ders 16'nın anlatıcısı belirsiz.

## A. Eğitmenin tekrar eden, **kesin** kuralları (≥3 derste)
1. **Trend/HTF her şeyden önemli** (1, 2, 14, 17, 18, 19, 22, 25, 28, 29, 38, 42): işlemler HTF trend yönünde; HTF > LTF.
2. **Konfirmasyonsuz giriş yok** (19, 22, 23, 25, 26, 28, 31, 32, 37, 42): LTF konfirmasyonu (breaker/MSB/SFP onay mumu) beklenir.
3. **Karşı-trend veya konfirmasyonsuz işlemde yarım risk** (22, 29, 30, 31, 32, 42).
4. **Stop her zaman, yapısal yerde** (tüm derslerde); **sabit stop yok, yapı ötesi**.
5. **Hedef = temizlenmemiş likidite / imbalance / HTF seviyesi**; hedefe tam gelmeden çıkma (2, 22, 28, 40, 15).
6. **Kısmi çıkış + stop'u girişe taşıma** (30, 31, 37, 39, 41, 42, 43); oranlar işleme göre değişir (%25/%50/%90).
7. **Stop sonrası yeniden giriş** (8, 12, 26, 28, 30, 31, 34): yarım risk, ≥2R hedef.
8. **Giriş rafinesi (HTF bölge → LTF konfirmasyon)** RR'yi 1 → 2,2 → 4,7'ye çıkarır (28, 33).
9. **Risk işlemden önce sabit tutar**, lot stop mesafesine göre (17, 27).
10. **Kırılım = mum KAPANIŞI** (19, 41).
11. **Confluence/veri sayımı** (7: 2 veri yetersiz, 5+ iyi; 8: 7 veri; 13, 23).

## B. **Yargı ağırlıklı / sayısal tanımı olmayan** (botta bizim varsayımımız olacaklar — açıkça etiketlenmeli)
- "İstekli/hacimli mum" (breakout, OB, IC): sayısal eşik **yok**.
- Swing tanımı: **4. mum kuralı** (belirsiz) **veya breakout mum kuralı**; 3. kural açıklanmadı.
- "Önemli imbalance", "yüksek önemli likidite/bölge", "kurumsal bölge": göz kararı.
- Range sınır seçimi (fitil/gövde), range temas sayısı (1–2 vs ≥3, çelişki 16 vs 3/24).
- Kaç veri yeterli (N): örnekte 5; kesin değil.
- Sezonluk bakış, haber, korelasyon (DXY/BTC.D), kurumsal ayak izi: bot dışı veri.

## C. Botum için **yanlış çıkan** varsayımlar (düzeltilecek)
1. Sabit pivot k=3 → eğitmenin swing'i fiyat hareketine bağlı (4. mum / breakout mumu).
2. Giriş = kırılan seviyeye tek limit → **bölge/OB/imbalance'a kademeli** (breaker ise kırılan bölge, mitigation ise LH bloğu).
3. Stop = LH + ATR → **yapısal flip bölgesi / likiditenin ötesi**.
4. Hedef = en yakın pivot → **temizlenmemiş likidite, imbalance, Fib uzantı (1,272/1,618)**.
5. Min RR = 2 → eğitmende **sabit eşik yok**; RR **giriş rafinesinden** doğar.
6. Tüm geçmişi kullanma → **zaman dilimine göre pencere** (4s: 3–4 ay; 1s: 3–4 hafta; 15dk: 3–5 gün; günlük: 12–15 ay).
7. Sweep'te market girişi → **konfirmasyonlu giriş** (onay mumu).
8. Tek tip %1 risk → **zaman dilimi ve trend/konfirmasyon çarpanları** (43, 22/30).
9. Seviye listesinde **MO/WO/PWO/Pazartesi H/L** yok → eklenmeli.

## D. Önerilen bot mimarisi (eğitmenin 4 elementli modelinden)
**Faz makinesi**: `KONSOLİDASYON(range + EQ, akümülasyon/distribüsyon) → BREAKOUT → (DÜZELTME/RTO | REVERSAL)`.
**Teyit verisi (confluence puanı)**: HTF trend uyumu · HTF bölge tepkisi · likidite temizliği/SFP · deviation + istekli giriş mumu · MSB/breaker veya mitigation · OB/EFLOUD OB · imbalance · OTE (0,618–0,786) + ucuz/pahalı bölge · EQ · MO/WO/PWO · onay mumu.
**Giriş**: puan ≥ N **ve** HTF trend yönü (karşı yönde **yarım risk**) **ve** LTF onay mumu; **kademeli emir** (%30/50/20 veya %10/20/30/40).
**Stop**: yapısal (likiditenin / flip bölgesinin ötesi). **Hedef**: temizlenmemiş likidite/imbalance/Fib uzantı; **kısmi çıkış merdiveni** + BE/trailing (swing altı).
**Risk**: sabit tutar; **zaman dilimi çarpanı** + **trend/konfirmasyon çarpanı**; **stop sonrası yeniden giriş** (yarım risk, azami 3 deneme).
**Veri**: her TF için **kendi penceresi**; HTF kapanış sonrası erişim.