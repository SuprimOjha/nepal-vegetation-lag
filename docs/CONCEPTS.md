# Core analysis concepts

## Rainfall and vegetation anomalies

A monthly anomaly compares an observation with a documented expectation, such as a month-of-year climatology over a fixed reference period. The reference period and handling of long-term trends affect interpretation and must be reported.

## Lagged association

With the convention used in this project, lag (k) compares rainfall anomaly at month (t) with NDVI anomaly at month (t+k). A positive lag therefore asks whether vegetation later in time is associated with earlier rainfall. The implementation and displayed labels must preserve this convention.

## Strongest lag

Selecting the lag with the largest absolute correlation is a descriptive selection, not proof that the selected lag is uniquely meaningful. The estimate should be accompanied by sample counts, uncertainty, sensitivity checks, and appropriate multiple-testing control.

## Statistical caution

Monthly series may be serially dependent. Simple independent-observation p-values can be too optimistic. Effective-sample-size approximations are exploratory and should be compared with robust alternatives such as block bootstrap where suitable.

## Geographic caution

A rectangular bounding box around Nepal includes neighboring territory. Country-specific claims require a documented Nepal boundary and explicit raster-pixel inclusion rules.