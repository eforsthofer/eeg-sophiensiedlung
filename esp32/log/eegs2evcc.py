#!/usr/bin/python3 -u
"""
// Download
$ wget https://raw.githubusercontent.com/eforsthofer/eeg-sophiensiedlung/main/esp32/log/mqtt.log

// oder starte am PI, mit

"""
import sys


# python equivalent of c struct
# https://stackoverflow.com/questions/16722337/c-struct-python-equivalent
# Struktur für
# 2022-10-21T11:43:40Z;1ELS0208029975;7.00;0.00;235.20;233.80;232.70;2.19;4.64;2.36;607496.00;5032885.00;189226.00;782955.00;
class mqtt_data(object):
    __slots__ = ['ts', 'id', 'pi','po','v1','v2','v3','i1','i2','i3','ei','eo','ri','ro']
"""
Variable Bezeichnung Type Anmerkung
ts       time stamp
id       id          int  Identifikationsnummer ESP32
pi       power       float Leistung Bezug     (in)   [W]
po       power       float Leistung Lieferung (out)
v1       voltage     float Spannung L1               [Voltage]
v2       voltage     float Spannung L2 
v3       voltage     float Spannung L3 
i1                   float Strom L1                  [Amper]
i2                   float Strom L2 
i3                   float Strom L3 
ei       energy      float Arbeit       Bezug     (in)   [Wh]
eo       energy      float Arbeit       Lieferung (out)
ri       reactive e. float Blind.Arbeit Bezug     (in)   [Wh]
ro       reactive e. float Blind.Arbeit Lieferung (out)
"""

"""
# Leistung Energiegemeinschaft 

22022-10-21T11:43:30Z;1ELS0208029962;0.00;2098.00;232.40;233.80;235.30;3.22;2.91;2.90;1628537.00;3937381.00;216906.00;1164302.00;
2022-10-21T11:43:30Z;1ELS0208029975;21.00;0.00;235.30;234.30;232.70;2.17;4.65;2.34;607496.00;5032885.00;189226.00;782954.00;

"""
s28 = "1ELS0208029962"
s20 = "1ELS0208029975"
s20_pi,s20_po,s28_pi,s28_po = 0.0,0.0,0.0,0.0
def get_eegs_power(msg):
  global s20_pi,s20_po,s28_pi,s28_po
  values = msg.split(";")
  if values[1]==s20:
    s20_pi=float(values[2])
    s20_po=float(values[3])
  if values[1]==s28:
    s28_pi=float(values[2])
    s28_po=float(values[3])
  power=s20_pi-s20_po+s28_pi-s28_po
  return power



def mqtt_read(file_name):
  cnt=1

#  print("Read from " + file_name)
  if file_name=="stdin":
    fobj = sys.stdin
  else:
    fobj = open(file_name)
  for line in fobj:
    print(line)
    eegs_power=get_eegs_power(line)
#   print(eegs_power)
#   power2evcc()
    cnt=cnt+1
  fobj.close()

# main()
mqtt_read("stdin")
