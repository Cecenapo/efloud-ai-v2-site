# EFLOUD AI 2.0 — Range ve ATR kaynak doğrulaması (15 Ekim 2026)

## Kaynaktan çıkarılabilen ilkeler
EFLOUD 44 Ders Görselli Kitap: Bölüm 3 RH/RL/EQ, Bölüm 4 deviation-sweep ve gerçek breakout farkı, Bölüm 14 pivot teyidi ve major/minor structure, Bölüm 17 yapısal stop.

- Range, zorunlu olarak son 48 mumun en yüksek/en düşük noktası değildir. Hangi pivotların seçildiği ve ne zaman teyit edildikleri izlenmelidir.
- Sweep: sınır dışına fitil, range içine kapanış. Gerçek breakout: sınır dışında kapanma ve devam koşulları ayrı izlenmelidir.
- Stop, setup'ı geçersiz kılan yapısal nokta; hedef ise önceden anlamlı yapısal fiyat, likidite ya da EQ olmalıdır.
- ATR kitapta yalnızca **araştırma amaçlı otomasyon hipotezlerinde** (bölge genişliği ATR birimi, impuls/ATR, eşit seviye toleransı) geçer. Kesin eğitim kuralı olarak 0,15 × ATR tamponu bulunmaz.
- 48 mum, 0,15 ATR stopu, 0,55 × range projeksiyonu eski mühendislik varsayımlarıdır; eğitmene atfedilemez.

## Araştırma motoru v2
- Kaynak ilkelerine yaklaşan yapısal araştırma kodu: scripts/source_range.py.
- Pivotların kapanmış mumlarla teyit edildiği zaman kaydedilir; gelecekteki pivot geçmişten görünmüş sayılmaz.
- Bir range adayı için ayrı onaylanmış üst-alt swingler, tekrarlı temaslar, RH/RL, EQ ve kaynak pivot indeksleri saklanır; sabit 48 mum kuralı yok.
- Sweep stopu sinyal fitilinin yapısal ekstremidir; ATR çarpanı yok. Hedef onaylı RH/RL orta noktasının EQ'sudur.
- Breakout stopu karşı onaylı swing; hedef ise ancak önceden teyitlenmiş ileri swing varsa seçilir. Yoksa hedef uydurulmaz.
- FVG/OTE ayrı otomatik yorumlama hipotezleri olarak kalır; stopları FVG/swing invalidasyonuna dayanır, ATR stop tamponu içermez.
- scripts/paper_forward.py sinyal anındaki RH/RL/pivot teyit zamanlarını ve yöntem sürümünü kaydeder.
- Eski 48-bar/ATR net-R öğrenme kayıtları yeni yöntemden ayrılır, otomatik modele transfer edilmez.

## Bu henüz eğitmenin birebir otomatik algoritması değil
Kitap bütün pivot teyit ve fiyat yapısı seçimlerini tek sayısal formülle tanımlamaz. Motor hâlâ ayrıca test edilecek bu parametreleri içerir:
- Sol pivot teyit mumları = 3; sağ pivot teyit mumları = 3.
- Arama üst sınırı = son 180 mum: performans kapsamıdır, 180 mumluk range zorunluluğu değildir.
- Benzer pivot fiyat toleransı = seçilen aralık genişliğinin 0,08'i.
- Her sınırda en az iki teyitli pivot teması.
**Bunlar mühendislik araştırma hipotezleridir, Efloud hocanın otomatik işlem kuralları değildir.** Kaynak video grafikleriyle birebir doğrulamadan ve ileri test yapılmadan doğrulanmış kârlılık iddiası kurulamaz.

## Eski sonuçların durumu
Eski kurulumlar legacy_48bar_atr; yeni sinyaller pivot_range_research_v2 etiketini taşır. Eski kapanmış trade ve EMA sonuçları yeni öğrenme modelini eğitmez. Yeni motorun backtesti tamamlanmadan eski raporlar yeni başarı kanıtı gibi gösterilmez. NO TRADE.

Kaynak: EFLOUD PRICE ACTION 44 DERS TEK KITAP GORSELLI 2026, özellikle bölümler 3, 4, 14, 17.