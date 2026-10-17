"""Render the skill tree in ../skill-tree.md from tree.json.

Usage: python3 blueprint/design/tree/render.py <out-dir>

Writes three files into <out-dir>, to be pasted into their places in skill-tree.md:
folders.txt (the tree, one block per set in the order of tree.json's "sets", to the closing fence),
sources.md (the sources lines, one per top-level node of a block) and counts.md (the counts rows,
one per top-level node, in block order, as `set / node` rows). Edit tree.json, never the rendered
text alone.

Grouping: every node has a "set" (a root's own; a child's only where it differs from its root's).
A block starts with a top line for the set's main skill (its description from the set's "main", or
from the "main" field at the top of the file for essentials, or from the node named by "main_node"),
then the set's nodes. A child whose set differs from its root's is placed in its own set's block,
under the node of the same path there if one exists (softeng's design holds architecture), else at
the top of the block. A set's "group" names its merged sources and counts line. A node's "label" replaces its folder name, "bare" drops the name before its
description, "id" names it in sources and counts, and "noidea" drops the (an idea) note.
"""
import os
import json, sys, textwrap
SP = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'tree.json')))
W, COL = 120, 34
out = []

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
    name = '' if n.get('bare') else '-'.join(n['path']) + ': '
    d = name + n['desc'] + (' (an idea)' if n['mark'] == '○' and not n.get('noidea') else '') \
        + ''.join(f' ({t})' for t in n['tail'])
    cp = node(n.get('label', n['path'][-1]) + '/', d, prefix, last, bool(n['kids']))
    big = any(k['kids'] for k in n['kids']) and depth == 0 and all(k['kids'] for k in n['kids'])
    for i, k in enumerate(n['kids']):
        render(k, cp, i == len(n['kids']) - 1, depth + 1)
        if big and i < len(n['kids']) - 1: out.append(cp + '│')

def copy(n, kids):
    c = dict(n); c['kids'] = kids; return c

# place every node in its set's block
sets = {s['name']: s for s in D['sets']}
blocks = {s['name']: [] for s in D['sets']}
for r in D['tree']:
    own = []
    for k in r['kids']:
        if k.get('set', r['set']) == r['set']: own.append(k)
    blocks[r['set']].append(copy(r, own))
for r in D['tree']:
    for k in r['kids']:
        s = k.get('set', r['set'])
        if s == r['set']: continue
        host = next((b for b in blocks[s] if b['path'] == r['path']), None)
        (host['kids'] if host else blocks[s]).append(k)
        
main_node = {}
for name, s in sets.items():
    if s.get('main_node'):
        i = next(i for i, b in enumerate(blocks[name]) if b['path'] == [s['main_node']])
        main_node[name] = blocks[name].pop(i)
        blocks[name][0:0] = main_node[name]['kids']

first = True
for name, s in sets.items():
    if not first: out.append('')
    first = False
    nodes = blocks[name]
    if name in main_node:
        m = main_node[name]; text = '-'.join(m['path']) + ': ' + m['desc']
    else:
        text = s.get('main') or (D['main'] if name == 'essentials' else None)
    notes = s.get('notes', [])
    if text:
        lines = textwrap.wrap(text, W - COL, break_on_hyphens=False)
        out.append((name + '/').ljust(COL) + lines[0])
        for l in lines[1:]: out.append('│'.ljust(COL) + l)
        out.append('│')
    for i, n in enumerate(nodes):
        render(n, '', i == len(nodes) - 1 and not notes, 0)
        if i < len(nodes) - 1 and (n['kids'] or nodes[i + 1]['kids']): out.append('│')
    for i, t in enumerate(notes):
        node('(no folder)', t, '', i == len(notes) - 1, False)
open(f'{SP}/folders.txt', 'w').write('\n'.join(out) + '\n')

# sources and counts, one group per top-level node (a block's leaves together where "merge_leaves")
src, rows, total = [], [], 0
def walk(n, acc):
    for k in n['kids']:
        acc.append(k); walk(k, acc)
def ident(n): return n.get('id') or '-'.join(n['path'])
def line(label, members):
    parts = [ident(k) + (' (' + k['src'].replace(' ', ', ') + ')' if k['src'] else
             (' (none yet)' if k['kids'] == [] else '')) for k in members]
    src.append(f"- **{label}:** " + '; '.join(parts) + '.')
for name, s in sets.items():
    groups = []
    if name in main_node:
        groups.append((ident(main_node[name]), main_node[name], blocks[name]))
    elif s.get('merge_leaves'):
        groups.append((s.get('group', name), None, blocks[name]))
    else:
        for n in blocks[name]: groups.append((ident(n), n, None))
    for label, n, members in groups:
        if n is None or members is not None:
            acc = []
            for m in members: acc.append(m); walk(m, acc)
            cnt = acc
        else:
            acc = []; walk(n, acc)
            if not n['kids']: acc = [n]
            cnt = acc
        line(label, acc)
        mat = sum(1 for k in cnt if k['mark'] == '●'); ideas = len(cnt) - mat
        rows.append((f'{name} / ' + (label[len(name) + 1:] if label.startswith(name + '-') else label), len(cnt), mat, ideas)); total += len(cnt)
open(f'{SP}/sources.md', 'w').write('\n'.join(src) + '\n')
open(f'{SP}/counts.md', 'w').write('\n'.join(f'| {a} | {b} | {c} | {d} |' for a, b, c, d in rows) + '\n')
print('total', total, 'max', max(len(l) for l in out), 'lines', len(out))
