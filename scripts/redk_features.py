# SPDX-License-Identifier: MPL-2.0
"""RedK Indicator Amplifier v1.0 derived oscillator features.

SOURCE: user-provided "EFLOUD_AI2_RedK_7680_Model_Entegrasyonu" archive,
backend/features/redk_amplifier.py and backend/research/amplifier_filters.py.
Original "RedK Indicator Amplifier" © RedKTrader, MPL-2.0.
This Python adapter implements the four archived oscillator definitions and
five archived directional filter arms. It is NOT a proven trade strategy or
an EFLOUD instructor trading rule. Only fully closed bars are supplied.
"""
from __future__ import annotations
import math
import pandas as pd
import numpy as np

ARMS=("none","rsi_bias","stoch_flip_recent","cci_impulse",
      "macd_expansion","rsi_macd_agree")
INDICATOR_VERSION="redk_indicator_amplifier_mpl20_v1_adapter"
SOURCE_ATTRIBUTION="RedKTrader RedK Indicator Amplifier v1.0 / MPL-2.0"

def _rma(s:pd.Series,period:int)->pd.Series:
    """Wilder seed on SMA of first period valid values, then recursive RMA."""
    a=s.to_numpy(dtype=float)
    out=np.full(len(a),np.nan)
    valid=np.flatnonzero(np.isfinite(a))
    if len(valid)<period:return pd.Series(out,index=s.index)
    start=int(valid[period-1])
    if np.isfinite(a[start-period+1:start+1]).all():
        out[start]=np.mean(a[start-period+1:start+1])
        for j in range(start+1,len(a)):
            if np.isfinite(a[j]):out[j]=(out[j-1]*(period-1)+a[j])/period
    return pd.Series(out,index=s.index)

def _peak(levels:pd.Series,hold:int=3)->pd.Series:
    arr=levels.to_numpy(dtype=float);out=np.full(len(arr),np.nan)
    peak=age=0
    for i,v in enumerate(arr):
        if not np.isfinite(v):continue
        value=int(v)
        if value>=peak:peak,age=value,0
        else:
            age+=1
            if age>hold:peak=max(value,peak-1)
        out[i]=peak
    return pd.Series(out,index=levels.index)

def feature_matrix(bars)->pd.DataFrame:
    """Exact archived defaults RSI(14), stochastic(14,3), CCI(close20),
    MACD histogram(12,26,9); amplifier normalization and flips.
    Index is integer candle-order; rows must be past-to-future with CLOSED bars.
    """
    if len(bars)<2:raise ValueError("At least 2 closed candles needed")
    h=pd.Series([float(b[2]) for b in bars],dtype=float)
    l=pd.Series([float(b[3]) for b in bars],dtype=float)
    c=pd.Series([float(b[4]) for b in bars],dtype=float)
    if not np.isfinite(h).all() or not np.isfinite(l).all() or not np.isfinite(c).all():
        raise ValueError("NaN or infinite candle")
    if ((h<l)|(c>h)|(c<l)|(l<=0)).any():raise ValueError("Malformed OHLC")
    diff=c.diff()
    up=_rma(diff.clip(lower=0),14)
    down=_rma((-diff).clip(lower=0),14)
    rs=up/down.replace(0,np.nan)
    rsi=100-100/(1+rs)
    rsi=rsi.mask((down==0)&(up>0),100.)
    rsi=rsi.mask((down==0)&(up==0),50.)
    highest=h.rolling(14,min_periods=14).max()
    lowest=l.rolling(14,min_periods=14).min()
    spread=highest-lowest
    k=(100*(c-lowest)/spread.replace(0,np.nan)).mask(spread==0,50.)
    stochastic=k.rolling(3,min_periods=3).mean()
    mean20=c.rolling(20,min_periods=20).mean()
    deviation=c.rolling(20,min_periods=20).apply(
        lambda w:np.abs(w-w.mean()).mean(),raw=True)
    cci=(c-mean20)/(0.015*deviation.replace(0,np.nan))
    cci=cci.mask(deviation==0,0.)
    macd=c.ewm(span=12,adjust=False).mean()-c.ewm(span=26,adjust=False).mean()
    histogram=macd-macd.ewm(span=9,adjust=False).mean()
    histogram=histogram.mask(np.arange(len(histogram))<34)
    series={"rsi":rsi,"stochastic":stochastic,"cci":cci,"macd_hist":histogram}
    sections=[]
    for key,osc in series.items():
        if key in ("rsi","stochastic"):
            scaled=((osc-50)/50).clip(-1,1)
            high_thr,low_thr=(70.,30.) if key=="rsi" else (80.,20.)
            base=50.
        else:
            mx=osc.abs().rolling(100,min_periods=100).max()
            scaled=(osc/mx.replace(0,np.nan)).clip(-1,1).mask(mx==0,0.)
            high_thr,low_thr=(100.,-100.) if key=="cci" else (None,None)
            base=0.
        u=(scaled.clip(lower=0)*10).round()
        d=((-scaled).clip(lower=0)*10).round()
        flips_up=((osc>base)&(osc.shift(1)<=base)).where(
            osc.notna()&osc.shift(1).notna(),False).astype(bool)
        flips_down=((osc<base)&(osc.shift(1)>=base)).where(
            osc.notna()&osc.shift(1).notna(),False).astype(bool)
        prefix="amp_"+key+"_"
        sections.append(pd.DataFrame({
            prefix+"oscillator":osc,prefix+"scaled":scaled,
            prefix+"strength":scaled.abs(),
            prefix+"up_level":u,prefix+"down_level":d,
            prefix+"up_peak":_peak(u),prefix+"down_peak":_peak(d),
            prefix+"delta":osc.diff(),
            prefix+"flip_up":flips_up,prefix+"flip_down":flips_down,
            prefix+"cross_high":((osc>high_thr)&(osc.shift(1)<=high_thr)).fillna(False).astype(bool)
               if high_thr is not None else pd.Series(False,index=c.index),
            prefix+"cross_low":((osc<low_thr)&(osc.shift(1)>=low_thr)).fillna(False).astype(bool)
               if low_thr is not None else pd.Series(False,index=c.index),
        }))
    return pd.concat(sections,axis=1)

def masks(features:pd.DataFrame,side:str)->dict[str,np.ndarray]:
    if side not in ("LONG","SHORT"):raise ValueError("Bad side")
    sign=1 if side=="LONG" else -1
    def positive(kind):
        return (features["amp_"+kind+"_scaled"]*sign>0).fillna(False)
    rsi=positive("rsi")
    stoch=positive("stochastic")
    flip=features["amp_stochastic_flip_"+("up" if sign==1 else "down")].fillna(False)
    cci=positive("cci")&(features["amp_cci_delta"]*sign>0).fillna(False)
    macd=positive("macd_hist")&(features["amp_macd_hist_delta"]*sign>0).fillna(False)
    return {
      "none":np.ones(len(features),dtype=bool),
      "rsi_bias":rsi.to_numpy(dtype=bool),
      "stoch_flip_recent":(stoch&flip.astype(bool).rolling(3,min_periods=3).max().eq(1)).to_numpy(dtype=bool),
      "cci_impulse":cci.to_numpy(dtype=bool),
      "macd_expansion":macd.to_numpy(dtype=bool),
      "rsi_macd_agree":(rsi&positive("macd_hist")).to_numpy(dtype=bool),
    }

def evaluate_at(features:pd.DataFrame,index:int,side:str)->dict[str,bool]:
    if not 0<=index<len(features):raise ValueError("Out of range index")
    return {arm:bool(values[index]) for arm,values in masks(features,side).items()}
