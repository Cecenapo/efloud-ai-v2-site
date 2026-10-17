# RedK Indicator Amplifier — kaynak ve lisans bildirimi

RedK Indicator Amplifier v1.0 — © RedKTrader.

The original indicator is distributed under the **Mozilla Public License 2.0 (MPL-2.0)**. 
Official license text: https://www.mozilla.org/en-US/MPL/2.0/

User-supplied original research archive:
`EFLOUD_AI2_RedK_7680_Model_Entegrasyonu(1).zip`,
`backend/features/redk_amplifier.py`, `backend/research/amplifier_filters.py`, `LICENSES/MPL-2.0.txt`.

Derivative, inspectable source files in this repository:
- `scripts/redk_features.py` — Python RedK oscillator formulas, normalization, peaks, and directional masks.
- `scripts/redk_ablation.py` — **separate independent experimental research** comparing five RedK-derived filters against the same price-action baseline.

The derivative source code is provided under MPL-2.0 with SPDX headers. Preserve copyright and licensing notices with subsequent redistributions. 

**Important evidence limitation:** These filtering conditions were experimental choices from the uploaded model-integration package; they are *not* a proven RedK trading strategy and are *not* taught EFLOUD entry rules. Positive test means are neither independent signals nor established future profits. No broker orders are placed.
