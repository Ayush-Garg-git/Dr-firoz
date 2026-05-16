import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def add_lazy(match):
    img_tag = match.group(0)
    if 'loading="lazy"' in img_tag or "loading='lazy'" in img_tag:
        return img_tag
    if 'fetchpriority="high"' in img_tag or "fetchpriority='high'" in img_tag:
        return img_tag
    if img_tag.endswith('/>'):
        return img_tag[:-2] + ' loading="lazy"/>'
    else:
        return img_tag[:-1] + ' loading="lazy">'

content = re.sub(r'<img\s+[^>]*>', add_lazy, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
