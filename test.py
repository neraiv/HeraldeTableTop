# Yeni hesaplama: Her ay bir önceki ayın faiz getirisiyle birlikte yatırılıyor

ana_para = 12802338.914001187  # İlk ay yatırılan para
faiz_orani = 0.0375  # Aylık faiz oranı (%3.75)
ay_sayisi = 12  # Toplam süre

for ay in range(1, ay_sayisi):
    ana_para *= (1 + faiz_orani)  # Faiz ekleniyor
    ana_para += 70000  # Yeni ayda eklenen miktar

# Sonuçları döndür
print(ana_para)
