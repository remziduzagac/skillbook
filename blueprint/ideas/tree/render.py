"""Render the skill tree in ../skill-tree.md from tree.json.

Usage: python3 blueprint/ideas/tree/render.py <out-dir>

Writes folders.txt (the tree block, from `skills/skillbook/` to the closing fence),
sources.md (the sources lines) and counts.md (the counts rows) into <out-dir>,
to be pasted into their places in skill-tree.md. Edit tree.json, never the
rendered text alone.
"""
import os
import json, sys, textwrap
SP = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'tree.json'))); NEW = D['tree']
W, COL = 120, 34
out = []
import textwrap as _t
_m = _t.wrap(D.get('main',''), W - COL, break_on_hyphens=False)
out.append('skills/skillbook/'.ljust(COL) + _m[0])
for _l in _m[1:]: out.append('│'.ljust(COL) + _l)
def node(label, desc, prefix, last, kids_present):
    head = prefix + ('└── ' if last else '├── ') + label
    head = head.ljust(COL) if len(head) < COL else head + '  '
    parts = textwrap.wrap(desc, W - len(head), break_on_hyphens=False) or ['']
    out.append(head + parts[0])
    cp = prefix + ('    ' if last else '│   ')
    cont = (cp + ('│' if kids_present else '')).ljust(len(head))
    for p in parts[1:]: out.append(cont + p)
    return cp
def render(n, prefix, last, depth):
    name = '-'.join(n['path'])
    d = name + ': ' + n['desc'] + (' (an idea)' if n['mark'] == '○' else '') + ''.join(f' ({t})' for t in n['tail'])
    cp = node(n['path'][-1] + '/', d, prefix, last, bool(n['kids']))
    big = any(k['kids'] for k in n['kids']) and depth == 0 and all(k['kids'] for k in n['kids'])
    for i, k in enumerate(n['kids']):
        render(k, cp, i == len(n['kids']) - 1, depth + 1)
        if big and i < len(n['kids']) - 1: out.append(cp + '│')
for i, n in enumerate(NEW):
    render(n, '', i == len(NEW) - 1, 0)
    if i < len(NEW) - 1: out.append('│')
open(f'{SP}/folders.txt', 'w').write('\n'.join(out) + '\n')
# sources and counts
src, rows, total = [], [], 0
def walk(n, acc):
    for k in n['kids']:
        acc.append(k); walk(k, acc)
for n in NEW:
    groups = [k for k in n['kids'] if k['kids']] if n['path'][0] in ('engineering', 'productivity') else [n]
    for g in groups:
        acc = []
        walk(g, acc)
        if not g['kids']: acc = [g]
        parts = [('-'.join(k['path'])) + (' (' + k['src'].replace(' ', ', ') + ')' if k['src'] else
                 (' (none yet)' if k['kids'] == [] else '')) for k in acc]
        src.append(f"- **{'-'.join(g['path'])}:** " + '; '.join(parts) + '.')
        cnt = acc if (g is n) else [g] + acc
        mat = sum(1 for k in cnt if k['mark'] == '●'); ideas = len(cnt) - mat
        rows.append((n['path'][0], g['path'][-1] if g is not n else '', len(cnt), mat, ideas)); total += len(cnt)
open(f'{SP}/sources.md', 'w').write('\n'.join(src) + '\n')
open(f'{SP}/counts.md', 'w').write('\n'.join(f'| {a} | {b} | {c} | {d} | {e} |' for a, b, c, d, e in rows) + '\n')
print('total', total, 'max', max(len(l) for l in out), 'lines', len(out))
